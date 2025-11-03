import towhee
from pathlib import Path
from database.models import SessionLocal, Video, Frame, VideoSegment
from milvus.vector_store import VIDEO_SEGMENT_COLLECTION, FRAME_COLLECTION
from pymilvus import Collection, connections, utility
from models.loader import get_model_loader
import cv2
import numpy as np

FRAME_STORAGE_DIR = Path("uploads/frames")
FRAME_STORAGE_DIR.mkdir(parents=True, exist_ok=True)

def process_video(video_path: str):
    """
    Processes a video file: extracts frames, generates embeddings, and stores data.
    """
    print(f"Starting processing for video: {video_path}")
    db = SessionLocal()
    video_record = None
    model_loader = get_model_loader()

    try:
        # --- 1. Create Video record in PostgreSQL ---
        video_filename = Path(video_path).name
        video_record = Video(filename=video_filename, filepath=video_path)
        db.add(video_record)
        db.commit()
        db.refresh(video_record)
        print(f"Created video record with ID: {video_record.id}")

        # --- 2. Connect to Milvus ---
        connections.connect(host="milvus", port="19530")
        frame_collection = Collection(FRAME_COLLECTION)
        video_segment_collection = Collection(VIDEO_SEGMENT_COLLECTION)

        # --- 3. Towhee Pipeline for Frame and Video Segment Vectorization ---
        video_pipeline = model_loader.get_text_video_pipeline()

        frame_vectors = []
        frames_for_db = []

        # Correctly decode video at 1 frame per second
        frame_pipeline = (
            towhee.glob(video_path)
                  .video_decode.ffmpeg(fps=1)
                  .image_embedding.timm(model_name='vit_base_patch16_224')
        )

        frame_count = 0
        for i, (frame_img_np, frame_vec) in enumerate(frame_pipeline):
            # Save frame to disk
            frame_filename = f"{video_record.id}_frame_{i}.jpg"
            frame_filepath = FRAME_STORAGE_DIR / frame_filename
            cv2.imwrite(str(frame_filepath), cv2.cvtColor(frame_img_np, cv2.COLOR_RGB2BGR))

            frame_record = Frame(video_id=video_record.id, frame_number=i, timestamp=float(i), image_path=str(frame_filepath))
            frames_for_db.append(frame_record)
            frame_vectors.append(frame_vec)
            frame_count += 1

        db.add_all(frames_for_db)
        db.commit()

        frame_ids = [f.id for f in frames_for_db]
        frame_collection.insert([frame_ids, [video_record.id] * len(frame_ids), [vec.tolist() for vec in frame_vectors]])
        print(f"Inserted {len(frame_ids)} frame vectors into Milvus.")

        video_embedding = video_pipeline.encode_video(video_path)

        segment_record = VideoSegment(video_id=video_record.id, start_frame=0, end_frame=frame_count - 1)
        db.add(segment_record)
        db.commit()
        db.refresh(segment_record)

        video_segment_collection.insert([[segment_record.id], [video_record.id], [video_embedding.tolist()]])
        print(f"Inserted video segment vector into Milvus for video ID: {video_record.id}")

        video_record.frame_count = frame_count
        db.commit()

        print(f"Successfully processed video: {video_path}")

    except Exception as e:
        print(f"Error processing video {video_path}: {e}")
        if db.is_active:
            db.rollback()
    finally:
        if db.is_active:
            db.close()
        if utility.has_connection("default"):
            connections.disconnect("default")
        print(f"Finished processing for video: {video_path}")
