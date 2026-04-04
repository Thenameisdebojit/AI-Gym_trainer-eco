const muscleGroups = ['abs', 'legs', 'chest', 'back', 'arms', 'full_body'];

const baseExercises = {
  abs: ['Crunch', 'Plank', 'Leg Raise', 'Bicycle Crunch', 'Mountain Climber', 'V-Up', 'Russian Twist', 'Hollow Body Hold'],
  legs: ['Squat', 'Lunge', 'Deadlift', 'Calf Raise', 'Glute Bridge', 'Step Up', 'Hip Thrust', 'Wall Sit'],
  chest: ['Push Up', 'Chest Fly', 'Chest Dip', 'Chest Press', 'Chest Squeeze', 'Cobra Push Up'],
  back: ['Pull Up', 'Row', 'Lat Pulldown', 'Superman', 'Good Morning', 'Back Extension'],
  arms: ['Bicep Curl', 'Tricep Dip', 'Hammer Curl', 'Skull Crusher', 'Overhead Press', 'Lateral Raise'],
  full_body: ['Burpee', 'Thruster', 'Clean And Press', 'Jump Squat', 'Bear Crawl', 'Inchworm', 'Turkish Get Up'],
};

const variations = [
  'Standard', 'Explosive', 'Slow Tempo', 'Isometric', 'Single Arm',
  'Single Leg', 'Weighted', 'Resistance Band', 'Decline', 'Incline',
];

const difficulties = ['beginner', 'intermediate', 'advanced'];
const equipments = ['none', 'dumbbell', 'barbell', 'machine'];

const MET_VALS = { beginner: 4, intermediate: 6, advanced: 9 };

const INSTRUCTIONS_MAP = {
  Push: ['Keep body in a straight line', 'Lower until chest nearly touches floor', 'Push back to start position', 'Breathe in on way down, out on push'],
  Pull: ['Grip slightly wider than shoulders', 'Pull elbows toward hips', 'Squeeze back at top', 'Lower under control'],
  Squat: ['Feet shoulder-width apart', 'Push hips back and bend knees', 'Keep chest tall', 'Drive through heels to stand'],
  Lunge: ['Step forward with one foot', 'Lower back knee toward floor', 'Keep front knee over ankle', 'Push back to starting position'],
  Plank: ['Align shoulders over wrists', 'Engage core and glutes', 'Keep hips level', 'Breathe steadily throughout'],
  Deadlift: ['Hinge at hips with flat back', 'Keep bar close to body', 'Drive hips forward to stand', 'Lower under control'],
  Curl: ['Keep elbows at sides', 'Curl weight toward shoulders', 'Squeeze bicep at top', 'Lower under control'],
  Dip: ['Support on bars with arms extended', 'Lower body by bending elbows', 'Go until shoulders below elbows', 'Push back up'],
  Raise: ['Stand tall, light bend in knee', 'Raise weight with slight bend', 'Control the descent', 'Avoid shrugging shoulders'],
  Crunch: ['Lie on back, knees bent', 'Press lower back into floor', 'Lift shoulders using abs', 'Lower under control'],
  Burpee: ['Stand feet hip-width apart', 'Drop to push-up position', 'Perform a push-up', 'Jump feet back in and leap up'],
  default: ['Maintain proper form', 'Control your breathing', 'Engage core throughout', 'Full range of motion'],
};

function getInstructions(name) {
  const upper = name.toUpperCase();
  for (const [key, inst] of Object.entries(INSTRUCTIONS_MAP)) {
    if (upper.includes(key.toUpperCase())) return inst;
  }
  return INSTRUCTIONS_MAP.default;
}

function getEquipmentForVariation(variation, mode) {
  if (variation === 'Weighted' || variation === 'Barbell') return 'barbell';
  if (variation === 'Dumbbell' || variation === 'Single Arm') return 'dumbbell';
  if (variation === 'Resistance Band') return 'resistance_band';
  if (variation === 'Machine') return 'machine';
  return 'none';
}

const ANIMATION_MAP = {
  abs: ['crunch', 'plank', 'leg_raise', 'mountain_climber', 'russian_twist', 'v_up'],
  legs: ['squat', 'lunge', 'deadlift', 'glute_bridge', 'calf_raise', 'hip_thrust'],
  chest: ['push_up', 'chest_fly', 'chest_press', 'chest_dip'],
  back: ['pull_up', 'row', 'superman', 'back_extension'],
  arms: ['bicep_curl', 'tricep_dip', 'hammer_curl', 'lateral_raise'],
  full_body: ['burpee', 'jump_squat', 'bear_crawl', 'thruster'],
};

function getAnimationKey(group, base) {
  const key = base.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '');
  const pool = ANIMATION_MAP[group] || ANIMATION_MAP.full_body;
  return pool.find(a => key.includes(a.split('_')[0])) || pool[0];
}

const exercises = [];
let id = 1;

for (const group of muscleGroups) {
  for (const base of baseExercises[group]) {
    for (const variation of variations) {
      for (const difficulty of difficulties) {
        const met = MET_VALS[difficulty];
        const durationSec = difficulty === 'beginner' ? 20 + Math.floor(Math.random() * 15)
          : difficulty === 'intermediate' ? 30 + Math.floor(Math.random() * 15)
            : 30 + Math.floor(Math.random() * 20);
        const reps = difficulty === 'beginner' ? 8 + Math.floor(Math.random() * 8)
          : difficulty === 'intermediate' ? 10 + Math.floor(Math.random() * 8)
            : 12 + Math.floor(Math.random() * 8);
        const rest = difficulty === 'beginner' ? 20 : difficulty === 'intermediate' ? 15 : 10;
        const equip = getEquipmentForVariation(variation);
        const animKey = getAnimationKey(group, base);

        exercises.push({
          id: `ex_${id++}`,
          name: `${variation} ${base}`,
          category: group,
          subcategory: ['Burpee', 'Jump Squat', 'Mountain Climber', 'Bear Crawl'].some(b => base.includes(b)) ? 'cardio' : 'strength',
          difficulty,
          equipment: equip,
          duration: durationSec,
          reps,
          rest,
          calories_per_min: parseFloat((met * 0.0175 * 70 * 60 / 60 * (1 + Math.random() * 0.3)).toFixed(1)),
          cals: Math.round(met * 0.0175 * 70 * (durationSec / 60) * (1 + Math.random() * 0.3)),
          category_display: group.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          instructions: getInstructions(base),
          animation: `/animations/${group}/${animKey}.gif`,
          tags: [
            Math.random() > 0.5 ? 'fat_loss' : 'muscle_gain',
            equip === 'none' ? 'home' : 'gym',
          ],
          mode: equip === 'none' ? 'home' : 'gym',
        });
      }
    }
  }
}

export default exercises;
export const EXERCISE_COUNT = exercises.length;
