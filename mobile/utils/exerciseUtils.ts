import {
  EXERCISES,
  Exercise,
  ExerciseCategory,
  DifficultyLevel,
  Equipment,
  MovementPattern,
} from "@/constants/exercises";

export function getExercisesByMuscle(muscle: string): Exercise[] {
  const m = muscle.toLowerCase();
  return EXERCISES.filter(
    (e) =>
      e.muscle_groups.some((mg) => mg.toLowerCase().includes(m)) ||
      e.subcategory.toLowerCase().includes(m)
  );
}

export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return EXERCISES.filter((e) => e.category === category);
}

export function filterByLevel(
  exercises: Exercise[],
  level: DifficultyLevel
): Exercise[] {
  return exercises.filter((e) => e.difficulty === level);
}

export function filterByEquipment(
  exercises: Exercise[],
  allowedEquipment: Equipment[]
): Exercise[] {
  return exercises.filter((e) =>
    e.equipment.some((eq) => allowedEquipment.includes(eq))
  );
}

export function filterByMovementPattern(
  exercises: Exercise[],
  patterns: MovementPattern[]
): Exercise[] {
  return exercises.filter((e) => patterns.includes(e.movement_pattern));
}

export function filterCompound(exercises: Exercise[]): Exercise[] {
  return exercises.filter((e) => e.is_compound);
}

export function filterIsolation(exercises: Exercise[]): Exercise[] {
  return exercises.filter((e) => !e.is_compound);
}

export function shuffleExercises<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickUnique<T>(pool: T[], n: number): T[] {
  const shuffled = shuffleExercises(pool);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

export function getWarmupExercises(
  level: DifficultyLevel,
  allowedEquip: Equipment[]
): Exercise[] {
  const warmupPatterns: MovementPattern[] = ["cardio", "mobility", "balance"];
  const pool = EXERCISES.filter(
    (e) =>
      warmupPatterns.includes(e.movement_pattern) &&
      e.difficulty !== "advanced" &&
      e.equipment.some((eq) => allowedEquip.includes(eq))
  );
  if (pool.length === 0) {
    return EXERCISES.filter((e) => warmupPatterns.includes(e.movement_pattern)).slice(
      0,
      2
    );
  }
  return pickUnique(pool, 2);
}

export function getFinisherExercises(
  level: DifficultyLevel,
  allowedEquip: Equipment[]
): Exercise[] {
  const finisherPatterns: MovementPattern[] = ["cardio", "squat", "push", "pull"];
  const pool = EXERCISES.filter(
    (e) =>
      finisherPatterns.includes(e.movement_pattern) &&
      (e.met_value >= 7 || e.difficulty === level) &&
      e.equipment.some((eq) => allowedEquip.includes(eq))
  );
  const fallback = EXERCISES.filter(
    (e) => e.met_value >= 6 && e.equipment.some((eq) => allowedEquip.includes(eq))
  );
  const usePool = pool.length > 0 ? pool : fallback;
  return pickUnique(usePool, 1);
}
