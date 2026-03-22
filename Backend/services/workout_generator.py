import random
from typing import List, Dict, Any

EXERCISE_DATASET = [
    # GYM
    {"id": "bench_press", "name": "Bench Press", "domain": "gym", "equipment": ["barbell"], "movement_pattern": "push", "muscle_groups": ["Chest", "Triceps", "Anterior Deltoid"], "difficulty": "intermediate", "is_compound": True, "met_value": 5.0, "calories_per_rep": 0.7, "rep_duration": 4},
    {"id": "incline_bench_press", "name": "Incline Bench Press", "domain": "gym", "equipment": ["barbell"], "movement_pattern": "push", "muscle_groups": ["Upper Chest", "Triceps"], "difficulty": "intermediate", "is_compound": True, "met_value": 4.8, "calories_per_rep": 0.65, "rep_duration": 4},
    {"id": "chest_fly", "name": "Cable Chest Fly", "domain": "gym", "equipment": ["cable"], "movement_pattern": "push", "muscle_groups": ["Chest", "Anterior Deltoid"], "difficulty": "beginner", "is_compound": False, "met_value": 3.5, "calories_per_rep": 0.5, "rep_duration": 4},
    {"id": "lat_pulldown", "name": "Lat Pulldown", "domain": "gym", "equipment": ["cable"], "movement_pattern": "pull", "muscle_groups": ["Lats", "Biceps", "Rhomboids"], "difficulty": "beginner", "is_compound": True, "met_value": 4.0, "calories_per_rep": 0.6, "rep_duration": 4},
    {"id": "seated_cable_row", "name": "Seated Cable Row", "domain": "gym", "equipment": ["cable"], "movement_pattern": "pull", "muscle_groups": ["Middle Back", "Lats", "Biceps"], "difficulty": "beginner", "is_compound": True, "met_value": 4.0, "calories_per_rep": 0.55, "rep_duration": 4},
    {"id": "deadlift", "name": "Barbell Deadlift", "domain": "gym", "equipment": ["barbell"], "movement_pattern": "hinge", "muscle_groups": ["Hamstrings", "Glutes", "Lower Back"], "difficulty": "advanced", "is_compound": True, "met_value": 6.0, "calories_per_rep": 1.1, "rep_duration": 5},
    {"id": "leg_press", "name": "Leg Press", "domain": "gym", "equipment": ["machine"], "movement_pattern": "squat", "muscle_groups": ["Quads", "Glutes", "Hamstrings"], "difficulty": "beginner", "is_compound": True, "met_value": 4.5, "calories_per_rep": 0.65, "rep_duration": 4},
    {"id": "leg_extension", "name": "Leg Extension", "domain": "gym", "equipment": ["machine"], "movement_pattern": "squat", "muscle_groups": ["Quads"], "difficulty": "beginner", "is_compound": False, "met_value": 3.0, "calories_per_rep": 0.4, "rep_duration": 3},
    {"id": "leg_curl", "name": "Lying Leg Curl", "domain": "gym", "equipment": ["machine"], "movement_pattern": "hinge", "muscle_groups": ["Hamstrings"], "difficulty": "beginner", "is_compound": False, "met_value": 3.0, "calories_per_rep": 0.4, "rep_duration": 3},
    {"id": "shoulder_press_machine", "name": "Shoulder Press Machine", "domain": "gym", "equipment": ["machine"], "movement_pattern": "push", "muscle_groups": ["Anterior Deltoid", "Lateral Deltoid", "Triceps"], "difficulty": "beginner", "is_compound": True, "met_value": 4.0, "calories_per_rep": 0.6, "rep_duration": 3},
    {"id": "lateral_raise", "name": "Lateral Raise", "domain": "gym", "equipment": ["dumbbell"], "movement_pattern": "push", "muscle_groups": ["Lateral Deltoid"], "difficulty": "beginner", "is_compound": False, "met_value": 3.0, "calories_per_rep": 0.35, "rep_duration": 3},
    {"id": "bicep_curl", "name": "Dumbbell Bicep Curl", "domain": "gym", "equipment": ["dumbbell"], "movement_pattern": "pull", "muscle_groups": ["Biceps", "Brachialis"], "difficulty": "beginner", "is_compound": False, "met_value": 3.0, "calories_per_rep": 0.4, "rep_duration": 3},
    {"id": "tricep_pushdown", "name": "Cable Tricep Pushdown", "domain": "gym", "equipment": ["cable"], "movement_pattern": "push", "muscle_groups": ["Triceps"], "difficulty": "beginner", "is_compound": False, "met_value": 3.0, "calories_per_rep": 0.35, "rep_duration": 3},
    {"id": "calf_raise_machine", "name": "Machine Calf Raise", "domain": "gym", "equipment": ["machine"], "movement_pattern": "push", "muscle_groups": ["Calves"], "difficulty": "beginner", "is_compound": False, "met_value": 2.5, "calories_per_rep": 0.3, "rep_duration": 2},

    # BODYWEIGHT / FREEHAND
    {"id": "pushup_normal", "name": "Push-up", "domain": "freehand", "equipment": ["none"], "movement_pattern": "push", "muscle_groups": ["Chest", "Triceps", "Shoulders", "Core"], "difficulty": "beginner", "is_compound": True, "met_value": 3.8, "calories_per_rep": 0.5, "rep_duration": 3},
    {"id": "pushup_wide", "name": "Wide Push-up", "domain": "freehand", "equipment": ["none"], "movement_pattern": "push", "muscle_groups": ["Outer Chest", "Shoulders"], "difficulty": "beginner", "is_compound": True, "met_value": 3.9, "calories_per_rep": 0.55, "rep_duration": 3},
    {"id": "pushup_diamond", "name": "Diamond Push-up", "domain": "freehand", "equipment": ["none"], "movement_pattern": "push", "muscle_groups": ["Inner Chest", "Triceps"], "difficulty": "intermediate", "is_compound": True, "met_value": 4.0, "calories_per_rep": 0.6, "rep_duration": 3},
    {"id": "squat_bodyweight", "name": "Bodyweight Squat", "domain": "freehand", "equipment": ["none"], "movement_pattern": "squat", "muscle_groups": ["Quads", "Glutes", "Hamstrings", "Core"], "difficulty": "beginner", "is_compound": True, "met_value": 5.0, "calories_per_rep": 0.4, "rep_duration": 3},
    {"id": "lunge", "name": "Forward Lunge", "domain": "freehand", "equipment": ["none"], "movement_pattern": "squat", "muscle_groups": ["Quads", "Glutes", "Hip Flexors"], "difficulty": "beginner", "is_compound": True, "met_value": 4.5, "calories_per_rep": 0.45, "rep_duration": 3},
    {"id": "jump_squat", "name": "Jump Squat", "domain": "freehand", "equipment": ["none"], "movement_pattern": "squat", "muscle_groups": ["Quads", "Glutes", "Calves"], "difficulty": "intermediate", "is_compound": True, "met_value": 8.0, "calories_per_rep": 0.8, "rep_duration": 2},
    {"id": "crunch", "name": "Crunch", "domain": "freehand", "equipment": ["mat"], "movement_pattern": "pull", "muscle_groups": ["Upper Abs"], "difficulty": "beginner", "is_compound": False, "met_value": 3.5, "calories_per_rep": 0.3, "rep_duration": 2},
    {"id": "leg_raise", "name": "Leg Raise", "domain": "freehand", "equipment": ["mat"], "movement_pattern": "pull", "muscle_groups": ["Lower Abs", "Hip Flexors"], "difficulty": "intermediate", "is_compound": False, "met_value": 4.0, "calories_per_rep": 0.35, "rep_duration": 3},
    {"id": "plank", "name": "Plank Hold", "domain": "freehand", "equipment": ["mat"], "movement_pattern": "hold", "muscle_groups": ["Core", "Abs", "Shoulders"], "difficulty": "beginner", "is_compound": True, "met_value": 3.5, "calories_per_rep": 0.15, "rep_duration": 1},

    # CALISTHENICS
    {"id": "pullup", "name": "Pull-up", "domain": "calisthenics", "equipment": ["pullup_bar"], "movement_pattern": "pull", "muscle_groups": ["Lats", "Biceps", "Core"], "difficulty": "intermediate", "is_compound": True, "met_value": 8.0, "calories_per_rep": 0.8, "rep_duration": 4},
    {"id": "dips", "name": "Parallel Bar Dips", "domain": "calisthenics", "equipment": ["parallel_bars"], "movement_pattern": "push", "muscle_groups": ["Chest", "Triceps", "Shoulders"], "difficulty": "intermediate", "is_compound": True, "met_value": 7.0, "calories_per_rep": 0.75, "rep_duration": 4},
    {"id": "muscle_up", "name": "Muscle-Up", "domain": "calisthenics", "equipment": ["pullup_bar"], "movement_pattern": "pull", "muscle_groups": ["Lats", "Chest", "Triceps", "Core"], "difficulty": "advanced", "is_compound": True, "met_value": 10.0, "calories_per_rep": 1.5, "rep_duration": 5},
    {"id": "l_sit", "name": "L-Sit Hold", "domain": "calisthenics", "equipment": ["parallel_bars"], "movement_pattern": "hold", "muscle_groups": ["Abs", "Hip Flexors", "Triceps"], "difficulty": "intermediate", "is_compound": True, "met_value": 6.0, "calories_per_rep": 1.2, "rep_duration": 10},
    {"id": "front_lever", "name": "Front Lever", "domain": "calisthenics", "equipment": ["pullup_bar"], "movement_pattern": "hold", "muscle_groups": ["Lats", "Core", "Shoulders"], "difficulty": "advanced", "is_compound": True, "met_value": 8.0, "calories_per_rep": 2.0, "rep_duration": 10},
    {"id": "planche", "name": "Planche Hold", "domain": "calisthenics", "equipment": ["none"], "movement_pattern": "hold", "muscle_groups": ["Shoulders", "Chest", "Triceps", "Core"], "difficulty": "advanced", "is_compound": True, "met_value": 9.0, "calories_per_rep": 2.5, "rep_duration": 10},
    {"id": "handstand_pushup", "name": "Handstand Push-up", "domain": "calisthenics", "equipment": ["none"], "movement_pattern": "push", "muscle_groups": ["Shoulders", "Triceps"], "difficulty": "advanced", "is_compound": True, "met_value": 7.0, "calories_per_rep": 1.0, "rep_duration": 5},

    # MARTIAL ARTS
    {"id": "jab_cross", "name": "Jab-Cross Combo", "domain": "martial_arts", "equipment": ["none"], "movement_pattern": "strike", "muscle_groups": ["Shoulders", "Core", "Chest"], "difficulty": "beginner", "is_compound": True, "met_value": 7.5, "calories_per_rep": 0.6, "rep_duration": 2},
    {"id": "hook_uppercut", "name": "Hook-Uppercut Combo", "domain": "martial_arts", "equipment": ["none"], "movement_pattern": "strike", "muscle_groups": ["Core", "Shoulders", "Obliques"], "difficulty": "intermediate", "is_compound": True, "met_value": 8.0, "calories_per_rep": 0.7, "rep_duration": 2},
    {"id": "roundhouse_kick", "name": "Roundhouse Kick", "domain": "martial_arts", "equipment": ["none"], "movement_pattern": "strike", "muscle_groups": ["Hip Flexors", "Glutes", "Core"], "difficulty": "intermediate", "is_compound": True, "met_value": 9.0, "calories_per_rep": 0.8, "rep_duration": 2},
    {"id": "shadow_boxing", "name": "Shadow Boxing", "domain": "martial_arts", "equipment": ["none"], "movement_pattern": "strike", "muscle_groups": ["Core", "Shoulders", "Legs"], "difficulty": "beginner", "is_compound": True, "met_value": 7.0, "calories_per_rep": 0.5, "rep_duration": 60},
    {"id": "front_kick", "name": "Front Kick", "domain": "martial_arts", "equipment": ["none"], "movement_pattern": "strike", "muscle_groups": ["Quads", "Hip Flexors", "Core"], "difficulty": "beginner", "is_compound": False, "met_value": 7.0, "calories_per_rep": 0.6, "rep_duration": 2},
    {"id": "sprawl_drill", "name": "Sprawl Drill", "domain": "martial_arts", "equipment": ["mat"], "movement_pattern": "squat", "muscle_groups": ["Core", "Hip Flexors", "Glutes"], "difficulty": "intermediate", "is_compound": True, "met_value": 10.0, "calories_per_rep": 0.9, "rep_duration": 2},
    {"id": "bob_weave", "name": "Bob and Weave", "domain": "martial_arts", "equipment": ["none"], "movement_pattern": "squat", "muscle_groups": ["Core", "Legs", "Neck"], "difficulty": "beginner", "is_compound": True, "met_value": 6.0, "calories_per_rep": 0.4, "rep_duration": 2},

    # YOGA
    {"id": "downward_dog", "name": "Downward Dog", "domain": "yoga", "equipment": ["mat"], "movement_pattern": "mobility", "muscle_groups": ["Hamstrings", "Calves", "Shoulders"], "difficulty": "beginner", "is_compound": True, "met_value": 2.5, "calories_per_rep": 0.1, "rep_duration": 30},
    {"id": "warrior_one", "name": "Warrior I", "domain": "yoga", "equipment": ["mat"], "movement_pattern": "squat", "muscle_groups": ["Quads", "Hip Flexors", "Shoulders"], "difficulty": "beginner", "is_compound": True, "met_value": 2.5, "calories_per_rep": 0.12, "rep_duration": 30},
    {"id": "warrior_two", "name": "Warrior II", "domain": "yoga", "equipment": ["mat"], "movement_pattern": "squat", "muscle_groups": ["Quads", "Inner Thighs", "Shoulders"], "difficulty": "beginner", "is_compound": True, "met_value": 2.5, "calories_per_rep": 0.12, "rep_duration": 30},
    {"id": "tree_pose", "name": "Tree Pose", "domain": "yoga", "equipment": ["mat"], "movement_pattern": "balance", "muscle_groups": ["Core", "Inner Thighs"], "difficulty": "beginner", "is_compound": False, "met_value": 2.0, "calories_per_rep": 0.08, "rep_duration": 30},
    {"id": "pigeon_pose", "name": "Pigeon Pose", "domain": "yoga", "equipment": ["mat"], "movement_pattern": "mobility", "muscle_groups": ["Hip Flexors", "Glutes", "Piriformis"], "difficulty": "intermediate", "is_compound": False, "met_value": 2.5, "calories_per_rep": 0.1, "rep_duration": 60},
    {"id": "sun_salutation", "name": "Sun Salutation", "domain": "yoga", "equipment": ["mat"], "movement_pattern": "mobility", "muscle_groups": ["Full Body", "Core", "Hamstrings"], "difficulty": "beginner", "is_compound": True, "met_value": 3.5, "calories_per_rep": 0.5, "rep_duration": 60},
    {"id": "boat_pose", "name": "Boat Pose", "domain": "yoga", "equipment": ["mat"], "movement_pattern": "hold", "muscle_groups": ["Abs", "Hip Flexors"], "difficulty": "intermediate", "is_compound": False, "met_value": 3.0, "calories_per_rep": 0.15, "rep_duration": 30},

    # CARDIO
    {"id": "jumping_jacks", "name": "Jumping Jacks", "domain": "cardio", "equipment": ["none"], "movement_pattern": "cardio", "muscle_groups": ["Full Body", "Calves", "Shoulders"], "difficulty": "beginner", "is_compound": True, "met_value": 8.0, "calories_per_rep": 0.3, "rep_duration": 1},
    {"id": "burpee", "name": "Burpee", "domain": "cardio", "equipment": ["none"], "movement_pattern": "cardio", "muscle_groups": ["Full Body", "Chest", "Quads"], "difficulty": "intermediate", "is_compound": True, "met_value": 10.0, "calories_per_rep": 1.0, "rep_duration": 3},
    {"id": "high_knees", "name": "High Knees", "domain": "cardio", "equipment": ["none"], "movement_pattern": "cardio", "muscle_groups": ["Quads", "Hip Flexors", "Core"], "difficulty": "beginner", "is_compound": True, "met_value": 8.5, "calories_per_rep": 0.25, "rep_duration": 1},
    {"id": "mountain_climbers", "name": "Mountain Climbers", "domain": "cardio", "equipment": ["none"], "movement_pattern": "cardio", "muscle_groups": ["Core", "Quads", "Hip Flexors"], "difficulty": "beginner", "is_compound": True, "met_value": 8.0, "calories_per_rep": 0.3, "rep_duration": 1},
    {"id": "box_jump", "name": "Box Jump", "domain": "cardio", "equipment": ["none"], "movement_pattern": "squat", "muscle_groups": ["Quads", "Glutes", "Calves"], "difficulty": "intermediate", "is_compound": True, "met_value": 9.0, "calories_per_rep": 0.9, "rep_duration": 3},
    {"id": "speed_skaters", "name": "Speed Skaters", "domain": "cardio", "equipment": ["none"], "movement_pattern": "cardio", "muscle_groups": ["Glutes", "Inner Thighs", "Core"], "difficulty": "intermediate", "is_compound": True, "met_value": 8.0, "calories_per_rep": 0.4, "rep_duration": 2},
    {"id": "jump_rope", "name": "Jump Rope", "domain": "cardio", "equipment": ["rope"], "movement_pattern": "cardio", "muscle_groups": ["Calves", "Shoulders", "Core"], "difficulty": "beginner", "is_compound": True, "met_value": 10.0, "calories_per_rep": 0.35, "rep_duration": 1},

    # REHAB
    {"id": "glute_bridge", "name": "Glute Bridge", "domain": "rehab", "equipment": ["mat"], "movement_pattern": "hinge", "muscle_groups": ["Glutes", "Hamstrings", "Lower Back"], "difficulty": "beginner", "is_compound": False, "met_value": 3.0, "calories_per_rep": 0.25, "rep_duration": 3},
    {"id": "bird_dog", "name": "Bird Dog", "domain": "rehab", "equipment": ["mat"], "movement_pattern": "balance", "muscle_groups": ["Core", "Lower Back", "Glutes"], "difficulty": "beginner", "is_compound": True, "met_value": 2.5, "calories_per_rep": 0.2, "rep_duration": 4},
    {"id": "dead_bug", "name": "Dead Bug", "domain": "rehab", "equipment": ["mat"], "movement_pattern": "hold", "muscle_groups": ["Abs", "Core", "Transverse Abdominis"], "difficulty": "beginner", "is_compound": True, "met_value": 2.5, "calories_per_rep": 0.2, "rep_duration": 4},
    {"id": "clamshell", "name": "Clamshell", "domain": "rehab", "equipment": ["mat"], "movement_pattern": "mobility", "muscle_groups": ["Glutes", "Hip External Rotators"], "difficulty": "beginner", "is_compound": False, "met_value": 2.0, "calories_per_rep": 0.15, "rep_duration": 3},
    {"id": "single_leg_balance", "name": "Single Leg Balance", "domain": "rehab", "equipment": ["none"], "movement_pattern": "balance", "muscle_groups": ["Ankle Stabilizers", "Core", "Glutes"], "difficulty": "beginner", "is_compound": False, "met_value": 2.0, "calories_per_rep": 0.05, "rep_duration": 30},
    {"id": "thoracic_rotation", "name": "Thoracic Rotation", "domain": "rehab", "equipment": ["mat"], "movement_pattern": "rotation", "muscle_groups": ["Thoracic Spine", "Obliques"], "difficulty": "beginner", "is_compound": False, "met_value": 2.0, "calories_per_rep": 0.1, "rep_duration": 5},
    {"id": "hip_flexor_stretch", "name": "Hip Flexor Lunge Stretch", "domain": "rehab", "equipment": ["mat"], "movement_pattern": "mobility", "muscle_groups": ["Hip Flexors", "Psoas"], "difficulty": "beginner", "is_compound": False, "met_value": 1.5, "calories_per_rep": 0.05, "rep_duration": 30},
]

