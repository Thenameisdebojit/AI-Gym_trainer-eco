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

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
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
  domain: string;
  category: string;
  equipment: string[];
  movement_pattern: string;
  muscle_groups: string[];
  difficulty: string;
  is_compound: boolean;
  calories_per_rep: number;
}

export interface GeneratedWorkoutExercise {
  id: string;
  name: string;
  category: string;
  sets: number;
  reps: number;
  muscle_groups: string[];
}

export interface GeneratedWorkout {
  name: string;
  description: string;
  goal: string;
  level: string;
  equipment: string;
  duration_minutes: number;
  estimated_calories: number;
  exercises: GeneratedWorkoutExercise[];
}

export interface WorkoutGenerateParams {
  goal: string;
  equipment: string;
  level: string;
  duration_minutes?: number;
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

export const generateWorkout = (params: WorkoutGenerateParams): Promise<GeneratedWorkout> =>
  apiRequest<GeneratedWorkout>("/workout/generate", {
    method: "POST",
    body: JSON.stringify({
      goal: params.goal,
      equipment: params.equipment,
      level: params.level,
      duration_minutes: params.duration_minutes ?? 30,
    }),
  });

export const fetchExercises = (domain?: string): Promise<ExerciseData[]> =>
  apiRequest<ExerciseData[]>(domain ? `/exercises?domain=${domain}` : "/exercises");

export const calculateCalories = (weight_kg: number, met_value: number, duration_minutes: number) =>
  apiRequest<{ calories_burned: number }>("/calories/calculate", {
    method: "POST",
    body: JSON.stringify({ weight_kg, met_value, duration_minutes }),
  });
