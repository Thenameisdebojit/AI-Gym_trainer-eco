from fastapi import APIRouter
from config.database import SessionLocal
from models.workout import Workout
from pydantic import BaseModel

router = APIRouter(prefix="/workout")

class WorkoutSave(BaseModel):
    exercise: str
    reps: int
    score: int
    calories: float = 0.0

@router.post("/save")
def save_workout(data: WorkoutSave):
    db = SessionLocal()
    try:
        workout = Workout(
            exercise=data.exercise,
            reps=data.reps,
            score=data.score,
            calories=data.calories,
        )
        db.add(workout)
        db.commit()
        return {"message": "Workout saved", "id": workout.id}
    finally:
        db.close()

@router.get("/stats")
def get_stats():
    db = SessionLocal()
    try:
        workouts = db.query(Workout).all()
        total_reps = sum(w.reps for w in workouts)
        avg_score = sum(w.score for w in workouts) / len(workouts) if workouts else 0
        calories_burned = sum(w.calories for w in workouts)
        return {
            "total_reps": total_reps,
            "avg_score": round(avg_score, 1),
            "total_workouts": len(workouts),
            "calories_burned": round(calories_burned, 1),
        }
    finally:
        db.close()

@router.get("/history")
def get_history(limit: int = 20):
    db = SessionLocal()
    try:
        workouts = db.query(Workout).order_by(Workout.id.desc()).limit(limit).all()
        return [
            {"id": w.id, "exercise": w.exercise, "reps": w.reps, "score": w.score, "calories": w.calories}
            for w in workouts
        ]
    finally:
        db.close()
