from fastapi import APIRouter
from config.database import SessionLocal
from models.workout import Workout

router = APIRouter(prefix="/workout")

# ✅ EXISTING
@router.post("/save")
def save_workout(exercise: str, reps: int, score: int):
    db = SessionLocal()

    workout = Workout(
        exercise=exercise,
        reps=reps,
        score=score
    )

    db.add(workout)
    db.commit()

    return {"message": "Workout saved"}


# 🔥 ADD THIS (ANALYTICS)
@router.get("/stats")
def get_stats():
    db = SessionLocal()
    workouts = db.query(Workout).all()

    total_reps = sum([w.reps for w in workouts])
    avg_score = sum([w.score for w in workouts]) / len(workouts) if workouts else 0

    return {
        "total_reps": total_reps,
        "avg_score": avg_score
    }