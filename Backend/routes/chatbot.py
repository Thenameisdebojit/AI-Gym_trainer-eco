from fastapi import APIRouter
from services.chat_service import reply

router = APIRouter(prefix="/chat")

@router.post("/")
def chat(message: str, language: str = "en"):
    return {"response": reply(message, language)}
