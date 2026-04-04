import exercises from '../data/exercises.js';

const DURATION_TARGETS = {
  quick: { label: 'Quick', minutes: 10, exerciseCount: 4, icon: '⚡', desc: 'Short & effective — perfect for busy days', color: '#10B981' },
  standard: { label: 'Standard', minutes: 20, exerciseCount: 6, icon: '🏋️', desc: 'Balanced workout — the sweet spot', color: '#2563EB' },
  intense: { label: 'Intense', minutes: 40, exerciseCount: 10, icon: '🔥', desc: 'Full session — push your limits', color: '#EF4444' },
};

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateWorkout({ goal = 'muscle_gain', level = 'beginner', durationKey = 'standard', equipment = 'home', muscle = 'full_body' }) {
  const { exerciseCount, minutes, label } = DURATION_TARGETS[durationKey] || DURATION_TARGETS.standard;

  const isHome = equipment === 'home';

  let pool = exercises.filter(e =>
    e.category === muscle &&
    e.difficulty === level &&
    (isHome ? e.mode === 'home' : true) &&
    (goal ? e.tags.includes(goal) : true)
  );

  if (pool.length < exerciseCount) {
    pool = exercises.filter(e =>
      e.category === muscle &&
      e.difficulty === level &&
      (isHome ? e.mode === 'home' : true)
    );
  }

  if (pool.length < exerciseCount) {
    pool = exercises.filter(e => e.category === muscle && e.difficulty === level);
  }

  if (pool.length === 0) {
    pool = exercises.filter(e => e.difficulty === level);
  }

  const shuffled = shuffle(pool);
  const selected = shuffled.slice(0, exerciseCount);

  const totalCals = selected.reduce((sum, e) => sum + (e.cals || 0), 0);
  const totalTime = selected.reduce((sum, e) => sum + (e.duration || 30) + (e.rest || 15), 0);

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
      category: e.category,
      cals: e.cals || 7,
      rest: e.rest || 15,
      instructions: e.instructions || [],
      animation: e.animation,
    })),
    total_duration: Math.round(totalTime / 60),
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

export { DURATION_TARGETS };

export function countAvailableWorkouts(muscle) {
  const base = exercises.filter(e => e.category === muscle);
  const levels = [...new Set(base.map(e => e.difficulty))];
  return levels.length * 3;
}
