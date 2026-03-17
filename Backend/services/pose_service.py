import cv2
import numpy as np

class PoseTrainer:
    def __init__(self):
        self.counter = 0
        self.stage = None
        self.prev_y = None
        self.prev_x = None
        self.exercise = "curl"  # default

    def set_exercise(self, ex):
        self.exercise = ex
        self.counter = 0
        self.stage = None

    def process_frame(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5,5), 0)

        _, thresh = cv2.threshold(blur, 50, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(
            thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

        if contours:
            largest = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(largest)

            center_y = y + h // 2
            center_x = x + w // 2

            if self.prev_y is None:
                self.prev_y = center_y
                self.prev_x = center_x

            dy = center_y - self.prev_y
            dx = center_x - self.prev_x

            # 🏋️ CURL (small vertical motion)
            if self.exercise == "curl":
                if dy < -15:
                    self.stage = "up"
                elif dy > 15 and self.stage == "up":
                    self.stage = "down"
                    self.counter += 1

            # 🏋️ SQUAT (big vertical motion)
            elif self.exercise == "squat":
                if dy > 25:
                    self.stage = "down"
                elif dy < -25 and self.stage == "down":
                    self.stage = "up"
                    self.counter += 1

            # 🏋️ PUSH-UP (horizontal motion)
            elif self.exercise == "pushup":
                if dx > 20:
                    self.stage = "forward"
                elif dx < -20 and self.stage == "forward":
                    self.stage = "back"
                    self.counter += 1

            self.prev_y = center_y
            self.prev_x = center_x

            # Draw box
            cv2.rectangle(frame, (x,y), (x+w,y+h), (0,255,0), 2)

        # FEEDBACK
        if self.exercise == "curl":
            feedback = "Curl motion detected"
        elif self.exercise == "squat":
            feedback = "Squat movement"
        else:
            feedback = "Push-up motion"

        # SCORE
        score = min(100, self.counter * 10)

        # UI
        cv2.putText(frame, f'Exercise: {self.exercise}',
                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)

        cv2.putText(frame, f'Reps: {self.counter}',
                    (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)

        cv2.putText(frame, f'Stage: {self.stage}',
                    (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0,0), 2)

        cv2.putText(frame, feedback,
                    (10, 170), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,255), 2)

        cv2.putText(frame, f'Score: {score}',
                    (10, 220), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,0), 2)

        return frame