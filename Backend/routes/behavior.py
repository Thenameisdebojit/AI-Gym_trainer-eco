from fastapi import APIRouter
from services.behavior_service import predict_skip

router = APIRouter(prefix="/behavior")

@router.get("/")
def behavior(days_missed: int, consistency: int):
    return {
        "prediction": predict_skip(days_missed, consistency)
    }