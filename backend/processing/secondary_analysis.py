import towhee
from ultralytics import YOLO
from PIL import Image
import numpy as np
from shapely.geometry import Polygon, Point

from database.models import SessionLocal, Frame, RecognizedObject, ObjectDetection, Alert, AlertRule
from milvus.vector_store import REID_COLLECTION
from pymilvus import Collection, connections, utility
from alerts.rules import get_alert_rules

# Load models once
yolo_model = YOLO('yolov8n.pt')
person_reid_pipeline = towhee.pipelines.get_pipeline('person-reid-resnet50')
vehicle_reid_pipeline = towhee.pipelines.get_pipeline('vehicle-reid-resnet50')
plate_recognition_pipeline = towhee.pipelines.get_pipeline('license-plate-recognition-openvino')
face_recognition_pipeline = towhee.pipelines.get_pipeline('face-recognition-arcface')

def check_for_alerts(db: Session, frame_id: int, detection: ObjectDetection):
    """
    Checks if a detection triggers any active alert rules.
    """
    rules = get_alert_rules(db)
    for rule in rules:
        if rule.rule_type == 'intrusion':
            polygon = Polygon(rule.parameters.get('polygon', []))
            center_x = (detection.box_x1 + detection.box_x2) / 2
            center_y = (detection.box_y1 + detection.box_y2) / 2
            point = Point(center_x, center_y)

            if polygon.contains(point):
                new_alert = Alert(
                    rule_id=rule.id,
                    frame_id=frame_id,
                    object_id=detection.object_id,
                    status='new'
                )
                db.add(new_alert)
                print(f"Intrusion Alert triggered for object {detection.object_id} by rule {rule.id}")

def analyze_frame(frame_id: int):
    """
    Performs secondary analysis on a frame and checks for alerts.
    """
    db = SessionLocal()
    try:
        frame = db.query(Frame).filter(Frame.id == frame_id).first()
        if not frame: return

        print(f"Analyzing frame {frame_id}...")
        results = yolo_model(frame.image_path)

        connections.connect(host="milvus", port="19530")
        reid_collection = Collection(REID_COLLECTION)
        reid_collection.load()

        for result in results:
            for box in result.boxes:
                obj_class = yolo_model.names[int(box.cls)]

                if obj_class in ['person', 'car']:
                    x1, y1, x2, y2 = box.xyxy[0]
                    cropped_img = Image.open(frame.image_path).crop((x1.item(), y1.item(), x2.item(), y2.item()))

                    attributes = {}
                    if obj_class == 'person':
                        reid_embedding = person_reid_pipeline(cropped_img)
                    else: # car
                        reid_embedding = vehicle_reid_pipeline(cropped_img)
                        plate_text, _ = plate_recognition_pipeline(cropped_img)
                        attributes['license_plate'] = plate_text

                    reid_vector = reid_embedding[0]

                    search_params = {"metric_type": "L2", "params": {"nprobe": 10}}
                    search_results = reid_collection.search(data=[reid_vector.tolist()], anns_field="embedding", param=search_params, limit=1, output_fields=['object_id'])

                    recognized_obj = None
                    if search_results and search_results[0] and search_results[0][0].distance < 0.2:
                        object_id = search_results[0][0].entity.get('object_id')
                        recognized_obj = db.query(RecognizedObject).filter(RecognizedObject.id == object_id).first()
                        if attributes and recognized_obj:
                            if not recognized_obj.attributes or recognized_obj.attributes.get('license_plate') != attributes.get('license_plate'):
                                recognized_obj.attributes = {**(recognized_obj.attributes or {}), **attributes}
                    else:
                        recognized_obj = RecognizedObject(object_type=obj_class, attributes=attributes)
                        db.add(recognized_obj)
                        db.commit()
                        db.refresh(recognized_obj)
                        reid_collection.insert([[recognized_obj.id], [recognized_obj.id], [reid_vector.tolist()]])

                    if recognized_obj:
                        detection = ObjectDetection(frame_id=frame_id, object_id=recognized_obj.id, box_x1=x1.item(), box_y1=y1.item(), box_x2=x2.item(), box_y2=y2.item())
                        db.add(detection)
                        db.flush()
                        check_for_alerts(db, frame_id, detection)

        db.commit()
        print(f"Finished analysis for frame {frame_id}")

    except Exception as e:
        print(f"Error analyzing frame {frame_id}: {e}")
        db.rollback()
    finally:
        db.close()
        if utility.has_connection("default"):
            connections.disconnect("default")
