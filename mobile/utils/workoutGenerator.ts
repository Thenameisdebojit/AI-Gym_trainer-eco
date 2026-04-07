import { EXERCISES, Exercise, ExerciseCategory, DifficultyLevel, Equipment, MovementPattern } from "@/constants/exercises";
export type { ExerciseCategory };
import {
  shuffleExercises,
  pickUnique,
  filterByLevel,
  filterByEquipment,
  filterCompound,
  filterIsolation,
  filterByMovementPattern,
} from "./exerciseUtils";

export type WorkoutGoal = "muscle_gain" | "fat_loss" | "flexibility" | "mma" | "general";
export type EquipmentLevel = "none" | "minimal" | "full_gym";

export interface GeneratedExercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  sets: number;
  reps: number;
  durationSeconds?: number;
  muscleGroups: string[];
  caloriesPerRep: number;
  phase: "warmup" | "main" | "finisher";
  restSeconds: number;
  supersetGroup?: number;
  isExplosive?: boolean;
}

export interface GeneratedPlan {
  name: string;
  description: string;
  goal: WorkoutGoal;
  level: DifficultyLevel;
  equipment: EquipmentLevel;
  duration_minutes: number;
  estimated_calories: number;
  exercises: GeneratedExercise[];
  hasSupersets?: boolean;
}

const ALLOWED_EQUIP: Record<EquipmentLevel, Equipment[]> = {
  none: ["none", "mat"],
  minimal: ["none", "mat", "dumbbell", "band", "kettlebell"],
  full_gym: ["none", "mat", "dumbbell", "barbell", "cable", "machine", "kettlebell", "pullup_bar", "parallel_bars", "band", "rings", "rope"],
};

const GOAL_CATEGORIES: Record<WorkoutGoal, ExerciseCategory[]> = {
  muscle_gain: ["gym", "freehand", "calisthenics"],
  fat_loss: ["cardio", "freehand", "calisthenics"],
  flexibility: ["yoga", "rehab", "freehand"],
  mma: ["martial_arts", "cardio", "freehand"],
  general: ["freehand", "gym", "cardio", "calisthenics", "yoga"],
};

const GOAL_NAMES: Record<WorkoutGoal, string> = {
  muscle_gain: "Muscle Builder",
  fat_loss: "Fat Burner",
  flexibility: "Flex & Flow",
  mma: "Combat Conditioning",
  general: "Full Body Blast",
};

const GOAL_DESCRIPTIONS: Record<WorkoutGoal, string> = {
  muscle_gain: "Heavy compound movements with isolation finishers to maximise hypertrophy.",
  fat_loss: "High-intensity metabolic circuit to torch calories and boost your metabolism.",
  flexibility: "Dynamic stretches, mobility drills, and yoga flows for full-body flexibility.",
  mma: "Combat conditioning combining strikes, footwork, and functional strength.",
  general: "Balanced training session hitting every major muscle group.",
};

/**
 * Returns the number of MAIN exercises to pick (excluding warmup=2 and finisher=1).
 * Total exercises = warmup(2) + main + finisher(1).
 *
 * Duration bins mirror the UI picker values:
 *   short  = <10 min  (Quick)
 *   medium = 10–25 min  (Medium)
 *   long   = 25+ min  (Long / Epic)
 *
 * Target total ranges by level:
 *   beginner   short → 5 total  → 2 main
 *   beginner   medium → 6 total → 3 main
 *   beginner   long   → 6 total → 3 main
 *   intermediate short → 6 total → 3 main
 *   intermediate medium → 8 total → 5 main
 *   intermediate long   → 8 total → 5 main
 *   advanced   short  → 8 total  → 5 main
 *   advanced   medium → 11 total → 8 main
 *   advanced   long   → 12 total → 9 main
 */
function mainExerciseCount(level: DifficultyLevel, durationMinutes: number): number {
  const short = durationMinutes < 10;
  const medium = durationMinutes <= 25;

  if (level === "beginner") {
    return short ? 2 : 3;
  }
  if (level === "intermediate") {
    return short ? 3 : 5;
  }
  // advanced
  if (short) return 5;
  if (medium) return 8;
  return 9;
}

function setsForGoal(goal: WorkoutGoal, level: DifficultyLevel): number {
  if (goal === "muscle_gain") return level === "advanced" ? 5 : level === "intermediate" ? 4 : 3;
  if (goal === "fat_loss") return 3;
  return 3;
}

