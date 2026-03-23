import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  category: string;
  restSeconds?: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  goal: string;
  level: string;
  equipment: string;
  duration_minutes: number;
  exercises: WorkoutExercise[];
  createdAt: number;
}

export interface CompletedSet {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  repsCompleted: number;
  score: number;
  calories: number;
  timestamp: number;
}

export interface WorkoutSession {
  planId: string;
  planName: string;
  startTime: number;
  endTime?: number;
  completedSets: CompletedSet[];
  totalReps: number;
  totalCalories: number;
  totalScore: number;
  completed: boolean;
}

export interface WorkoutHistory {
  id: string;
  planName: string;
  date: number;
  durationSeconds: number;
  totalReps: number;
  totalCalories: number;
  totalScore: number;
  exerciseCount: number;
}

interface WorkoutStore {
  currentPlan: WorkoutPlan | null;
  activeSession: WorkoutSession | null;
  history: WorkoutHistory[];
  setCurrentPlan: (plan: WorkoutPlan) => void;
  startSession: (plan: WorkoutPlan) => void;
  addCompletedSet: (set: CompletedSet) => void;
  finishSession: (durationSeconds: number) => Promise<void>;
  cancelSession: () => void;
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  currentPlan: null,
  activeSession: null,
  history: [],

  setCurrentPlan: (plan) => set({ currentPlan: plan }),

  startSession: (plan) => {
    const session: WorkoutSession = {
      planId: plan.id,
      planName: plan.name,
      startTime: Date.now(),
      completedSets: [],
      totalReps: 0,
      totalCalories: 0,
      totalScore: 0,
      completed: false,
    };
    set({ activeSession: session, currentPlan: plan });
  },

  addCompletedSet: (completedSet) => {
    const { activeSession } = get();
    if (!activeSession) return;
    set({
      activeSession: {
        ...activeSession,
        completedSets: [...activeSession.completedSets, completedSet],
        totalReps: activeSession.totalReps + completedSet.repsCompleted,
        totalCalories: activeSession.totalCalories + completedSet.calories,
        totalScore: activeSession.totalScore + completedSet.score,
      },
    });
  },

  finishSession: async (durationSeconds) => {
    const { activeSession, history } = get();
    if (!activeSession) return;

    const record: WorkoutHistory = {
      id: `session_${Date.now()}`,
      planName: activeSession.planName,
      date: Date.now(),
      durationSeconds,
      totalReps: activeSession.totalReps,
      totalCalories: activeSession.totalCalories,
      totalScore: activeSession.totalScore,
      exerciseCount: new Set(activeSession.completedSets.map(s => s.exerciseId)).size,
    };

    const updated = [record, ...history].slice(0, 50);
    await AsyncStorage.setItem("fitai_workout_history", JSON.stringify(updated));
    set({ history: updated, activeSession: null });
  },

  cancelSession: () => set({ activeSession: null }),

  loadHistory: async () => {
    try {
      const stored = await AsyncStorage.getItem("fitai_workout_history");
      if (stored) {
        set({ history: JSON.parse(stored) });
      }
    } catch {}
  },

  clearHistory: async () => {
    await AsyncStorage.removeItem("fitai_workout_history");
    set({ history: [] });
  },
}));
