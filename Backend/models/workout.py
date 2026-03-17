from sqlalchemy import Column, Integer, String
from config.database import Base

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True)
    exercise = Column(String)
    reps = Column(Integer)
    score = Column(Integer)