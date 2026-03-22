export type ExerciseCategory = "freehand" | "gym" | "calisthenics";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  subcategory: string;
  difficulty: DifficultyLevel;
  targetMuscles: string[];
  description: string;
  instructions: string[];
  caloriesPerRep: number;
  repDuration: number;
  icon: string;
  color: string;
}

export interface ExerciseGroup {
  subcategory: string;
  exercises: Exercise[];
}

export const EXERCISES: Exercise[] = [
  // FREEHAND - CHEST
  {
    id: "pushup_normal",
    name: "Normal Push-up",
    category: "freehand",
    subcategory: "Chest",
    difficulty: "beginner",
    targetMuscles: ["Chest", "Triceps", "Shoulders"],
    description: "The fundamental upper-body push exercise that builds chest, shoulder, and tricep strength.",
    instructions: [
      "Start in a plank position with hands shoulder-width apart",
      "Keep your body in a straight line from head to heels",
      "Lower your chest to the ground by bending your elbows",
      "Push back up to the starting position",
      "Keep core engaged throughout the movement"
    ],
    caloriesPerRep: 0.5,
    repDuration: 3,
    icon: "fitness-outline",
    color: "#FF6B35"
  },
  {
    id: "pushup_wide",
    name: "Wide Push-up",
    category: "freehand",
    subcategory: "Chest",
    difficulty: "beginner",
    targetMuscles: ["Outer Chest", "Shoulders"],
    description: "Wider hand placement targets the outer chest more effectively.",
    instructions: [
      "Place hands wider than shoulder-width",
      "Keep elbows pointing slightly outward",
      "Lower chest toward ground",
      "Push back up explosively",
      "Maintain flat back throughout"
    ],
    caloriesPerRep: 0.55,
    repDuration: 3,
    icon: "fitness-outline",
    color: "#FF6B35"
  },
  {
    id: "pushup_diamond",
    name: "Diamond Push-up",
    category: "freehand",
    subcategory: "Chest",
    difficulty: "intermediate",
    targetMuscles: ["Inner Chest", "Triceps"],
    description: "Close grip push-up with hands forming a diamond shape, targeting triceps and inner chest.",
    instructions: [
      "Form a diamond shape with thumbs and index fingers",
      "Position hands under your chest",
      "Lower chest to hands",
      "Keep elbows close to body",
      "Press back up strongly"
    ],
    caloriesPerRep: 0.6,
    repDuration: 3,
    icon: "fitness-outline",
    color: "#FF6B35"
  },
  {
    id: "pushup_decline",
    name: "Decline Push-up",
    category: "freehand",
    subcategory: "Chest",
    difficulty: "intermediate",
    targetMuscles: ["Upper Chest", "Shoulders"],
    description: "Feet elevated push-up that emphasizes the upper chest and anterior deltoids.",
    instructions: [
      "Place feet on an elevated surface",
      "Hands on floor shoulder-width apart",
      "Lower chest toward ground",
      "Keep body in straight line",
      "Press up powerfully"
    ],
    caloriesPerRep: 0.65,
    repDuration: 3,
    icon: "fitness-outline",
    color: "#FF6B35"
  },
  // FREEHAND - LEGS
  {
    id: "squat_bodyweight",
    name: "Bodyweight Squat",
    category: "freehand",
    subcategory: "Legs",
    difficulty: "beginner",
    targetMuscles: ["Quads", "Glutes", "Hamstrings"],
    description: "The king of lower body exercises. Builds functional leg strength and mobility.",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Extend arms forward for balance",
      "Lower body by bending knees",
      "Go until thighs are parallel to floor",
      "Drive through heels to stand up"
    ],
    caloriesPerRep: 0.4,
    repDuration: 3,
    icon: "body-outline",
    color: "#00FF88"
  },
  {
    id: "lunge",
    name: "Forward Lunge",
    category: "freehand",
    subcategory: "Legs",
    difficulty: "beginner",
    targetMuscles: ["Quads", "Glutes", "Hip Flexors"],
    description: "Unilateral leg exercise that improves balance and targets each leg independently.",
    instructions: [
      "Stand with feet hip-width apart",
      "Step forward with one foot",
      "Lower your back knee toward the floor",
      "Keep front knee over ankle",
      "Push back to starting position"
    ],
    caloriesPerRep: 0.45,
    repDuration: 3,
    icon: "body-outline",
    color: "#00FF88"
  },
  {
    id: "jump_squat",
    name: "Jump Squat",
    category: "freehand",
    subcategory: "Legs",
    difficulty: "intermediate",
    targetMuscles: ["Quads", "Glutes", "Calves"],
    description: "Explosive plyometric squat that builds power and burns significant calories.",
    instructions: [
      "Start in squat position",
      "Explode upward as high as possible",
      "Land softly with knees bent",
      "Immediately drop into next squat",
      "Maintain controlled breathing"
    ],
    caloriesPerRep: 0.8,
    repDuration: 2,
    icon: "body-outline",
    color: "#00FF88"
  },
  // FREEHAND - ABS
  {
    id: "crunch",
    name: "Crunch",
    category: "freehand",
    subcategory: "Abs",
    difficulty: "beginner",
    targetMuscles: ["Upper Abs"],
    description: "Classic abdominal exercise targeting the rectus abdominis.",
    instructions: [
      "Lie on back with knees bent",
      "Place hands behind head",
      "Curl upper body toward knees",
      "Focus on squeezing abs",
      "Lower slowly to ground"
    ],
    caloriesPerRep: 0.3,
    repDuration: 2,
    icon: "body-outline",
    color: "#A855F7"
  },
  {
    id: "leg_raise",
    name: "Leg Raise",
    category: "freehand",
    subcategory: "Abs",
    difficulty: "intermediate",
    targetMuscles: ["Lower Abs", "Hip Flexors"],
    description: "Targets the lower abdominal region which is often undertrained.",
    instructions: [
      "Lie flat on back",
      "Keep legs straight",
      "Raise legs to 90 degrees",
      "Lower slowly without touching floor",
      "Keep lower back pressed down"
    ],
    caloriesPerRep: 0.35,
    repDuration: 3,
    icon: "body-outline",
    color: "#A855F7"
  },
  // GYM - CHEST
  {
    id: "bench_press",
    name: "Bench Press",
    category: "gym",
    subcategory: "Chest",
    difficulty: "intermediate",
    targetMuscles: ["Chest", "Triceps", "Anterior Deltoid"],
    description: "The primary compound lift for chest development. Builds mass and strength.",
    instructions: [
      "Lie on bench with eyes under bar",
      "Grip bar slightly wider than shoulder-width",
      "Unrack and lower bar to chest",
      "Touch chest lightly",
      "Press bar back up to start"
    ],
    caloriesPerRep: 0.7,
    repDuration: 4,
    icon: "barbell-outline",
    color: "#FF6B35"
  },
  {
    id: "chest_fly",
    name: "Chest Fly Machine",
    category: "gym",
    subcategory: "Chest",
    difficulty: "beginner",
    targetMuscles: ["Chest", "Anterior Deltoid"],
    description: "Isolation exercise for chest using the cable fly machine.",
    instructions: [
      "Sit with back flat against pad",
      "Grip handles at chest level",
      "Bring handles together in front",
      "Squeeze chest at peak contraction",
      "Control the return movement"
    ],
    caloriesPerRep: 0.5,
    repDuration: 4,
    icon: "barbell-outline",
    color: "#FF6B35"
  },
  // GYM - BACK
  {
    id: "lat_pulldown",
    name: "Lat Pulldown",
    category: "gym",
    subcategory: "Back",
    difficulty: "beginner",
    targetMuscles: ["Lats", "Biceps", "Rhomboids"],
    description: "Cable machine exercise that builds wide back muscles and V-taper.",
    instructions: [
      "Grip bar wider than shoulder-width",
      "Lean back slightly",
      "Pull bar to upper chest",
      "Squeeze lats at bottom",
      "Return bar slowly"
    ],
    caloriesPerRep: 0.6,
    repDuration: 4,
    icon: "barbell-outline",
    color: "#3B82F6"
  },
  {
    id: "seated_row",
    name: "Seated Cable Row",
    category: "gym",
    subcategory: "Back",
    difficulty: "beginner",
    targetMuscles: ["Middle Back", "Lats", "Biceps"],
    description: "Cable row that targets the mid-back and builds thickness.",
    instructions: [
      "Sit at cable machine",
      "Grab handle with both hands",
      "Row handle to your midsection",
      "Squeeze shoulder blades together",
      "Return with control"
    ],
    caloriesPerRep: 0.55,
    repDuration: 4,
    icon: "barbell-outline",
    color: "#3B82F6"
  },
  // GYM - LEGS
  {
    id: "leg_press",
    name: "Leg Press",
    category: "gym",
    subcategory: "Legs",
    difficulty: "beginner",
    targetMuscles: ["Quads", "Glutes", "Hamstrings"],
    description: "Machine-based compound leg exercise. Allows heavy loading safely.",
    instructions: [
      "Sit in leg press machine",
      "Place feet shoulder-width on platform",
      "Release safety locks",
      "Lower platform until 90 degree knee angle",
      "Press back to start"
    ],
    caloriesPerRep: 0.65,
    repDuration: 4,
    icon: "barbell-outline",
    color: "#00FF88"
  },
  // GYM - SHOULDERS
  {
    id: "shoulder_press_machine",
    name: "Shoulder Press Machine",
    category: "gym",
    subcategory: "Shoulders",
    difficulty: "beginner",
    targetMuscles: ["Anterior Deltoid", "Lateral Deltoid", "Triceps"],
    description: "Machine shoulder press for safe, stable overhead pressing.",
    instructions: [
      "Adjust seat so handles are at shoulder height",
      "Grip handles with palms facing forward",
      "Press up until arms nearly straight",
      "Don't lock out elbows",
      "Lower to start position"
    ],
    caloriesPerRep: 0.6,
    repDuration: 3,
    icon: "barbell-outline",
    color: "#F59E0B"
  },
  // GYM - ARMS
  {
    id: "bicep_curl_machine",
    name: "Bicep Curl Machine",
    category: "gym",
    subcategory: "Arms",
    difficulty: "beginner",
    targetMuscles: ["Biceps", "Brachialis"],
    description: "Isolation machine curl for maximum bicep contraction.",
    instructions: [
      "Adjust arm pad to armpit height",
      "Grip handle underhand",
      "Curl up through full range",
      "Squeeze at top",
      "Lower slowly"
    ],
    caloriesPerRep: 0.4,
    repDuration: 3,
    icon: "barbell-outline",
    color: "#F59E0B"
  },
  // CALISTHENICS - BEGINNER
  {
    id: "pullup",
    name: "Pull-up",
    category: "calisthenics",
    subcategory: "Beginner",
    difficulty: "intermediate",
    targetMuscles: ["Lats", "Biceps", "Core"],
    description: "The gold standard of upper body pulling strength. Essential calisthenics movement.",
    instructions: [
      "Hang from bar with overhand grip",
      "Hands slightly wider than shoulders",
      "Pull body up until chin clears bar",
      "Squeeze lats at top",
      "Lower with control"
    ],
    caloriesPerRep: 0.8,
    repDuration: 4,
    icon: "body-outline",
    color: "#A855F7"
  },
  {
    id: "dips",
    name: "Dips",
    category: "calisthenics",
    subcategory: "Beginner",
    difficulty: "intermediate",
    targetMuscles: ["Chest", "Triceps", "Shoulders"],
    description: "Bodyweight dipping movement that builds impressive pushing strength.",
    instructions: [
      "Mount parallel bars with straight arms",
      "Lean forward slightly for chest emphasis",
      "Lower body by bending elbows",
      "Go until upper arms are parallel to floor",
      "Press back up to start"
    ],
    caloriesPerRep: 0.75,
    repDuration: 4,
    icon: "body-outline",
    color: "#A855F7"
  },
  // CALISTHENICS - INTERMEDIATE
  {
    id: "l_sit",
    name: "L-Sit",
    category: "calisthenics",
    subcategory: "Intermediate",
    difficulty: "intermediate",
    targetMuscles: ["Abs", "Hip Flexors", "Triceps", "Shoulders"],
    description: "Static hold that demonstrates exceptional core and upper body strength.",
    instructions: [
      "Support body weight on two parallel bars or floor",
      "Straighten arms fully",
      "Raise legs to horizontal position",
      "Hold with legs parallel to floor",
      "Keep feet flexed and pointed forward"
    ],
    caloriesPerRep: 1.2,
    repDuration: 10,
    icon: "body-outline",
    color: "#A855F7"
  },
  // CALISTHENICS - ADVANCED
  {
    id: "front_lever",
    name: "Front Lever",
    category: "calisthenics",
    subcategory: "Advanced",
    difficulty: "advanced",
    targetMuscles: ["Lats", "Core", "Shoulders", "Arms"],
    description: "Elite calisthenics skill requiring extraordinary back and core strength.",
    instructions: [
      "Hang from a pull-up bar",
      "Pull body up horizontally",
      "Keep body in a straight line",
      "Face upward toward the sky",
      "Hold position as long as possible"
    ],
    caloriesPerRep: 2.0,
    repDuration: 10,
    icon: "body-outline",
    color: "#A855F7"
  },
  {
    id: "back_lever",
    name: "Back Lever",
    category: "calisthenics",
    subcategory: "Advanced",
    difficulty: "advanced",
    targetMuscles: ["Biceps", "Core", "Rear Deltoids"],
    description: "Advanced static hold where body is horizontal facing down.",
    instructions: [
      "Mount bar and get into skin-the-cat position",
      "Extend body horizontally facing down",
      "Keep arms straight",
      "Maintain rigid body position",
      "Hold as long as form allows"
    ],
    caloriesPerRep: 2.0,
    repDuration: 10,
    icon: "body-outline",
    color: "#A855F7"
  },
  {
    id: "planche",
    name: "Planche",
    category: "calisthenics",
    subcategory: "Advanced",
    difficulty: "advanced",
    targetMuscles: ["Anterior Deltoid", "Chest", "Triceps", "Core"],
    description: "The ultimate calisthenics pressing skill. Body held horizontally, parallel to ground.",
    instructions: [
      "Place hands on floor, fingers pointing backward",
      "Lean forward until shoulders are over hands",
      "Lift feet off the ground",
      "Hold body horizontal with straight arms",
      "Maintain full body tension"
    ],
    caloriesPerRep: 2.5,
    repDuration: 10,
    icon: "body-outline",
    color: "#A855F7"
  }
];

export const getExercisesByCategory = (category: ExerciseCategory): ExerciseGroup[] => {
  const filtered = EXERCISES.filter(e => e.category === category);
  const groups: Record<string, Exercise[]> = {};
  filtered.forEach(e => {
    if (!groups[e.subcategory]) groups[e.subcategory] = [];
    groups[e.subcategory].push(e);
  });
  return Object.entries(groups).map(([subcategory, exercises]) => ({ subcategory, exercises }));
};

export const getCategoryColor = (category: ExerciseCategory): string => {
  switch (category) {
    case "freehand": return "#00FF88";
    case "gym": return "#FF6B35";
    case "calisthenics": return "#A855F7";
    default: return "#00FF88";
  }
};

export const getCategoryIcon = (category: ExerciseCategory): string => {
  switch (category) {
    case "freehand": return "body-outline";
    case "gym": return "barbell-outline";
    case "calisthenics": return "fitness-outline";
    default: return "body-outline";
  }
};