GOAL_DOMAINS = {
    "muscle_gain": ["gym", "calisthenics", "freehand"],
    "fat_loss": ["cardio", "freehand", "martial_arts"],
    "flexibility": ["yoga", "rehab"],
    "mma": ["martial_arts", "cardio", "freehand"],
    "general": ["freehand", "gym", "cardio", "yoga", "rehab"],
}

EQUIPMENT_ALLOWED = {
    "none": ["none", "mat"],
    "minimal": ["none", "mat", "dumbbell", "band", "pullup_bar"],
    "full_gym": ["none", "mat", "dumbbell", "barbell", "cable", "machine", "kettlebell", "pullup_bar", "parallel_bars", "band", "rope"],
}

WORKOUT_NAMES = {
    "muscle_gain": "Muscle Builder",
    "fat_loss": "Fat Burner HIIT",
    "flexibility": "Flexibility & Flow",
    "mma": "Combat Conditioning",
    "general": "Full Body Blast",
}

SETS_BY_GOAL = {
    "muscle_gain": 4,
    "fat_loss": 3,
    "flexibility": 1,
    "mma": 3,
    "general": 3,
}

REPS_BY_GOAL = {
    "muscle_gain": 10,
    "fat_loss": 15,
    "flexibility": 1,
    "mma": 12,
    "general": 12,
}


