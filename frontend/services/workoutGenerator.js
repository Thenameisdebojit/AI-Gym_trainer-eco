import { getExercisesForWorkout } from '../data/exerciseLibrary.js';

export const DURATION_TARGETS = {
  quick:    { label: 'Quick',    minutes: 10, exerciseCount: 4,  icon: '⚡', desc: 'Short & effective — perfect for busy days', color: '#10B981' },
  standard: { label: 'Standard', minutes: 20, exerciseCount: 6,  icon: '🏋️', desc: 'Balanced workout — the sweet spot',          color: '#2563EB' },
  intense:  { label: 'Intense',  minutes: 40, exerciseCount: 10, icon: '🔥', desc: 'Full session — push your limits',            color: '#EF4444' },
};

export function generateWorkout({ level = 'beginner', durationKey = 'standard', equipment = 'home', muscle = 'full_body' }) {
  const { exerciseCount, minutes, label } = DURATION_TARGETS[durationKey] || DURATION_TARGETS.standard;

  const selected = getExercisesForWorkout({ muscle, level, equipment, count: exerciseCount });

  const totalCals = selected.reduce((sum, e) => sum + (e.cals || 0), 0);

  return {
    name: `${label} ${muscle.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Workout`,
    durationKey,
    muscle,
    level,
    equipment,
    exercises: selected.map(e => ({
      name: e.name,
      duration: e.duration || 30,
      reps: e.reps || 10,
      category: muscle,
      cals: e.cals || 7,
      rest: e.rest || 15,
      instructions: e.instructions || [],
      animationKey: e.animationKey || 'default',
    })),
    total_duration: minutes,
    estimated_calories: Math.round(totalCals),
    estimated_minutes: minutes,
  };
}

export function getWorkoutOptions({ level, equipment, muscle }) {
  return Object.entries(DURATION_TARGETS).map(([key, meta]) => {
    const workout = generateWorkout({ level, durationKey: key, equipment, muscle });
    return { ...meta, key, workout };
  });
}

export function countAvailableWorkouts(muscle) {
  return 30;
}
