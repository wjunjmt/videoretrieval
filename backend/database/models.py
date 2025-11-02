from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:password@postgres/video_retrieval")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# The rest of the models file remains the same...
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    filepath = Column(String, unique=True)
    duration = Column(Float)
    frame_count = Column(Integer)
    upload_time = Column(DateTime, default=datetime.utcnow)

    frames = relationship("Frame", back_populates="video")
    segments = relationship("VideoSegment", back_populates="video")

class Frame(Base):
    __tablename__ = "frames"
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"))
    frame_number = Column(Integer)
    timestamp = Column(Float)
    image_path = Column(String, unique=True)

    video = relationship("Video", back_populates="frames")

class VideoSegment(Base):
    __tablename__ = "video_segments"
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"))
    start_frame = Column(Integer)
    end_frame = Column(Integer)

    video = relationship("Video", back_populates="segments")

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