def generate_workout(goal: str, equipment: str, level: str, duration_minutes: int = 30) -> Dict[str, Any]:
    domains = GOAL_DOMAINS.get(goal, GOAL_DOMAINS["general"])
    allowed_eq = EQUIPMENT_ALLOWED.get(equipment, EQUIPMENT_ALLOWED["none"])

    pool = [
        ex for ex in EXERCISE_DATASET
        if ex["domain"] in domains
        and ex["difficulty"] == level
        and any(eq in allowed_eq for eq in ex["equipment"])
    ]

    if len(pool) < 4:
        pool = [ex for ex in EXERCISE_DATASET if ex["domain"] in domains and ex["difficulty"] == level]

    if len(pool) < 4:
        pool = [ex for ex in EXERCISE_DATASET if ex["domain"] in domains]

    random.shuffle(pool)

    prioritize_compound = goal in ["muscle_gain", "fat_loss", "mma"]
    if prioritize_compound:
        compound = [ex for ex in pool if ex["is_compound"]]
        isolation = [ex for ex in pool if not ex["is_compound"]]
        pool = compound + isolation

    primary_domain = domains[0]
    primary = [ex for ex in pool if ex["domain"] == primary_domain]
    rest = [ex for ex in pool if ex["domain"] != primary_domain]
    pool = primary + rest

    max_exercises = min(8, max(4, duration_minutes // 5))
    selected = pool[:max_exercises]

    sets = SETS_BY_GOAL.get(goal, 3)
    reps = REPS_BY_GOAL.get(goal, 12)

    total_calories = sum(
        ex["calories_per_rep"] * reps * sets for ex in selected
    )

    workout_exercises = [
        {
            "id": ex["id"],
            "name": ex["name"],
            "domain": ex["domain"],
            "category": ex["domain"],
            "sets": sets,
            "reps": reps if ex["movement_pattern"] not in ["hold", "balance", "mobility"] else 1,
            "duration_seconds": ex["rep_duration"] * reps * sets,
            "muscle_groups": ex["muscle_groups"],
            "movement_pattern": ex["movement_pattern"],
        }
        for ex in selected
    ]

    return {
        "name": f"{WORKOUT_NAMES.get(goal, 'Workout')} — {level.capitalize()}",
        "description": f"A personalized {level} workout for {goal.replace('_', ' ')} goals using {equipment.replace('_', ' ')} equipment.",
        "goal": goal,
        "level": level,
        "equipment": equipment,
        "duration_minutes": duration_minutes,
        "estimated_calories": round(total_calories),
        "exercises": workout_exercises,
    }


def get_all_exercises() -> List[Dict[str, Any]]:
    return EXERCISE_DATASET


def get_exercises_by_domain(domain: str) -> List[Dict[str, Any]]:
    return [ex for ex in EXERCISE_DATASET if ex["domain"] == domain]


def calculate_calories(weight_kg: float, met_value: float, duration_minutes: float) -> float:
    return round((met_value * weight_kg * duration_minutes) / 60, 1)
