def recommend_gym(goal):
    if goal == "gain":
        return ["Gold Gym", "Power Fitness"]
    elif goal == "lose":
        return ["Cardio Zone", "FitLife"]
    return ["General Fitness Center"]