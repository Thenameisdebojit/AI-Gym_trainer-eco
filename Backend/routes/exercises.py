from fastapi import APIRouter, Query
from services.workout_generator import (
    generate_workout,
    get_all_exercises,
    get_exercises_by_domain,
    calculate_calories,
)
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class WorkoutGenerateRequest(BaseModel):
    goal: str = "general"
    equipment: str = "none"
    level: str = "beginner"
    duration_minutes: int = 30


class CalorieRequest(BaseModel):
    weight_kg: float
    met_value: float
    duration_minutes: float


@router.get("/exercises")
def get_exercises(domain: Optional[str] = Query(None)):
    if domain:
        return get_exercises_by_domain(domain)
    return get_all_exercises()


@router.post("/workout/generate")
def generate_workout_plan(request: WorkoutGenerateRequest):
    valid_goals = {"muscle_gain", "fat_loss", "flexibility", "mma", "general"}
    valid_equipment = {"none", "minimal", "full_gym"}
    valid_levels = {"beginner", "intermediate", "advanced"}

    goal = request.goal if request.goal in valid_goals else "general"
    equipment = request.equipment if request.equipment in valid_equipment else "none"
    level = request.level if request.level in valid_levels else "beginner"
    duration = max(10, min(90, request.duration_minutes))

    return generate_workout(goal, equipment, level, duration)


@router.post("/calories/calculate")
def calculate_calorie_burn(request: CalorieRequest):
    calories = calculate_calories(request.weight_kg, request.met_value, request.duration_minutes)
    return {"calories_burned": calories}
