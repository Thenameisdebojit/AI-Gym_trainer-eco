const MUSCLE_ROTATION = {
  abs: 'legs',
  legs: 'chest',
  chest: 'back',
  back: 'arms',
  arms: 'full_body',
  full_body: 'abs',
};

const LEVEL_PROGRESSION = {
  beginner: 'intermediate',
  intermediate: 'advanced',
  advanced: 'advanced',
};

export function getRecommendation(sessionHistory = []) {
  if (!sessionHistory || sessionHistory.length === 0) {
    return {
      muscle: 'full_body',
      level: 'beginner',
      durationKey: 'quick',
      reason: 'Start your fitness journey with a quick full-body session',
    };
  }

  const last = sessionHistory[sessionHistory.length - 1];
  const lastMuscle = last.body_part || 'full_body';
  const lastLevel = last.level || 'beginner';

  const weekCount = sessionHistory.filter(s => {
    const d = new Date(s.date || Date.now());
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return d.getTime() > weekAgo;
  }).length;

  const nextMuscle = MUSCLE_ROTATION[lastMuscle] || 'full_body';
  const shouldProgress = weekCount >= 3 && lastLevel !== 'advanced';
  const nextLevel = shouldProgress ? LEVEL_PROGRESSION[lastLevel] : lastLevel;

  let durationKey = 'standard';
  if (weekCount === 0) durationKey = 'quick';
  if (weekCount >= 5) durationKey = 'intense';

  const MUSCLE_LABELS = {
    abs: 'Abs', legs: 'Legs', chest: 'Chest',
    back: 'Back', arms: 'Arms', full_body: 'Full Body',
  };

  const reasons = [
    `You trained ${lastMuscle.replace('_', ' ')} last — target ${nextMuscle.replace('_', ' ')} for balance`,
    `${weekCount} sessions this week — keep the momentum`,
    shouldProgress ? `Ready to step up to ${nextLevel}` : `Consistent ${lastLevel} training`,
  ];

  return {
    muscle: nextMuscle,
    level: nextLevel,
    durationKey,
    muscleLabel: MUSCLE_LABELS[nextMuscle] || nextMuscle,
    reason: reasons[0],
    insight: reasons[1],
    weekCount,
  };
}

export function getPersonalizedGreeting(sessionHistory = []) {
  const hour = new Date().getHours();
  const total = sessionHistory.length;

  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (total === 0) return `${timeGreeting}! Ready to start your fitness journey? 💪`;
  if (total < 5) return `${timeGreeting}! ${total} sessions done — you're building momentum! 🚀`;
  if (total < 20) return `${timeGreeting}! ${total} sessions strong — consistency is key! ⚡`;
  return `${timeGreeting}! You're a FitAI veteran with ${total} sessions! 🏆`;
}
