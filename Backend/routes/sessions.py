from fastapi import APIRouter
from pydantic import BaseModel
from config.database import SessionLocal
from models.session import Session
from datetime import datetime, timedelta
from typing import Optional
from config.mongodb import mongo_save_session, mongo_get_stats, mongo_get_history

router = APIRouter(prefix="/sessions")

class SessionCreate(BaseModel):
    title: str = "Workout Session"
    exercises_completed: int = 0
    duration: int = 0
    calories: float = 0.0
    body_part: str = "full_body"
    level: str = "beginner"
    user_id: str = "default"

@router.post("/save")
async def save_session(data: SessionCreate):
    now = datetime.utcnow()
    db = SessionLocal()
    try:
        session = Session(
            title=data.title,
            exercises_completed=data.exercises_completed,
            duration=data.duration,
            calories=data.calories,
            body_part=data.body_part,
            level=data.level,
            date=now,
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        sqlite_id = session.id
    finally:
        db.close()

    await mongo_save_session({
        "user_id": data.user_id,
        "title": data.title,
        "exercises_completed": data.exercises_completed,
        "duration": data.duration,
        "calories": data.calories,
        "body_part": data.body_part,
        "level": data.level,
        "date": now,
    })

    return {"message": "Session saved", "id": sqlite_id}

@router.get("/history")
async def get_session_history(limit: int = 20, user_id: str = "default"):
    mongo_history = await mongo_get_history(user_id, limit)
    if mongo_history:
        return mongo_history

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
async def get_session_stats(user_id: str = "default"):
    now = datetime.utcnow()
    week_start = (now - timedelta(days=now.weekday())).replace(
        hour=0, minute=0, second=0, microsecond=0
    )

    db = SessionLocal()
    try:
        sessions = db.query(Session).all()
        total_sessions = len(sessions)
        total_calories = sum(s.calories for s in sessions)
        total_minutes = sum(s.duration for s in sessions) // 60
        total_exercises = sum(s.exercises_completed for s in sessions)
        this_week = sum(
            1 for s in sessions
            if s.date and s.date >= week_start
        )
    finally:
        db.close()

    mongo_stats = await mongo_get_stats(user_id)
    if mongo_stats:
        total_sessions = mongo_stats.get("total_sessions", total_sessions)
        total_calories = mongo_stats.get("total_calories", total_calories)
        total_minutes = int(mongo_stats.get("total_minutes", total_minutes))
        total_exercises = mongo_stats.get("total_exercises", total_exercises)

    return {
        "total_sessions": total_sessions,
        "total_calories": round(total_calories, 1),
        "total_minutes": total_minutes,
        "total_exercises": total_exercises,
        "this_week": this_week,
    }
