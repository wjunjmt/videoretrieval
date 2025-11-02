from fastapi import FastAPI, UploadFile, File, BackgroundTasks
import shutil
import os
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Depends
import shutil
import os
from pathlib import Path
from sqlalchemy.orm import Session

# Assume processing logic will be in this file
from processing.pipeline import process_video
from search.text_search import search_videos_by_text
from database.models import SessionLocal, Video
from models.loader import get_model_loader

app = FastAPI(title="Multimodal Video Retrieval System")

@app.on_event("startup")
async def startup_event():
    # This will preload the models
    get_model_loader()

# Ensure upload directory exists
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Multimodal Video Retrieval System API"}

@app.post("/videos/upload")
async def upload_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    Accepts a video file, saves it, and triggers a background task for processing.
    """
    filepath = UPLOAD_DIR / file.filename

    # Save the uploaded file
    with filepath.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Add the processing job to the background
    background_tasks.add_task(process_video, str(filepath))

    return {"message": "Video uploaded successfully. Processing has started in the background.", "filepath": str(filepath)}

@app.post("/search")
async def search_videos(query: str, db: Session = Depends(get_db)):
    """
    Accepts a text query, converts it to an embedding, and searches for relevant videos.
    """
    print(f"Received search query: {query}")

    # Perform the search in Milvus to get video IDs and scores
    search_results = search_videos_by_text(query)

    if not search_results:
        return {"results": []}

    # Create a dictionary for easy score lookup
    video_info = {result['video_id']: result['score'] for result in search_results}
    video_ids = list(video_info.keys())

    # Fetch video details from PostgreSQL for the retrieved IDs
    videos = db.query(Video).filter(Video.id.in_(video_ids)).all()

    # Combine DB metadata with Milvus scores
    response_data = []
    for video in videos:
        response_data.append({
            "video_id": video.id,
            "filename": video.filename,
            "filepath": video.filepath,
            "score": video_info.get(video.id, 0) # Attach the score
        })

    # Sort results by score (L2 distance, lower is better)
    response_data.sort(key=lambda x: x['score'])

    return {"results": response_data}

from processing.secondary_analysis import analyze_frame

@app.get("/videos")
async def get_videos(db: Session = Depends(get_db)):
    """
    Fetches a list of all videos from the database.
    """
    videos = db.query(Video).order_by(Video.upload_time.desc()).all()
    return videos

@app.get("/videos/{video_id}")
async def get_video_details(video_id: int, db: Session = Depends(get_db)):
    """
    Fetches detailed information for a single video, including its frames.
    """
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        return {"error": "Video not found"}
    # Manually construct response to include frames
    return {
        "id": video.id,
        "filename": video.filename,
        "filepath": video.filepath,
        "frames": [{"id": frame.id, "image_path": frame.image_path} for frame in video.frames]
    }

@app.post("/frames/{frame_id}/analyze")
async def analyze_frame_endpoint(frame_id: int, background_tasks: BackgroundTasks):
    """
    Triggers a background task to perform secondary analysis on a specific frame.
    """
    background_tasks.add_task(analyze_frame, frame_id)
    return {"message": "Frame analysis has been initiated in the background."}

@app.get("/objects/{object_id}/trajectory")
async def get_object_trajectory(object_id: int, db: Session = Depends(get_db)):
    """
    Fetches the trajectory of a recognized object across all frames.
    """
    detections = db.query(ObjectDetection).filter(ObjectDetection.object_id == object_id).all()

    trajectory = []
    for det in detections:
        trajectory.append({
            "frame_id": det.frame_id,
            "video_id": det.frame.video_id,
            "timestamp": det.frame.timestamp,
            "box": [det.box_x1, det.box_y1, det.box_x2, det.box_y2],
            "frame_path": det.frame.image_path
        })

    return {"trajectory": trajectory}

@app.get("/frames/{frame_id}/detections")
async def get_frame_detections(frame_id: int, db: Session = Depends(get_db)):
    """
    Fetches all object detections for a specific frame, including object type and attributes.
    """
    detections = db.query(ObjectDetection).filter(ObjectDetection.frame_id == frame_id).all()

    response = []
    for det in detections:
        response.append({
            "id": det.id,
            "object_id": det.object_id,
            "box_x1": det.box_x1,
            "box_y1": det.box_y1,
            "box_x2": det.box_x2,
            "box_y2": det.box_y2,
            "object_type": det.recognized_object.object_type,
            "attributes": det.recognized_object.attributes
        })
    return response
