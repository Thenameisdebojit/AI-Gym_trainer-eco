def generate_diet(weight, height, goal):
    bmi = weight / ((height/100)**2)

    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal"
    else:
        category = "Overweight"

    if goal == "lose":
        diet = ["Oats", "Salad", "Chicken breast"]
    elif goal == "gain":
        diet = ["Eggs", "Rice", "Peanut butter"]
    else:
        diet = ["Balanced meals"]

    return bmi, category, diet