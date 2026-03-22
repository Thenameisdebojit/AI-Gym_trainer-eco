from fastapi import APIRouter
from config.database import SessionLocal
from models.workout import Workout

router = APIRouter(prefix="/recommendations")

@router.get("/")
def get_recommendations(user_id: str = "default"):
    db = SessionLocal()
    try:
        workouts = db.query(Workout).order_by(Workout.id.desc()).limit(10).all()
        done_exercises = [w.exercise for w in workouts]
        all_exercises = [
            {"id": "pushup_normal", "name": "Normal Push-up", "category": "freehand", "subcategory": "Chest", "difficulty": "beginner", "targetMuscles": ["Chest", "Triceps"], "description": "Classic push-up", "caloriesPerRep": 0.5},
            {"id": "squat_bodyweight", "name": "Bodyweight Squat", "category": "freehand", "subcategory": "Legs", "difficulty": "beginner", "targetMuscles": ["Quads", "Glutes"], "description": "Fundamental squat", "caloriesPerRep": 0.4},
            {"id": "pullup", "name": "Pull-up", "category": "calisthenics", "subcategory": "Beginner", "difficulty": "intermediate", "targetMuscles": ["Lats", "Biceps"], "description": "Upper body pull", "caloriesPerRep": 0.8},
            {"id": "crunch", "name": "Crunch", "category": "freehand", "subcategory": "Abs", "difficulty": "beginner", "targetMuscles": ["Abs"], "description": "Core exercise", "caloriesPerRep": 0.3},
            {"id": "lunge", "name": "Forward Lunge", "category": "freehand", "subcategory": "Legs", "difficulty": "beginner", "targetMuscles": ["Quads", "Glutes"], "description": "Leg exercise", "caloriesPerRep": 0.45},
        ]
        recs = [e for e in all_exercises if e["id"] not in done_exercises]
        return recs if recs else all_exercises[:3]
    finally:
        db.close()
