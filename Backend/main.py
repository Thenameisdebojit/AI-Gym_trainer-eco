from fastapi import FastAPI
from config.database import engine, Base
from routes import workout, diet, chatbot, behavior
from routes import recommendation

app.include_router(recommendation.router)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Fitness Assistant")

app.include_router(workout.router)
app.include_router(diet.router)
app.include_router(chatbot.router)
app.include_router(behavior.router)

@app.get("/")
def home():
    return {"status": "Running"}