function repsForGoal(goal: WorkoutGoal, level: DifficultyLevel, compound: boolean): number {
  if (goal === "muscle_gain") return compound ? (level === "beginner" ? 10 : level === "intermediate" ? 8 : 6) : 12;
  if (goal === "fat_loss") return 15;
  if (goal === "flexibility") return 1;
  return 12;
}

function restForGoal(goal: WorkoutGoal): number {
  if (goal === "muscle_gain") return 90;
  if (goal === "fat_loss") return 30;
  return 45;
}

function pickWarmup(allowedEquip: Equipment[], goal: WorkoutGoal): Exercise[] {
  const warmupPatterns: MovementPattern[] = ["mobility", "cardio", "balance"];
  const warmupCategories: ExerciseCategory[] = ["yoga", "rehab", "cardio", "freehand"];
  let pool = EXERCISES.filter(
    (e) =>
      warmupPatterns.includes(e.movement_pattern) &&
      warmupCategories.includes(e.category) &&
      e.difficulty !== "advanced" &&
      e.equipment.some((eq) => allowedEquip.includes(eq))
  );
  if (pool.length < 2) {
    pool = EXERCISES.filter((e) => warmupPatterns.includes(e.movement_pattern) && e.difficulty !== "advanced");
  }
  if (pool.length < 2) {
    pool = EXERCISES.filter((e) => e.difficulty === "beginner").slice(0, 5);
  }
  return pickUnique(pool, 2);
}

function pickMain(
  goal: WorkoutGoal,
  level: DifficultyLevel,
  allowedEquip: Equipment[],
  count: number,
  usedIds: Set<string>
): Exercise[] {
  const goalCats = GOAL_CATEGORIES[goal];

  let pool = EXERCISES.filter(
    (e) =>
      goalCats.includes(e.category) &&
      e.difficulty === level &&
      e.equipment.some((eq) => allowedEquip.includes(eq)) &&
      !usedIds.has(e.id)
  );

  if (pool.length < count) {
    pool = EXERCISES.filter(
      (e) =>
        goalCats.includes(e.category) &&
        e.equipment.some((eq) => allowedEquip.includes(eq)) &&
        !usedIds.has(e.id)
    );
  }

  if (pool.length < count) {
    pool = EXERCISES.filter(
      (e) => goalCats.includes(e.category) && !usedIds.has(e.id)
    );
  }

  if (pool.length < count) {
    pool = EXERCISES.filter((e) => !usedIds.has(e.id));
  }

  const compoundPool = filterCompound(pool);
  const isolationPool = filterIsolation(pool);

  let selected: Exercise[] = [];

  if (goal === "muscle_gain" || goal === "general") {
    const compoundCount = Math.ceil(count * 0.6);
    const isoCount = count - compoundCount;
    selected = [
      ...pickUnique(compoundPool, compoundCount),
      ...pickUnique(isolationPool, isoCount),
    ];
  } else {
    selected = pickUnique(pool, count);
  }

  if (selected.length < count) {
    const remaining = pool.filter((e) => !selected.find((s) => s.id === e.id));
    selected = [...selected, ...pickUnique(remaining, count - selected.length)];
  }

  return shuffleExercises(selected).slice(0, count);
}

function pickFinisher(
  goal: WorkoutGoal,
  allowedEquip: Equipment[],
  usedIds: Set<string>
): Exercise[] {
  const highIntensity = EXERCISES.filter(
    (e) =>
      e.met_value >= 7 &&
      e.equipment.some((eq) => allowedEquip.includes(eq)) &&
      !usedIds.has(e.id)
  );
  const cardioPool = EXERCISES.filter(
    (e) =>
      e.category === "cardio" &&
      e.equipment.some((eq) => allowedEquip.includes(eq)) &&
      !usedIds.has(e.id)
  );
  let pool = [...highIntensity, ...cardioPool];
  if (pool.length === 0) pool = EXERCISES.filter((e) => !usedIds.has(e.id));
  return pickUnique(pool, 1);
}

/**
 * For advanced plans: pair main exercises into supersets (groups of 2).
 * Pairs compound + isolation targeting different muscles.
 * Returns the exercises with supersetGroup numbers assigned.
 */
