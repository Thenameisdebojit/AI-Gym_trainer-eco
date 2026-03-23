from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from services.diet_service import generate_full_diet, calculate_bmi

router = APIRouter(prefix="/diet")


class DietRequest(BaseModel):
    age: int = 25
    gender: str = "male"
    height: float = 170
    weight: float = 70
    goal: str = "muscle_gain"
    activity: str = "moderate"
    diet_type: str = "vegetarian"
    budget: str = "medium"
    allergies: Optional[List[str]] = []


@router.post("/")
def diet(request: DietRequest):
    return generate_full_diet(
        age=request.age,
        gender=request.gender,
        height=request.height,
        weight=request.weight,
        goal=request.goal,
        activity=request.activity,
        diet_type=request.diet_type,
        budget=request.budget,
        allergies=request.allergies or [],
    )


@router.get("/bmi")
def bmi(weight: float, height: float):
    return calculate_bmi(weight, height)
