import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage, Language } from "./LanguageContext";
import { useWorkoutStore, WorkoutHistory } from "@/store/useWorkoutStore";

const HISTORY_KEY = "fitai_workout_history";

interface SimpleWorkout {
  id?: string | number;
  date?: Date | string | number;
  name?: string;
  muscle?: string;
  duration?: number;
  calories?: number;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  workouts: WorkoutHistory[];
  totalCalories: number;
  totalMinutes: number;
  totalWorkouts: number;
  addWorkout: (workout: SimpleWorkout) => Promise<void>;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { language, setLanguage: _setLanguage, t } = useLanguage();
  const { history, loadHistory } = useWorkoutStore();

  const setLanguage = useCallback(
    (lang: Language) => {
      console.log("LANGUAGE UPDATED:", lang);
      _setLanguage(lang);
    },
    [_setLanguage]
  );

  const loadData = useCallback(async () => {
    await loadHistory();
  }, [loadHistory]);

  const saveData = useCallback(async () => {
    const stored = JSON.stringify(history);
    await AsyncStorage.setItem(HISTORY_KEY, stored);
  }, [history]);

  const addWorkout = useCallback(
    async (workout: SimpleWorkout) => {
      const record: WorkoutHistory = {
        id: `workout_${workout.id ?? Date.now()}`,
        planName: workout.name ?? workout.muscle ?? "Quick Workout",
        date: new Date(workout.date ?? Date.now()).getTime(),
        durationSeconds: (workout.duration ?? 0) * 60,
        totalReps: 0,
        totalCalories: workout.calories ?? 0,
        totalScore: 0,
        exerciseCount: 1,
      };

      const existing: WorkoutHistory[] = await AsyncStorage.getItem(HISTORY_KEY)
        .then((s) => (s ? JSON.parse(s) : []))
        .catch(() => []);

      const updated = [record, ...existing].slice(0, 50);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      await loadHistory();
    },
    [loadHistory]
  );

  const totalCalories = history.reduce((a, h) => a + h.totalCalories, 0);
  const totalMinutes = Math.round(
    history.reduce((a, h) => a + h.durationSeconds, 0) / 60
  );
  const totalWorkouts = history.length;

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        workouts: history,
        totalCalories,
        totalMinutes,
        totalWorkouts,
        addWorkout,
        loadData,
        saveData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
