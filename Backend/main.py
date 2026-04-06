import asyncio
import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import engine, Base
from routes import workout, diet, chatbot, behavior, recommendation, pose, sessions, auth
from routes import exercises as exercises_route
from models import session as session_model
from services.chat_service import ensure_model_available

logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    _check_env_config()
    asyncio.create_task(_pull_ollama_model())
    yield


def _check_env_config():
    import os
    missing = []
    warnings = []

    if not os.environ.get("SMTP_USER") or not os.environ.get("SMTP_PASS"):
        warnings.append(
            "SMTP_USER / SMTP_PASS not set — OTP emails will NOT be delivered. "
            "The OTP will be returned in the API response instead (dev/demo mode). "
            "Set these secrets for production email delivery."
        )

    if not os.environ.get("ELEVENLABS_API_KEY"):
        warnings.append("ELEVENLABS_API_KEY not set — AI voice responses disabled.")

    google_verify = os.environ.get("GOOGLE_VERIFY_TOKENS", "true").lower()
    if google_verify == "false":
        warnings.append(
            "GOOGLE_VERIFY_TOKENS=false — Google token verification is DISABLED. "
            "Only use this in local development."
        )

    for w in warnings:
        logger.warning("[CONFIG] %s", w)

    if missing:
        for m in missing:
            logger.error("[CONFIG] REQUIRED: %s", m)


async def _pull_ollama_model():
    available = await ensure_model_available()
    if available:
        logger.info("Ollama llama3 model is ready.")
    else:
        logger.info("Ollama not available — AI chat will use keyword fallback.")


app = FastAPI(
    title="Universal AI Fitness Trainer API",
    version="2.0",
    description="Backend for the Universal AI Fitness Trainer — workout generation, pose detection, diet, and more.",
    lifespan=lifespan,
)

_CORS_ORIGINS = [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
]
_replit_domain = os.environ.get("REPLIT_DEV_DOMAIN")
if _replit_domain:
    _CORS_ORIGINS.append(f"https://{_replit_domain}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)

app.include_router(workout.router)
app.include_router(diet.router)
app.include_router(chatbot.router)
app.include_router(behavior.router)
app.include_router(recommendation.router)
app.include_router(pose.router)
app.include_router(exercises_route.router)
app.include_router(sessions.router)
app.include_router(auth.router)


@app.get("/")
def home():
    return {
        "status": "Running",
        "version": "2.0",
        "app": "Universal AI Fitness Trainer",
        "features": [
            "workout",
            "workout/generate",
            "exercises",
            "diet",
            "chat",
            "pose-detect",
            "recommendations",
            "calories/calculate",
        ],
    }
