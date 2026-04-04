const makeEx = (name, animKey, duration, reps, cals, rest, mode, instructions) => ({
  name, animationKey: animKey, duration, reps, cals, rest, mode,
  instructions: instructions || ['Maintain proper form', 'Control your breathing', 'Engage core throughout', 'Full range of motion'],
});

const PUSH_TIPS = ['Keep body in a straight line', 'Lower until chest nearly touches floor', 'Push back up explosively', 'Breathe out on the push'];
const SQUAT_TIPS = ['Feet shoulder-width apart', 'Push hips back and bend knees', 'Keep chest tall and proud', 'Drive through heels to stand'];
const PLANK_TIPS = ['Stack shoulders over wrists', 'Squeeze glutes and abs tight', 'Keep hips level — no sagging', 'Breathe steadily throughout'];
const CRUNCH_TIPS = ['Press lower back into floor', 'Lift shoulders using your abs', 'Chin slightly tucked', 'Lower under control'];
const LUNGE_TIPS = ['Step forward with one foot', 'Lower back knee toward floor', 'Keep front knee over ankle', 'Push back to starting position'];
const PULL_TIPS = ['Grip slightly wider than shoulders', 'Pull elbows toward hips', 'Squeeze back at the top', 'Lower slowly under control'];
const CURL_TIPS = ['Keep elbows pinned at your sides', 'Curl weight toward shoulders', 'Squeeze bicep hard at top', 'Lower under full control'];
const DIP_TIPS = ['Grip bars with arms fully extended', 'Lower until shoulders below elbows', 'Keep elbows slightly flared', 'Press back up strong'];
const JUMP_TIPS = ['Land softly with bent knees', 'Swing arms for momentum', 'Engage core throughout', 'Breathe rhythmically'];
const ROW_TIPS = ['Hinge forward at hips', 'Pull elbow past torso', 'Squeeze shoulder blade at top', 'Lower with control'];

