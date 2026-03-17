def predict_skip(days_missed, consistency):
    if days_missed >= 3:
        return "High risk — send strong alert"
    elif consistency < 50:
        return "User losing discipline"
    return "User consistent"