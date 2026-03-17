from fastapi import APIRouter
from services.diet_service import generate_diet

router = APIRouter(prefix="/diet")

@router.post("/")
def diet(weight: float, height: float, goal: str):
    bmi, category, diet = generate_diet(weight, height, goal)

    return {
        "BMI": round(bmi,2),
        "Category": category,
        "Diet": diet
    }