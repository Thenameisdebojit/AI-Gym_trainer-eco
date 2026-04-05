from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import engine, Base
from routes import workout, diet, chatbot, behavior, recommendation, pose, sessions, auth
from routes import exercises as exercises_route
from models import session as session_model

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Universal AI Fitness Trainer API",
    version="2.0",
    description="Backend for the Universal AI Fitness Trainer — workout generation, pose detection, diet, and more.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
