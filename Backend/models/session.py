from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from config.database import Base

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True)
    title = Column(String, default="Workout Session")
    exercises_completed = Column(Integer, default=0)
    duration = Column(Integer, default=0)
    calories = Column(Float, default=0.0)
    body_part = Column(String, default="full_body")
    level = Column(String, default="beginner")
    date = Column(DateTime, default=datetime.utcnow)
