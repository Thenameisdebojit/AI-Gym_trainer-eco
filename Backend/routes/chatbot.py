import os
import httpx
from fastapi import APIRouter
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel
from typing import Optional, Dict, List

from services.chat_service import reply, ollama_chat, get_workout_tip

router = APIRouter(prefix="/chat")

ELEVENLABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"
ELEVENLABS_API_URL = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"


class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    userProfile: Optional[Dict] = None
    workoutHistory: Optional[List[Dict]] = None
    currentExercise: Optional[str] = None
    conversationHistory: Optional[List[Dict]] = None


class WorkoutTipRequest(BaseModel):
    exercise: str
    phase: str = "exercise"
    language: str = "en"
    userProfile: Optional[Dict] = None
    workoutHistory: Optional[List[Dict]] = None


class TTSRequest(BaseModel):
    text: str
    language: str = "en"


@router.post("/")
async def chat(req: ChatRequest):
    try:
        response = await ollama_chat(
            req.message,
            req.language,
            req.userProfile,
            req.workoutHistory,
            req.currentExercise,
            req.conversationHistory,
        )
        if response:
            return {"response": response}
    except Exception:
        pass
    return {"response": reply(req.message, req.language)}


@router.post("/workout-tip")
async def workout_tip(req: WorkoutTipRequest):
    tip = await get_workout_tip(
        req.exercise,
        req.phase,
        req.language,
        req.userProfile,
        req.workoutHistory,
    )
    return {"tip": tip}


@router.post("/tts")
async def tts(req: TTSRequest):
    api_key = os.environ.get("ELEVENLABS_API_KEY", "")
    if not api_key:
        return Response(status_code=503, content="ElevenLabs API key not configured")

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                ELEVENLABS_API_URL,
                headers={
                    "xi-api-key": api_key,
                    "Content-Type": "application/json",
                    "Accept": "audio/mpeg",
                },
                json={
                    "text": req.text,
                    "model_id": "eleven_multilingual_v2",
                    "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
                },
            )
            if resp.status_code != 200:
                return Response(status_code=503, content="TTS service error")

            audio_bytes = resp.content
            return StreamingResponse(
                iter([audio_bytes]),
                media_type="audio/mpeg",
                headers={"Cache-Control": "no-store"},
            )
    except Exception:
        return Response(status_code=503, content="TTS service unavailable")
