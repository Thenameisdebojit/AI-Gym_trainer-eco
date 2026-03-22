import { Platform } from "react-native";

const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }
  return "http://localhost:8000";
};

export const API_BASE = getBaseUrl();

export async function apiRequest<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `API error ${res.status}`);
  }
  return res.json();
}

export interface WorkoutStats {
  total_reps: number;
  avg_score: number;
  total_workouts: number;
  calories_burned: number;
}

export interface PoseDetectResult {
  keypoints: number[][];
  rep_count: number;
  posture_feedback: string;
  confidence: number;
}

export interface ExerciseData {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  difficulty: string;
  targetMuscles: string[];
  description: string;
  caloriesPerRep: number;
}

export const fetchStats = (): Promise<WorkoutStats> =>
  apiRequest<WorkoutStats>("/workout/stats");

export const saveWorkout = (exercise: string, reps: number, score: number, calories: number) =>
  apiRequest("/workout/save", {
    method: "POST",
    body: JSON.stringify({ exercise, reps, score, calories }),
  });

export const detectPose = (frameBase64: string, exerciseType: string): Promise<PoseDetectResult> =>
  apiRequest<PoseDetectResult>("/pose-detect", {
    method: "POST",
    body: JSON.stringify({ frame: frameBase64, exercise_type: exerciseType }),
  });

export const fetchRecommendations = (userId: string) =>
  apiRequest<ExerciseData[]>(`/recommendations?user_id=${userId}`);

export const fetchDiet = (weight: number, height: number, goal: string) =>
  apiRequest(`/diet/?weight=${weight}&height=${height}&goal=${goal}`, { method: "POST" });

export const sendChatMessage = (message: string) =>
  apiRequest<{ response: string }>(`/chat/?message=${encodeURIComponent(message)}`, { method: "POST" });