export const exerciseLibrary = {
  chest: {
    beginner: [
      makeEx('Wall Push Up', 'push_up', 30, 12, 5, 15, 'home', PUSH_TIPS),
      makeEx('Knee Push Up', 'push_up', 30, 10, 6, 15, 'home', PUSH_TIPS),
      makeEx('Incline Push Up', 'push_up', 30, 10, 6, 15, 'home', PUSH_TIPS),
      makeEx('Wide Push Up', 'push_up', 30, 8, 6, 15, 'home', PUSH_TIPS),
      makeEx('Floor Chest Press', 'push_up', 30, 10, 7, 15, 'home', PUSH_TIPS),
      makeEx('Chest Squeeze Hold', 'plank', 20, 5, 5, 15, 'home', PLANK_TIPS),
      makeEx('Slow Push Up', 'push_up', 40, 6, 7, 20, 'home', PUSH_TIPS),
      makeEx('Resistance Band Press', 'push_up', 30, 12, 6, 15, 'home', PUSH_TIPS),
      makeEx('Cobra Push Up', 'push_up', 30, 8, 5, 15, 'home', PUSH_TIPS),
      makeEx('Chest Tap Push Up', 'push_up', 30, 8, 6, 15, 'home', PUSH_TIPS),
    ],
    intermediate: [
      makeEx('Standard Push Up', 'push_up', 30, 15, 9, 15, 'home', PUSH_TIPS),
      makeEx('Decline Push Up', 'push_up', 30, 12, 10, 15, 'home', PUSH_TIPS),
      makeEx('Archer Push Up', 'push_up', 40, 8, 11, 20, 'home', PUSH_TIPS),
      makeEx('Explosive Push Up', 'push_up', 30, 10, 12, 20, 'home', PUSH_TIPS),
      makeEx('Dumbbell Bench Press', 'push_up', 30, 10, 12, 20, 'gym', PUSH_TIPS),
      makeEx('Incline Bench Press', 'push_up', 30, 10, 12, 20, 'gym', PUSH_TIPS),
      makeEx('Chest Fly', 'push_up', 30, 12, 10, 20, 'gym', PUSH_TIPS),
      makeEx('Resistance Band Fly', 'push_up', 30, 12, 9, 15, 'home', PUSH_TIPS),
      makeEx('Tempo Push Up', 'push_up', 40, 8, 10, 20, 'home', PUSH_TIPS),
      makeEx('Diamond Push Up', 'push_up', 30, 10, 10, 20, 'home', PUSH_TIPS),
    ],
    advanced: [
      makeEx('One Arm Push Up', 'push_up', 30, 6, 14, 25, 'home', PUSH_TIPS),
      makeEx('Clap Push Up', 'push_up', 30, 10, 15, 25, 'home', PUSH_TIPS),
      makeEx('Weighted Push Up', 'push_up', 30, 10, 14, 20, 'home', PUSH_TIPS),
      makeEx('Ring Push Up', 'push_up', 30, 10, 14, 25, 'gym', PUSH_TIPS),
      makeEx('Pause Bench Press', 'push_up', 40, 6, 16, 30, 'gym', PUSH_TIPS),
      makeEx('Drop Set Chest Press', 'push_up', 50, 15, 18, 30, 'gym', PUSH_TIPS),
      makeEx('Isometric Chest Hold', 'plank', 30, 3, 10, 20, 'home', PLANK_TIPS),
      makeEx('Deficit Push Up', 'push_up', 30, 10, 15, 25, 'home', PUSH_TIPS),
      makeEx('Single Arm Cable Press', 'push_up', 30, 10, 14, 25, 'gym', PUSH_TIPS),
      makeEx('Explosive Bench Press', 'push_up', 30, 8, 16, 30, 'gym', PUSH_TIPS),
    ],
  },

  abs: {
    beginner: [
      makeEx('Crunch', 'crunch', 30, 15, 6, 15, 'home', CRUNCH_TIPS),
      makeEx('Heel Touch', 'crunch', 30, 20, 5, 15, 'home', CRUNCH_TIPS),
      makeEx('Leg Raise', 'crunch', 30, 12, 6, 15, 'home', CRUNCH_TIPS),
      makeEx('Flutter Kick', 'crunch', 30, 20, 7, 15, 'home', CRUNCH_TIPS),
      makeEx('Seated Knee Tuck', 'crunch', 30, 12, 6, 15, 'home', CRUNCH_TIPS),
      makeEx('Basic Plank', 'plank', 30, 3, 7, 15, 'home', PLANK_TIPS),
      makeEx('Dead Bug', 'crunch', 30, 10, 6, 15, 'home', CRUNCH_TIPS),
      makeEx('Toe Touch', 'crunch', 30, 15, 5, 10, 'home', CRUNCH_TIPS),
      makeEx('Reverse Crunch', 'crunch', 30, 12, 6, 15, 'home', CRUNCH_TIPS),
      makeEx('Standing Crunch', 'crunch', 30, 15, 5, 10, 'home', CRUNCH_TIPS),
    ],
    intermediate: [
      makeEx('Bicycle Crunch', 'crunch', 30, 20, 9, 15, 'home', CRUNCH_TIPS),
      makeEx('Russian Twist', 'crunch', 30, 20, 9, 15, 'home', CRUNCH_TIPS),
      makeEx('Mountain Climber', 'run', 30, 20, 10, 15, 'home', JUMP_TIPS),
      makeEx('V-Ups', 'crunch', 30, 12, 10, 20, 'home', CRUNCH_TIPS),
      makeEx('Plank Shoulder Tap', 'plank', 30, 16, 9, 15, 'home', PLANK_TIPS),
      makeEx('Side Plank', 'plank', 30, 2, 8, 15, 'home', PLANK_TIPS),
      makeEx('Hanging Knee Raise', 'crunch', 30, 12, 10, 20, 'gym', CRUNCH_TIPS),
      makeEx('Cross Crunch', 'crunch', 30, 16, 9, 15, 'home', CRUNCH_TIPS),
      makeEx('Toe Reach', 'crunch', 30, 15, 8, 15, 'home', CRUNCH_TIPS),
      makeEx('Plank Walk', 'plank', 30, 8, 10, 20, 'home', PLANK_TIPS),
    ],
    advanced: [
      makeEx('Dragon Flag', 'crunch', 40, 6, 14, 25, 'gym', CRUNCH_TIPS),
      makeEx('L-Sit Hold', 'plank', 20, 3, 12, 25, 'gym', PLANK_TIPS),
      makeEx('Hanging Leg Raise', 'crunch', 30, 12, 13, 25, 'gym', CRUNCH_TIPS),
      makeEx('Ab Wheel Rollout', 'crunch', 30, 10, 13, 25, 'gym', CRUNCH_TIPS),
      makeEx('Plank to Push Up', 'plank', 40, 10, 12, 20, 'home', PLANK_TIPS),
      makeEx('Weighted Sit Up', 'crunch', 30, 12, 13, 20, 'gym', CRUNCH_TIPS),
      makeEx('Cable Crunch', 'crunch', 30, 12, 13, 20, 'gym', CRUNCH_TIPS),
      makeEx('V-Sit Hold', 'crunch', 20, 3, 11, 20, 'home', CRUNCH_TIPS),
      makeEx('Windshield Wipers', 'crunch', 30, 10, 13, 25, 'gym', CRUNCH_TIPS),
      makeEx('Hollow Body Hold', 'plank', 30, 3, 10, 20, 'home', PLANK_TIPS),
    ],
  },

  legs: {
    beginner: [
      makeEx('Bodyweight Squat', 'squat', 30, 15, 8, 15, 'home', SQUAT_TIPS),
      makeEx('Reverse Lunge', 'lunge', 30, 10, 8, 15, 'home', LUNGE_TIPS),
      makeEx('Calf Raise', 'squat', 30, 20, 5, 10, 'home', SQUAT_TIPS),
      makeEx('Glute Bridge', 'crunch', 30, 15, 7, 15, 'home', SQUAT_TIPS),
      makeEx('Wall Sit', 'plank', 30, 2, 8, 15, 'home', PLANK_TIPS),
      makeEx('Step Up', 'lunge', 30, 12, 8, 15, 'home', LUNGE_TIPS),
      makeEx('Standing Hip Circle', 'squat', 20, 10, 4, 10, 'home', SQUAT_TIPS),
      makeEx('Sumo Squat', 'squat', 30, 12, 7, 15, 'home', SQUAT_TIPS),
      makeEx('Side Lunge', 'lunge', 30, 10, 7, 15, 'home', LUNGE_TIPS),
      makeEx('Donkey Kick', 'crunch', 30, 12, 6, 15, 'home', SQUAT_TIPS),
    ],
    intermediate: [
      makeEx('Jump Squat', 'jump', 30, 12, 13, 20, 'home', JUMP_TIPS),
      makeEx('Bulgarian Split Squat', 'lunge', 40, 10, 13, 20, 'home', LUNGE_TIPS),
      makeEx('Dumbbell Lunge', 'lunge', 30, 12, 12, 20, 'gym', LUNGE_TIPS),
      makeEx('Hip Thrust', 'crunch', 30, 15, 12, 20, 'gym', SQUAT_TIPS),
      makeEx('Romanian Deadlift', 'squat', 40, 10, 13, 20, 'gym', SQUAT_TIPS),
      makeEx('Lateral Band Walk', 'squat', 30, 15, 9, 15, 'home', SQUAT_TIPS),
      makeEx('Reverse Nordic Curl', 'crunch', 30, 8, 12, 20, 'home', SQUAT_TIPS),
      makeEx('Goblet Squat', 'squat', 30, 12, 12, 20, 'gym', SQUAT_TIPS),
      makeEx('Curtsy Lunge', 'lunge', 30, 12, 10, 15, 'home', LUNGE_TIPS),
      makeEx('Box Jump', 'jump', 30, 10, 14, 25, 'gym', JUMP_TIPS),
    ],
    advanced: [
      makeEx('Pistol Squat', 'squat', 40, 6, 15, 30, 'home', SQUAT_TIPS),
      makeEx('Barbell Squat', 'squat', 40, 8, 18, 30, 'gym', SQUAT_TIPS),
      makeEx('Deadlift', 'squat', 40, 6, 18, 30, 'gym', SQUAT_TIPS),
      makeEx('Leg Press Drop Set', 'squat', 50, 20, 20, 30, 'gym', SQUAT_TIPS),
      makeEx('Plyometric Lunge', 'jump', 30, 10, 16, 25, 'home', JUMP_TIPS),
      makeEx('Weighted Bulgarian Split Squat', 'lunge', 40, 8, 17, 30, 'gym', LUNGE_TIPS),
      makeEx('Pause Squat', 'squat', 40, 8, 15, 25, 'home', SQUAT_TIPS),
      makeEx('Hack Squat', 'squat', 40, 10, 17, 30, 'gym', SQUAT_TIPS),
      makeEx('Nordic Hamstring Curl', 'crunch', 30, 6, 15, 30, 'gym', SQUAT_TIPS),
      makeEx('Glute Ham Raise', 'crunch', 30, 8, 16, 30, 'gym', SQUAT_TIPS),
    ],
  },

  back: {
    beginner: [
      makeEx('Superman Hold', 'plank', 20, 10, 5, 15, 'home', ['Lie face down', 'Lift arms and legs off floor', 'Squeeze back and glutes', 'Hold and lower slowly']),
      makeEx('Cat-Cow Stretch', 'crunch', 20, 10, 3, 10, 'home', ['On hands and knees', 'Arch back up like a cat', 'Dip belly down like a cow', 'Breathe through the motion']),
      makeEx('Resistance Band Row', 'row', 30, 12, 6, 15, 'home', ROW_TIPS),
      makeEx('Doorway Row', 'row', 30, 10, 6, 15, 'home', ROW_TIPS),
      makeEx('Good Morning', 'squat', 30, 12, 6, 15, 'home', SQUAT_TIPS),
      makeEx('Back Extension', 'plank', 30, 12, 6, 15, 'gym', PLANK_TIPS),
      makeEx('Prone Y-W-T', 'plank', 20, 10, 5, 15, 'home', PLANK_TIPS),
      makeEx('Dead Bug Variation', 'crunch', 30, 10, 6, 15, 'home', CRUNCH_TIPS),
      makeEx('Assisted Pull Up', 'pull_up', 30, 8, 8, 20, 'gym', PULL_TIPS),
      makeEx('Lying Row', 'row', 30, 12, 6, 15, 'home', ROW_TIPS),
    ],
    intermediate: [
      makeEx('Dumbbell Row', 'row', 30, 10, 11, 20, 'gym', ROW_TIPS),
      makeEx('Lat Pulldown', 'pull_up', 30, 12, 12, 20, 'gym', PULL_TIPS),
      makeEx('Cable Row', 'row', 30, 12, 12, 20, 'gym', ROW_TIPS),
      makeEx('Inverted Row', 'row', 30, 10, 10, 20, 'home', ROW_TIPS),
      makeEx('Straight Arm Pulldown', 'pull_up', 30, 12, 10, 20, 'gym', PULL_TIPS),
      makeEx('Chest Supported Row', 'row', 30, 10, 11, 20, 'gym', ROW_TIPS),
      makeEx('Face Pull', 'row', 30, 15, 9, 15, 'gym', ROW_TIPS),
      makeEx('Renegade Row', 'row', 40, 8, 12, 20, 'home', ROW_TIPS),
      makeEx('T-Bar Row', 'row', 30, 10, 13, 25, 'gym', ROW_TIPS),
      makeEx('Pull Up', 'pull_up', 30, 8, 13, 25, 'gym', PULL_TIPS),
    ],
    advanced: [
      makeEx('Weighted Pull Up', 'pull_up', 40, 6, 17, 30, 'gym', PULL_TIPS),
      makeEx('Barbell Bent Over Row', 'row', 40, 8, 17, 30, 'gym', ROW_TIPS),
      makeEx('Muscle Up', 'pull_up', 30, 5, 18, 35, 'gym', PULL_TIPS),
      makeEx('Meadow Row', 'row', 30, 10, 15, 25, 'gym', ROW_TIPS),
      makeEx('Pendlay Row', 'row', 40, 6, 17, 30, 'gym', ROW_TIPS),
      makeEx('Deficit Dead Row', 'row', 40, 8, 18, 35, 'gym', ROW_TIPS),
      makeEx('Typewriter Pull Up', 'pull_up', 40, 6, 17, 30, 'gym', PULL_TIPS),
      makeEx('Single Arm Row Drop Set', 'row', 50, 15, 18, 30, 'gym', ROW_TIPS),
      makeEx('Rack Pull', 'squat', 40, 6, 18, 35, 'gym', SQUAT_TIPS),
      makeEx('Seal Row', 'row', 30, 10, 16, 30, 'gym', ROW_TIPS),
    ],
  },

  arms: {
    beginner: [
      makeEx('Bicep Curl', 'curl', 30, 12, 7, 15, 'home', CURL_TIPS),
      makeEx('Tricep Dip', 'dip', 30, 10, 7, 15, 'home', DIP_TIPS),
      makeEx('Hammer Curl', 'curl', 30, 12, 7, 15, 'home', CURL_TIPS),
      makeEx('Overhead Tricep Extension', 'dip', 30, 12, 7, 15, 'home', DIP_TIPS),
      makeEx('Wrist Curl', 'curl', 20, 15, 4, 10, 'home', CURL_TIPS),
      makeEx('Resistance Band Curl', 'curl', 30, 15, 6, 15, 'home', CURL_TIPS),
      makeEx('Diamond Push Up', 'push_up', 30, 8, 7, 15, 'home', PUSH_TIPS),
      makeEx('Lateral Raise', 'curl', 30, 12, 6, 15, 'home', ['Stand tall with light weight', 'Raise arms out to sides', 'Stop at shoulder height', 'Lower under control']),
      makeEx('Chair Dip', 'dip', 30, 10, 7, 15, 'home', DIP_TIPS),
      makeEx('Isometric Curl Hold', 'curl', 20, 3, 5, 15, 'home', CURL_TIPS),
    ],
    intermediate: [
      makeEx('Dumbbell Curl', 'curl', 30, 12, 10, 15, 'gym', CURL_TIPS),
      makeEx('Close Grip Bench Press', 'push_up', 30, 10, 12, 20, 'gym', PUSH_TIPS),
      makeEx('Preacher Curl', 'curl', 30, 10, 11, 20, 'gym', CURL_TIPS),
      makeEx('Skull Crusher', 'dip', 30, 10, 11, 20, 'gym', DIP_TIPS),
      makeEx('Cable Curl', 'curl', 30, 12, 11, 20, 'gym', CURL_TIPS),
      makeEx('Tricep Pushdown', 'dip', 30, 12, 10, 15, 'gym', DIP_TIPS),
      makeEx('Concentration Curl', 'curl', 30, 10, 10, 20, 'gym', CURL_TIPS),
      makeEx('Overhead Press', 'push_up', 30, 10, 12, 20, 'gym', PUSH_TIPS),
      makeEx('Dip', 'dip', 30, 10, 12, 20, 'gym', DIP_TIPS),
      makeEx('Incline Curl', 'curl', 30, 10, 11, 20, 'gym', CURL_TIPS),
    ],
    advanced: [
      makeEx('Barbell Curl', 'curl', 30, 8, 14, 25, 'gym', CURL_TIPS),
      makeEx('Weighted Dip', 'dip', 30, 8, 16, 30, 'gym', DIP_TIPS),
      makeEx('21s Curl', 'curl', 50, 21, 16, 30, 'gym', CURL_TIPS),
      makeEx('Drag Curl', 'curl', 30, 10, 14, 25, 'gym', CURL_TIPS),
      makeEx('Ring Dip', 'dip', 30, 8, 16, 30, 'gym', DIP_TIPS),
      makeEx('Cross Body Hammer Curl', 'curl', 30, 12, 13, 25, 'gym', CURL_TIPS),
      makeEx('Tricep Dip to Failure', 'dip', 30, 15, 15, 30, 'gym', DIP_TIPS),
      makeEx('Reverse Curl', 'curl', 30, 10, 12, 20, 'gym', CURL_TIPS),
      makeEx('Zottman Curl', 'curl', 30, 10, 13, 25, 'gym', CURL_TIPS),
      makeEx('Behind Neck Tricep Extension', 'dip', 30, 10, 13, 25, 'gym', DIP_TIPS),
    ],
  },

  full_body: {
    beginner: [
      makeEx('Jumping Jacks', 'jumping_jacks', 30, 20, 8, 15, 'home', JUMP_TIPS),
      makeEx('Marching In Place', 'run', 30, 20, 5, 10, 'home', JUMP_TIPS),
      makeEx('Inchworm', 'plank', 30, 8, 8, 15, 'home', PLANK_TIPS),
      makeEx('Bear Crawl', 'plank', 20, 5, 9, 15, 'home', PLANK_TIPS),
      makeEx('Bodyweight Thruster', 'squat', 30, 10, 9, 20, 'home', SQUAT_TIPS),
      makeEx('Step Touch', 'run', 30, 20, 5, 10, 'home', JUMP_TIPS),
      makeEx('Low Impact Burpee', 'jump', 30, 8, 10, 20, 'home', JUMP_TIPS),
      makeEx('Standing Bicycle', 'crunch', 30, 20, 7, 15, 'home', CRUNCH_TIPS),
      makeEx('High Knees (Low)', 'run', 30, 20, 7, 15, 'home', JUMP_TIPS),
      makeEx('Arm Circle', 'curl', 20, 15, 4, 10, 'home', ['Stand with arms extended', 'Make small then large circles', 'Reverse direction halfway', 'Keep shoulders down']),
    ],
    intermediate: [
      makeEx('Burpee', 'jump', 30, 10, 14, 20, 'home', JUMP_TIPS),
      makeEx('High Knees', 'run', 30, 30, 13, 15, 'home', JUMP_TIPS),
      makeEx('Thruster', 'squat', 30, 10, 14, 20, 'gym', SQUAT_TIPS),
      makeEx('Turkish Get Up', 'crunch', 60, 4, 13, 25, 'home', CRUNCH_TIPS),
      makeEx('Renegade Row', 'row', 40, 8, 13, 20, 'home', ROW_TIPS),
      makeEx('Jump Rope (Simulated)', 'run', 30, 60, 13, 15, 'home', JUMP_TIPS),
      makeEx('Plank to Row', 'plank', 40, 10, 12, 20, 'gym', PLANK_TIPS),
      makeEx('Clean and Press', 'squat', 40, 8, 15, 25, 'gym', SQUAT_TIPS),
      makeEx('Kettlebell Swing', 'squat', 30, 15, 14, 20, 'gym', SQUAT_TIPS),
      makeEx('Box Jump', 'jump', 30, 10, 14, 25, 'gym', JUMP_TIPS),
    ],
    advanced: [
      makeEx('Barbell Complex', 'squat', 90, 5, 22, 40, 'gym', SQUAT_TIPS),
      makeEx('Devil Press', 'jump', 40, 8, 20, 35, 'gym', JUMP_TIPS),
      makeEx('Snatch', 'squat', 40, 5, 20, 35, 'gym', SQUAT_TIPS),
      makeEx('Muscle Up', 'pull_up', 30, 5, 20, 40, 'gym', PULL_TIPS),
      makeEx('Explosive Burpee Pull Up', 'jump', 40, 6, 20, 35, 'gym', JUMP_TIPS),
      makeEx('Man Maker', 'squat', 50, 6, 22, 40, 'gym', SQUAT_TIPS),
      makeEx('Dumbbell Thruster', 'squat', 40, 10, 18, 30, 'gym', SQUAT_TIPS),
      makeEx('Turkish Get Up Heavy', 'crunch', 60, 3, 18, 40, 'gym', CRUNCH_TIPS),
      makeEx('Double Under Jump Rope', 'run', 30, 50, 18, 30, 'gym', JUMP_TIPS),
      makeEx('Power Clean', 'squat', 40, 5, 20, 40, 'gym', SQUAT_TIPS),
    ],
  },
};

export function getExercisesForWorkout({ muscle = 'full_body', level = 'beginner', equipment = 'home', count = 6 }) {
  const levelMap = { beginner: 'beginner', intermediate: 'intermediate', advanced: 'advanced' };
  const targetLevel = levelMap[level] || 'beginner';
  const muscleLib = exerciseLibrary[muscle] || exerciseLibrary.full_body;
  let pool = muscleLib[targetLevel] || [];

  if (equipment === 'home') {
    const homePool = pool.filter(e => e.mode === 'home' || e.mode === 'both');
    if (homePool.length >= count) pool = homePool;
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getTotalExerciseCount() {
  let total = 0;
  for (const muscle of Object.values(exerciseLibrary)) {
    for (const level of Object.values(muscle)) {
      total += level.length;
    }
  }
  return total;
}
