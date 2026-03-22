from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import engine, Base
from routes import workout, diet, chatbot, behavior

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Fitness Assistant")

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

@app.get("/")
def home():
    return {"status": "Running"}
