import cv2
from services.pose_service import PoseTrainer

trainer = PoseTrainer()
cap = cv2.VideoCapture(0)

print("Press:")
print("1 → Curl")
print("2 → Squat")
print("3 → Push-up")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = trainer.process_frame(frame)

    cv2.imshow("AI Gym Trainer", frame)

    key = cv2.waitKey(10) & 0xFF

    if key == ord('1'):
        trainer.set_exercise("curl")
    elif key == ord('2'):
        trainer.set_exercise("squat")
    elif key == ord('3'):
        trainer.set_exercise("pushup")
    elif key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()