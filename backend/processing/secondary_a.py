import towhee
from ultralytics import YOLO
from PIL import Image
import numpy as np
from shapely.geometry import Polygon, Point

from database.models import SessionLocal, Frame, RecognizedObject, ObjectDetection, Alert, AlertRule
from milvus.vector_store import REID_COLLECTION
from pymilvus import Collection, connections, utility
from alerts.rules import get_alert_rules

# ... (model loading remains the same)

def check_for_alerts(db: Session, frame_id: int, detection: ObjectDetection):
    """
    Checks if a detection triggers any active alert rules.
    """
    rules = get_alert_rules(db)
    for rule in rules:
        if rule.rule_type == 'intrusion':
            # Check if the object's center point is inside the polygon
            polygon = Polygon(rule.parameters.get('polygon', []))
            center_x = (detection.box_x1 + detection.box_x2) / 2
            center_y = (detection.box_y1 + detection.box_y2) / 2
            point = Point(center_x, center_y)

            if polygon.contains(point):
                # Check if an alert for this object and rule already exists recently
                # to avoid spamming alerts. (Simplified for now)
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
    # ... (try-finally block and initial setup remains the same)

        # ... (inside the loop over detected boxes)
        if recognized_obj:
            detection = ObjectDetection(...)
            db.add(detection)
            db.flush() # Flush to get an ID for the detection

            # Check for alerts
            check_for_alerts(db, frame_id, detection)

    # ... (rest of the function remains the same)

# Note: This is a simplified version. The full file would need more careful integration.
# I will now overwrite the full file with the integrated logic.