function applyAdvancedSupersets(mainExercises: GeneratedExercise[]): GeneratedExercise[] {
  if (mainExercises.length < 4) return mainExercises;
  const result: GeneratedExercise[] = [];
  let group = 1;
  let i = 0;
  while (i < mainExercises.length) {
    const current = mainExercises[i];
    const next = mainExercises[i + 1];
    if (next) {
      const sameMuscle = current.muscleGroups.some((m) => next.muscleGroups.includes(m));
      if (!sameMuscle) {
        result.push({ ...current, supersetGroup: group, restSeconds: 15 });
        result.push({ ...next, supersetGroup: group, restSeconds: current.restSeconds });
        group++;
        i += 2;
        continue;
      }
    }
    result.push(current);
    i++;
  }
  return result;
}

/**
 * Mark explosive/high-intensity exercises for advanced plans.
 */
function markExplosiveExercises(exercises: GeneratedExercise[]): GeneratedExercise[] {
  const explosiveKeywords = ["power", "jump", "explosive", "plyo", "snatch", "clean", "sprint", "thruster", "slam", "swing"];
  return exercises.map((ex) => {
    const isExplosive = explosiveKeywords.some((kw) =>
      ex.name.toLowerCase().includes(kw) || ex.id.toLowerCase().includes(kw)
    );
    return isExplosive ? { ...ex, isExplosive: true } : ex;
  });
}

export function generateWorkout(params: {
  goal: WorkoutGoal;
  equipment: EquipmentLevel;
  level: DifficultyLevel;
  durationMinutes?: number;
}): GeneratedPlan {
  const { goal, equipment, level, durationMinutes = 30 } = params;
  const allowedEquip = ALLOWED_EQUIP[equipment];
  const sets = setsForGoal(goal, level);
  const rest = restForGoal(goal);
  const mainCount = mainExerciseCount(level, durationMinutes);
  const usedIds = new Set<string>();

  const warmupRaw = pickWarmup(allowedEquip, goal);
  warmupRaw.forEach((e) => usedIds.add(e.id));

  const mainRaw = pickMain(goal, level, allowedEquip, mainCount, usedIds);
  mainRaw.forEach((e) => usedIds.add(e.id));

  const finisherRaw = pickFinisher(goal, allowedEquip, usedIds);
  finisherRaw.forEach((e) => usedIds.add(e.id));

  const warmup: GeneratedExercise[] = warmupRaw.map((e) => ({
    id: e.id,
    name: e.name,
    category: e.category,
    sets: 1,
    reps: goal === "flexibility" ? 30 : 10,
    durationSeconds: 30,
    muscleGroups: e.muscle_groups,
    caloriesPerRep: e.caloriesPerRep,
    phase: "warmup",
    restSeconds: 20,
  }));

  let main: GeneratedExercise[] = mainRaw.map((e) => ({
    id: e.id,
    name: e.name,
    category: e.category,
    sets,
    reps: repsForGoal(goal, level, e.is_compound),
    muscleGroups: e.muscle_groups,
    caloriesPerRep: e.caloriesPerRep,
    phase: "main",
    restSeconds: rest,
  }));

  main = markExplosiveExercises(main);

  let hasSupersets = false;
  if (level === "advanced" && main.length >= 4) {
    main = applyAdvancedSupersets(main);
    hasSupersets = main.some((ex) => ex.supersetGroup !== undefined);
  }

  const finisher: GeneratedExercise[] = finisherRaw.map((e) => ({
    id: e.id,
    name: e.name,
    category: e.category,
    sets: 1,
    reps: 20,
    muscleGroups: e.muscle_groups,
    caloriesPerRep: e.caloriesPerRep,
    phase: "finisher",
    restSeconds: 60,
  }));

  const allExercises = [...warmup, ...main, ...finisher];

  const estimated_calories = allExercises.reduce(
    (total, ex) => total + ex.sets * ex.reps * ex.caloriesPerRep,
    0
  );

  const levelLabel = level.charAt(0).toUpperCase() + level.slice(1);
  const name = `${GOAL_NAMES[goal]} — ${levelLabel}`;

  return {
    name,
    description: GOAL_DESCRIPTIONS[goal],
    goal,
    level,
    equipment,
    duration_minutes: durationMinutes,
    estimated_calories: Math.round(estimated_calories),
    exercises: allExercises,
    hasSupersets,
  };
}
