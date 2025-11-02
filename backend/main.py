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
from auth import get_current_user
from database.models import User

@app.get("/videos")
async def get_videos(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Fetches a list of all videos from the database. Requires authentication.
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

# --- Alerting Endpoints ---
from alerts.rules import (
    create_alert_rule,
    get_alert_rules,
    get_alert_rule,
    update_alert_rule,
    delete_alert_rule,
)
from database.models import Alert
from pydantic import BaseModel
from typing import List, Dict, Any

class AlertRuleCreate(BaseModel):
    name: str
    rule_type: str
    parameters: Dict[str, Any]

@app.post("/alerts/rules")
def create_new_alert_rule(rule: AlertRuleCreate, db: Session = Depends(get_db)):
    db_rule = create_alert_rule(db=db, name=rule.name, rule_type=rule.rule_type, parameters=rule.parameters)
    return db_rule

@app.get("/alerts/rules")
def read_alert_rules(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    rules = get_alert_rules(db, skip=skip, limit=limit)
    return rules

@app.get("/alerts")
def read_alerts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    alerts = db.query(Alert).order_by(Alert.timestamp.desc()).offset(skip).limit(limit).all()
    return alerts

# --- Auth Endpoints ---
from fastapi.security import OAuth2PasswordRequestForm
from auth import create_access_token, get_user, get_password_hash, verify_password
from datetime import timedelta

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/register")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- User & Role Management Endpoints ---
from database.models import Role

class RoleCreate(BaseModel):
    name: str
    permissions: Dict[str, Any]

from auth import role_checker

@app.post("/roles")
def create_role(role: RoleCreate, db: Session = Depends(get_db), current_user: User = Depends(role_checker("manage_roles"))):
    db_role = Role(name=role.name, permissions=role.permissions)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

@app.get("/roles")
def get_roles(db: Session = Depends(get_db)):
    return db.query(Role).all()

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
