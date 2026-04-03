from fastapi import APIRouter
from pydantic import BaseModel
from config.database import SessionLocal
from models.session import Session
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/sessions")

class SessionCreate(BaseModel):
    title: str = "Workout Session"
    exercises_completed: int = 0
    duration: int = 0
    calories: float = 0.0
    body_part: str = "full_body"
    level: str = "beginner"

@router.post("/save")
def save_session(data: SessionCreate):
    db = SessionLocal()
    try:
        session = Session(
            title=data.title,
            exercises_completed=data.exercises_completed,
            duration=data.duration,
            calories=data.calories,
            body_part=data.body_part,
            level=data.level,
            date=datetime.utcnow(),
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return {"message": "Session saved", "id": session.id}
    finally:
        db.close()

@router.get("/history")
def get_session_history(limit: int = 20):
    db = SessionLocal()
    try:
        sessions = db.query(Session).order_by(Session.id.desc()).limit(limit).all()
        return [
            {
                "id": s.id,
                "title": s.title,
                "exercises_completed": s.exercises_completed,
                "duration": s.duration,
                "calories": round(s.calories, 1),
                "body_part": s.body_part,
                "level": s.level,
                "date": s.date.isoformat() if s.date else None,
            }
            for s in sessions
        ]
    finally:
        db.close()

@router.get("/stats")
def get_session_stats():
    db = SessionLocal()
    try:
        sessions = db.query(Session).all()
        total_sessions = len(sessions)
        total_calories = sum(s.calories for s in sessions)
        total_minutes = sum(s.duration for s in sessions) // 60
        total_exercises = sum(s.exercises_completed for s in sessions)
        return {
            "total_sessions": total_sessions,
            "total_calories": round(total_calories, 1),
            "total_minutes": total_minutes,
            "total_exercises": total_exercises,
        }
    finally:
        db.close()
