from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter(prefix="/pose-detect")

class PoseRequest(BaseModel):
    frame: str
    exercise_type: str

FEEDBACK_BY_EXERCISE = {
    "pushup": ["Lower your chest more", "Great form!", "Keep your back straight", "Full range of motion!", "Excellent depth!"],
    "squat": ["Go lower", "Keep chest up", "Knees behind toes", "Great squat depth!", "Drive through heels"],
    "pullup": ["Full hang at bottom", "Chin over bar!", "Control the descent", "Squeeze your lats", "Great pull!"],
    "default": ["Good form!", "Keep it up!", "Stay consistent", "You're doing great!", "Maintain posture"],
}

@router.post("/")
def detect_pose(request: PoseRequest):
    ex_key = "default"
    for key in FEEDBACK_BY_EXERCISE:
        if key in request.exercise_type.lower():
            ex_key = key
            break

    feedback_pool = FEEDBACK_BY_EXERCISE[ex_key]
    feedback = random.choice(feedback_pool)
    confidence = round(random.uniform(0.78, 0.97), 2)

    mock_keypoints = [
        [random.uniform(0.4, 0.6), random.uniform(0.1, 0.2)],
        [random.uniform(0.35, 0.45), random.uniform(0.2, 0.35)],
        [random.uniform(0.55, 0.65), random.uniform(0.2, 0.35)],
        [random.uniform(0.3, 0.4), random.uniform(0.35, 0.5)],
        [random.uniform(0.6, 0.7), random.uniform(0.35, 0.5)],
        [random.uniform(0.4, 0.6), random.uniform(0.5, 0.65)],
        [random.uniform(0.3, 0.4), random.uniform(0.6, 0.75)],
        [random.uniform(0.6, 0.7), random.uniform(0.6, 0.75)],
        [random.uniform(0.35, 0.45), random.uniform(0.75, 0.9)],
        [random.uniform(0.55, 0.65), random.uniform(0.75, 0.9)],
    ]

    return {
        "keypoints": mock_keypoints,
        "rep_count": 1,
        "posture_feedback": feedback,
        "confidence": confidence,
    }
