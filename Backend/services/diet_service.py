"""
Complete AI Diet Planning Service
- Mifflin-St Jeor BMR formula
- TDEE with activity multipliers
- Goal-based calorie & macro distribution
- Indian food database (vegan / vegetarian / non-vegetarian × budget levels)
- 5-meal daily structure with 2+ alternatives per meal
- Tips, warnings, hydration, supplements
"""

# ─── Activity & Goal constants ────────────────────────────────────────────────
ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "moderate": 1.55,
    "active": 1.75,
}

GOAL_CALORIE_ADJUSTMENT = {
    "fat_loss":     -0.20,   # 20 % deficit
    "muscle_gain":  +0.12,   # 12 % surplus (~300 kcal average)
    "maintenance":   0.00,
}

# ─── Indian Food Database ─────────────────────────────────────────────────────
# Structure: FOOD_DB[diet_type][budget][meal] = [option, ...]
# Each option: name, description, calories, protein(g), carbs(g), fats(g), prep_time, portion

FOOD_DB = {
    "vegan": {
        "low": {
            "breakfast": [
                {"name": "Poha with Peanuts", "description": "Flattened rice tempered with mustard seeds, turmeric & roasted peanuts", "calories": 280, "protein": 8, "carbs": 48, "fats": 7, "prep_time": "15 min", "portion": "1 bowl (200g)"},
                {"name": "Oats Upma", "description": "Rolled oats cooked with vegetables, cumin & curry leaves", "calories": 260, "protein": 9, "carbs": 44, "fats": 6, "prep_time": "12 min", "portion": "1 bowl (180g)"},
                {"name": "Banana Oatmeal", "description": "Oats cooked in water, topped with banana slices & flaxseeds", "calories": 290, "protein": 7, "carbs": 55, "fats": 5, "prep_time": "10 min", "portion": "1 bowl"},
            ],
            "mid_morning": [
                {"name": "Roasted Chana", "description": "Bengal gram dry-roasted with black salt & lemon", "calories": 160, "protein": 10, "carbs": 22, "fats": 3, "prep_time": "5 min", "portion": "1 handful (50g)"},
                {"name": "Banana + Peanuts", "description": "1 ripe banana with a small portion of roasted peanuts", "calories": 185, "protein": 5, "carbs": 30, "fats": 8, "prep_time": "2 min", "portion": "1 banana + 30g peanuts"},
            ],
            "lunch": [
                {"name": "Dal Chawal", "description": "Yellow moong dal cooked with cumin & turmeric served with steamed rice", "calories": 420, "protein": 18, "carbs": 72, "fats": 6, "prep_time": "25 min", "portion": "1 plate"},
                {"name": "Rajma Chawal", "description": "Red kidney beans curry with basmati rice — North Indian staple", "calories": 450, "protein": 20, "carbs": 78, "fats": 5, "prep_time": "30 min", "portion": "1 plate"},
                {"name": "Roti with Sabzi", "description": "2 whole wheat rotis with seasonal mixed vegetable curry", "calories": 380, "protein": 12, "carbs": 65, "fats": 7, "prep_time": "20 min", "portion": "2 rotis + 1 bowl sabzi"},
            ],
            "evening": [
                {"name": "Sprouts Chaat", "description": "Mixed sprouts with tomato, onion, lemon & chaat masala", "calories": 140, "protein": 10, "carbs": 20, "fats": 2, "prep_time": "5 min", "portion": "1 bowl"},
                {"name": "Makhana (Fox Nuts)", "description": "Dry-roasted lotus seeds with black pepper & pink salt", "calories": 130, "protein": 5, "carbs": 25, "fats": 2, "prep_time": "5 min", "portion": "1 cup (30g)"},
            ],
            "dinner": [
                {"name": "Roti with Moong Dal", "description": "Light yellow moong dal with 2 whole wheat rotis — easy to digest", "calories": 380, "protein": 16, "carbs": 62, "fats": 6, "prep_time": "20 min", "portion": "2 rotis + 1 bowl"},
                {"name": "Brown Rice with Sabzi", "description": "Brown rice with aloo-gobi sabzi (potato & cauliflower curry)", "calories": 400, "protein": 10, "carbs": 70, "fats": 7, "prep_time": "25 min", "portion": "1 plate"},
            ],
        },
        "medium": {
            "breakfast": [
                {"name": "Idli with Sambhar", "description": "Steamed rice & lentil cakes with vegetable sambhar — South Indian classic", "calories": 300, "protein": 11, "carbs": 52, "fats": 4, "prep_time": "20 min", "portion": "3 idlis + 1 bowl sambhar"},
                {"name": "Tofu Bhurji Toast", "description": "Scrambled firm tofu with turmeric, onion & tomato on whole wheat toast", "calories": 320, "protein": 18, "carbs": 35, "fats": 11, "prep_time": "15 min", "portion": "2 slices + bhurji"},
                {"name": "Mixed Fruit Smoothie Bowl", "description": "Blended banana, mango & plant milk topped with chia seeds & granola", "calories": 350, "protein": 8, "carbs": 62, "fats": 8, "prep_time": "10 min", "portion": "1 large bowl"},
            ],
            "mid_morning": [
                {"name": "Almond + Dates", "description": "Raw almonds with Medjool dates — natural energy boost", "calories": 200, "protein": 5, "carbs": 25, "fats": 10, "prep_time": "2 min", "portion": "10 almonds + 2 dates"},
                {"name": "Fruit Chaat", "description": "Seasonal mixed fruits with chaat masala & lemon", "calories": 150, "protein": 2, "carbs": 35, "fats": 1, "prep_time": "5 min", "portion": "1 bowl"},
            ],
            "lunch": [
                {"name": "Tofu Palak with Brown Rice", "description": "Firm tofu in creamy spinach gravy (no cream) served with brown rice", "calories": 480, "protein": 26, "carbs": 58, "fats": 14, "prep_time": "30 min", "portion": "1 plate"},
                {"name": "Chana Masala with Roti", "description": "Chickpea masala curry with 2 whole wheat rotis", "calories": 460, "protein": 22, "carbs": 72, "fats": 9, "prep_time": "25 min", "portion": "1 plate"},
                {"name": "Quinoa Veg Bowl", "description": "Cooked quinoa with roasted vegetables & lemon tahini dressing", "calories": 420, "protein": 18, "carbs": 55, "fats": 12, "prep_time": "20 min", "portion": "1 large bowl"},
            ],
            "evening": [
                {"name": "Roasted Makhana", "description": "Fox nuts roasted with ghee-alternative & spices", "calories": 140, "protein": 5, "carbs": 26, "fats": 2, "prep_time": "8 min", "portion": "1 cup"},
                {"name": "Green Smoothie", "description": "Spinach, banana, chia seeds & coconut water blended", "calories": 180, "protein": 4, "carbs": 38, "fats": 3, "prep_time": "5 min", "portion": "1 glass (350ml)"},
            ],
            "dinner": [
                {"name": "Tofu Curry with Roti", "description": "Spiced tofu pieces in tomato-cashew gravy with 2 rotis", "calories": 480, "protein": 28, "carbs": 50, "fats": 16, "prep_time": "30 min", "portion": "1 plate"},
                {"name": "Dal Tadka with Brown Rice", "description": "Toor dal tempered with ghee-free spice mix served with brown rice", "calories": 440, "protein": 20, "carbs": 70, "fats": 7, "prep_time": "25 min", "portion": "1 plate"},
            ],
        },
        "high": {
            "breakfast": [
                {"name": "Protein Overnight Oats", "description": "Oats soaked in almond milk with plant protein powder, chia & berry compote", "calories": 400, "protein": 28, "carbs": 50, "fats": 10, "prep_time": "5 min (prep night before)", "portion": "1 jar"},
                {"name": "Quinoa Upma", "description": "Quinoa cooked with cashews, curry leaves, ginger & mixed vegetables", "calories": 380, "protein": 16, "carbs": 52, "fats": 12, "prep_time": "20 min", "portion": "1 bowl"},
                {"name": "Tofu Scramble with Avocado Toast", "description": "Silken tofu scramble on whole grain toast with avocado & microgreens", "calories": 420, "protein": 22, "carbs": 38, "fats": 20, "prep_time": "15 min", "portion": "2 slices + scramble"},
            ],
            "mid_morning": [
                {"name": "Plant Protein Shake", "description": "Pea/hemp protein shake with almond milk & banana", "calories": 280, "protein": 28, "carbs": 30, "fats": 5, "prep_time": "3 min", "portion": "1 shaker"},
                {"name": "Trail Mix Premium", "description": "Walnuts, almonds, cashews, pumpkin seeds & goji berries", "calories": 220, "protein": 8, "carbs": 18, "fats": 15, "prep_time": "2 min", "portion": "1 handful (40g)"},
            ],
            "lunch": [
                {"name": "Tempeh Tikka Bowl", "description": "Marinated tempeh with quinoa, roasted veggies & mint chutney", "calories": 520, "protein": 35, "carbs": 52, "fats": 18, "prep_time": "35 min", "portion": "1 large bowl"},
                {"name": "Tofu Steak with Brown Rice & Dahl", "description": "Pan-seared tofu steak with a side of protein-rich moong dahl & brown rice", "calories": 560, "protein": 38, "carbs": 60, "fats": 15, "prep_time": "30 min", "portion": "1 plate"},
            ],
            "evening": [
                {"name": "Edamame with Himalayan Salt", "description": "Steamed young soybeans — high-protein vegan snack", "calories": 150, "protein": 12, "carbs": 10, "fats": 5, "prep_time": "10 min", "portion": "1 bowl (100g)"},
                {"name": "Peanut Butter Protein Bites", "description": "Oat-peanut butter energy balls with hemp seeds", "calories": 200, "protein": 10, "carbs": 22, "fats": 10, "prep_time": "15 min", "portion": "3 balls"},
            ],
            "dinner": [
                {"name": "Buddha Bowl", "description": "Roasted chickpeas, quinoa, roasted sweet potato, kale & tahini dressing", "calories": 520, "protein": 24, "carbs": 65, "fats": 18, "prep_time": "30 min", "portion": "1 large bowl"},
                {"name": "Lentil Soup with Seed Bread", "description": "Red lentil soup with roasted cumin, topped with pumpkin seeds", "calories": 450, "protein": 26, "carbs": 58, "fats": 10, "prep_time": "25 min", "portion": "2 bowls + 2 slices bread"},
            ],
        },
    },

    "vegetarian": {
        "low": {
            "breakfast": [
                {"name": "Egg Bhurji with Toast", "description": "Spiced scrambled eggs with onion, tomato & coriander on whole wheat toast", "calories": 310, "protein": 18, "carbs": 32, "fats": 12, "prep_time": "10 min", "portion": "2 eggs + 2 slices"},
                {"name": "Poha with Curd", "description": "Flattened rice with peanuts served alongside 1 bowl of curd", "calories": 320, "protein": 14, "carbs": 50, "fats": 7, "prep_time": "15 min", "portion": "1 bowl poha + 1 bowl curd"},
                {"name": "Bread Omelette", "description": "2-egg omelette with vegetables sandwiched between whole wheat bread", "calories": 340, "protein": 20, "carbs": 35, "fats": 13, "prep_time": "10 min", "portion": "2 slices"},
            ],
            "mid_morning": [
                {"name": "Boiled Eggs", "description": "2 hard-boiled eggs with black salt — perfect protein snack", "calories": 150, "protein": 13, "carbs": 1, "fats": 10, "prep_time": "10 min", "portion": "2 eggs"},
                {"name": "Banana + Curd", "description": "1 banana with 1 small bowl of curd (dahi)", "calories": 180, "protein": 6, "carbs": 32, "fats": 4, "prep_time": "2 min", "portion": "1 banana + 150g curd"},
            ],
            "lunch": [
                {"name": "Dal Roti with Curd", "description": "Toor dal with 2 whole wheat rotis & a bowl of curd — balanced Indian meal", "calories": 440, "protein": 22, "carbs": 68, "fats": 8, "prep_time": "25 min", "portion": "1 plate"},
                {"name": "Paneer Bhurji with Roti", "description": "Crumbled cottage cheese stir-fry with roti", "calories": 460, "protein": 28, "carbs": 50, "fats": 16, "prep_time": "20 min", "portion": "1 plate"},
                {"name": "Curd Rice", "description": "Cooked rice mixed with curd, mustard seeds, curry leaves & green chillies", "calories": 380, "protein": 12, "carbs": 68, "fats": 6, "prep_time": "15 min", "portion": "1 plate"},
            ],
            "evening": [
                {"name": "Chana Chaat", "description": "Boiled white chickpeas with onion, tomato & spices", "calories": 160, "protein": 10, "carbs": 26, "fats": 2, "prep_time": "5 min", "portion": "1 bowl"},
                {"name": "Dahi with Jaggery", "description": "Fresh curd sweetened with a small piece of jaggery", "calories": 140, "protein": 7, "carbs": 20, "fats": 4, "prep_time": "2 min", "portion": "1 bowl"},
            ],
            "dinner": [
                {"name": "Roti with Dal & Sabzi", "description": "Whole wheat rotis with moong dal & seasonal sabzi", "calories": 400, "protein": 18, "carbs": 64, "fats": 8, "prep_time": "25 min", "portion": "2 rotis + 1 bowl each"},
                {"name": "Khichdi with Ghee", "description": "Rice-lentil porridge with a dash of ghee & papad — easy, nutritious", "calories": 380, "protein": 15, "carbs": 64, "fats": 8, "prep_time": "20 min", "portion": "1 plate"},
            ],
        },
        "medium": {
            "breakfast": [
                {"name": "Idli-Sambhar with Egg", "description": "3 idlis with vegetable sambhar & a boiled egg on the side", "calories": 360, "protein": 20, "carbs": 55, "fats": 8, "prep_time": "20 min", "portion": "3 idlis + sambhar + 1 egg"},
                {"name": "Paneer Paratha with Curd", "description": "Whole wheat paratha stuffed with spiced paneer, served with curd", "calories": 420, "protein": 22, "carbs": 52, "fats": 15, "prep_time": "20 min", "portion": "1 large paratha + 1 bowl curd"},
                {"name": "Greek Yogurt with Muesli & Honey", "description": "High-protein yogurt with mixed muesli, banana & a drizzle of honey", "calories": 380, "protein": 20, "carbs": 55, "fats": 8, "prep_time": "5 min", "portion": "1 bowl"},
            ],
            "mid_morning": [
                {"name": "Paneer Cubes + Fruit", "description": "Raw cottage cheese cubes (100g) with an apple", "calories": 200, "protein": 14, "carbs": 18, "fats": 9, "prep_time": "3 min", "portion": "100g paneer + 1 apple"},
                {"name": "Whey Protein Smoothie", "description": "Whey shake with banana, milk & peanut butter", "calories": 280, "protein": 26, "carbs": 30, "fats": 7, "prep_time": "5 min", "portion": "1 glass"},
            ],
            "lunch": [
                {"name": "Paneer Butter Masala with Brown Rice", "description": "Cottage cheese in rich tomato-cashew gravy with brown rice", "calories": 560, "protein": 30, "carbs": 62, "fats": 20, "prep_time": "35 min", "portion": "1 plate"},
                {"name": "Egg Curry with Roti", "description": "Boiled eggs in spiced onion-tomato gravy with 3 whole wheat rotis", "calories": 500, "protein": 28, "carbs": 58, "fats": 16, "prep_time": "25 min", "portion": "1 plate"},
                {"name": "Chana Masala with Quinoa", "description": "Chickpea masala served with protein-rich quinoa", "calories": 480, "protein": 24, "carbs": 65, "fats": 12, "prep_time": "25 min", "portion": "1 plate"},
            ],
            "evening": [
                {"name": "Paneer Tikka (Tawa)", "description": "Marinated cottage cheese pieces roasted on a tawa with bell peppers", "calories": 200, "protein": 16, "carbs": 8, "fats": 12, "prep_time": "20 min", "portion": "6 pieces"},
                {"name": "Boiled Egg + Roasted Makhana", "description": "2 boiled eggs with a cup of spiced fox nuts", "calories": 220, "protein": 16, "carbs": 20, "fats": 10, "prep_time": "10 min", "portion": "2 eggs + 1 cup makhana"},
            ],
            "dinner": [
                {"name": "Paneer Sabzi with Multigrain Roti", "description": "Cottage cheese dry sabzi with 2 multigrain rotis & mint raita", "calories": 480, "protein": 30, "carbs": 52, "fats": 16, "prep_time": "25 min", "portion": "1 plate"},
                {"name": "Dal Makhani with Brown Rice", "description": "Slow-cooked black lentil dal with a touch of cream & brown rice", "calories": 500, "protein": 22, "carbs": 68, "fats": 14, "prep_time": "40 min", "portion": "1 plate"},
            ],
        },
        "high": {
            "breakfast": [
                {"name": "Protein Pancakes with Honey", "description": "Whole wheat & cottage cheese pancakes topped with honey & berries", "calories": 440, "protein": 30, "carbs": 52, "fats": 12, "prep_time": "20 min", "portion": "3 pancakes"},
                {"name": "Egg White Omelette with Paneer", "description": "4-egg-white omelette stuffed with paneer, spinach & mushrooms", "calories": 380, "protein": 36, "carbs": 10, "fats": 16, "prep_time": "15 min", "portion": "1 omelette"},
                {"name": "Greek Yogurt Parfait", "description": "Full-fat Greek yogurt with granola, berries, chia seeds & walnut", "calories": 420, "protein": 24, "carbs": 48, "fats": 14, "prep_time": "8 min", "portion": "1 large bowl"},
            ],
            "mid_morning": [
                {"name": "Whey + Peanut Butter Shake", "description": "Whey protein with full-fat milk, peanut butter & banana", "calories": 380, "protein": 35, "carbs": 35, "fats": 12, "prep_time": "5 min", "portion": "1 large shaker"},
                {"name": "Cottage Cheese Bowl with Nuts", "description": "100g paneer with mixed nuts (almonds, walnuts, cashews)", "calories": 280, "protein": 18, "carbs": 10, "fats": 20, "prep_time": "3 min", "portion": "1 bowl"},
            ],
            "lunch": [
                {"name": "Grilled Paneer Steak with Quinoa", "description": "Thick slab of marinated paneer grilled to perfection, served with quinoa & grilled veggies", "calories": 580, "protein": 42, "carbs": 50, "fats": 22, "prep_time": "30 min", "portion": "1 plate"},
                {"name": "Egg-Paneer High Protein Thali", "description": "Boiled eggs + paneer curry + brown rice + daal + raita", "calories": 620, "protein": 45, "carbs": 65, "fats": 20, "prep_time": "35 min", "portion": "1 full thali"},
            ],
            "evening": [
                {"name": "Paneer Protein Bites", "description": "Roasted cubed paneer with ajwain & Himalayan salt", "calories": 220, "protein": 18, "carbs": 4, "fats": 14, "prep_time": "10 min", "portion": "1 bowl"},
                {"name": "Hard-Boiled Eggs + Mixed Nuts", "description": "3 boiled eggs with premium mixed nuts", "calories": 280, "protein": 22, "carbs": 6, "fats": 20, "prep_time": "10 min", "portion": "3 eggs + 30g nuts"},
            ],
            "dinner": [
                {"name": "Grilled Paneer with Sautéed Veggies", "description": "High-protein grilled paneer with stir-fried broccoli, bell pepper & olive oil", "calories": 480, "protein": 36, "carbs": 18, "fats": 28, "prep_time": "25 min", "portion": "1 plate"},
                {"name": "Quinoa Paneer Khichdi", "description": "Quinoa cooked with crumbled paneer, dal & turmeric — muscle recovery meal", "calories": 500, "protein": 38, "carbs": 48, "fats": 16, "prep_time": "25 min", "portion": "1 plate"},
            ],
        },
    },

    "non_vegetarian": {
        "low": {
            "breakfast": [
                {"name": "Egg Bhurji with Bread", "description": "2-egg masala scramble with onion, tomato & coriander on bread", "calories": 320, "protein": 20, "carbs": 30, "fats": 12, "prep_time": "10 min", "portion": "2 eggs + 2 slices"},
                {"name": "Boiled Eggs with Poha", "description": "2 boiled eggs alongside a bowl of vegetable poha", "calories": 340, "protein": 20, "carbs": 45, "fats": 9, "prep_time": "15 min", "portion": "2 eggs + 1 bowl poha"},
                {"name": "Omelette with Toast", "description": "3-egg vegetable omelette with 2 slices whole wheat toast", "calories": 360, "protein": 24, "carbs": 32, "fats": 14, "prep_time": "10 min", "portion": "3-egg omelette + 2 slices"},
            ],
            "mid_morning": [
                {"name": "Boiled Eggs", "description": "3 hard-boiled eggs — high protein budget snack", "calories": 225, "protein": 19, "carbs": 1, "fats": 15, "prep_time": "10 min", "portion": "3 eggs"},
                {"name": "Tuna Salad (Can)", "description": "Canned tuna mixed with onion, lemon & cucumber", "calories": 150, "protein": 22, "carbs": 5, "fats": 4, "prep_time": "5 min", "portion": "1 can"},
            ],
            "lunch": [
                {"name": "Chicken Dalcha with Rice", "description": "Budget chicken pieces cooked with lentils, tamarind & spices — Hyderabadi style", "calories": 460, "protein": 32, "carbs": 55, "fats": 12, "prep_time": "35 min", "portion": "1 plate"},
                {"name": "Egg Curry with Roti", "description": "3 boiled eggs in spiced tomato-onion gravy with 3 rotis", "calories": 500, "protein": 30, "carbs": 58, "fats": 18, "prep_time": "25 min", "portion": "1 plate"},
                {"name": "Fish Curry with Rice", "description": "Local fish (rohu/catla) in spiced tomato gravy with steamed rice", "calories": 420, "protein": 30, "carbs": 48, "fats": 10, "prep_time": "30 min", "portion": "1 plate"},
            ],
            "evening": [
                {"name": "Boiled Egg + Chana Chaat", "description": "1 boiled egg alongside a bowl of spiced chickpea chaat", "calories": 200, "protein": 16, "carbs": 22, "fats": 6, "prep_time": "5 min", "portion": "1 egg + 1 bowl"},
                {"name": "Roasted Chana", "description": "Dal chana roasted with salt & cumin", "calories": 160, "protein": 10, "carbs": 24, "fats": 3, "prep_time": "3 min", "portion": "1 handful (50g)"},
            ],
            "dinner": [
                {"name": "Dal with Boiled Egg & Roti", "description": "Protein-rich lentil dal with 2 boiled eggs & 2 rotis", "calories": 440, "protein": 30, "carbs": 56, "fats": 12, "prep_time": "25 min", "portion": "1 plate"},
                {"name": "Chicken Keema with Roti", "description": "Minced chicken cooked with peas & spices, served with 2 rotis", "calories": 480, "protein": 35, "carbs": 45, "fats": 14, "prep_time": "30 min", "portion": "1 plate"},
            ],
        },
        "medium": {
            "breakfast": [
                {"name": "Chicken Sandwich", "description": "Grilled chicken breast strips with lettuce, tomato & mustard on whole wheat", "calories": 380, "protein": 30, "carbs": 38, "fats": 10, "prep_time": "15 min", "portion": "2 sandwiches"},
                {"name": "Egg White Omelette", "description": "4 egg-white masala omelette with mushrooms & spinach", "calories": 200, "protein": 28, "carbs": 6, "fats": 5, "prep_time": "12 min", "portion": "1 large omelette"},
                {"name": "Egg Paratha with Curd", "description": "Whole wheat paratha with egg filling, served with thick curd", "calories": 420, "protein": 22, "carbs": 50, "fats": 14, "prep_time": "20 min", "portion": "1 paratha + 1 bowl curd"},
            ],
            "mid_morning": [
                {"name": "Grilled Chicken Strips", "description": "Marinated chicken breast strips grilled with herbs & lemon", "calories": 180, "protein": 30, "carbs": 2, "fats": 5, "prep_time": "20 min", "portion": "100g"},
                {"name": "Egg + Fruit Combo", "description": "2 boiled eggs with a medium apple", "calories": 200, "protein": 14, "carbs": 22, "fats": 10, "prep_time": "10 min", "portion": "2 eggs + 1 apple"},
            ],
            "lunch": [
                {"name": "Grilled Chicken with Brown Rice", "description": "Marinated chicken thighs grilled & served with brown rice & mint raita", "calories": 520, "protein": 42, "carbs": 52, "fats": 12, "prep_time": "30 min", "portion": "1 plate"},
                {"name": "Fish Tikka with Dal & Roti", "description": "Tandoori-style fish tikka with protein-rich dal & roti", "calories": 480, "protein": 38, "carbs": 48, "fats": 14, "prep_time": "30 min", "portion": "1 plate"},
                {"name": "Chicken Biryani (Less Oil)", "description": "Aromatic basmati rice cooked with spiced chicken — lightly oiled version", "calories": 560, "protein": 38, "carbs": 65, "fats": 14, "prep_time": "45 min", "portion": "1 plate"},
            ],
            "evening": [
                {"name": "Chicken Tikka (Tawa)", "description": "Marinated chicken tikka cooked on a tawa with minimal oil", "calories": 200, "protein": 28, "carbs": 6, "fats": 7, "prep_time": "25 min", "portion": "3-4 pieces"},
                {"name": "Tuna & Egg Salad", "description": "Canned tuna with chopped egg, cucumber & lemon dressing", "calories": 180, "protein": 26, "carbs": 4, "fats": 7, "prep_time": "10 min", "portion": "1 bowl"},
            ],
            "dinner": [
                {"name": "Grilled Chicken with Roti & Sabzi", "description": "Lean grilled chicken breast with 2 rotis & stir-fried vegetables", "calories": 480, "protein": 40, "carbs": 48, "fats": 12, "prep_time": "30 min", "portion": "1 plate"},
                {"name": "Egg & Chicken Soup", "description": "High-protein clear soup with egg drops, shredded chicken & vegetables", "calories": 280, "protein": 28, "carbs": 18, "fats": 8, "prep_time": "25 min", "portion": "2 bowls"},
            ],
        },
        "high": {
            "breakfast": [
                {"name": "Grilled Chicken Breast with Eggs", "description": "150g grilled chicken breast with 2-egg omelette & multigrain toast", "calories": 480, "protein": 52, "carbs": 28, "fats": 14, "prep_time": "20 min", "portion": "1 plate"},
                {"name": "Salmon Omelette", "description": "3-egg omelette with smoked salmon, spinach & cream cheese", "calories": 420, "protein": 40, "carbs": 6, "fats": 24, "prep_time": "15 min", "portion": "1 omelette"},
                {"name": "Protein Shake with Egg Whites", "description": "Whey protein shake with 4 egg whites, banana & peanut butter", "calories": 460, "protein": 48, "carbs": 38, "fats": 10, "prep_time": "8 min", "portion": "1 large shaker"},
            ],
            "mid_morning": [
                {"name": "Grilled Shrimp Salad", "description": "Grilled prawns with mixed greens, cucumber & olive oil dressing", "calories": 200, "protein": 30, "carbs": 6, "fats": 8, "prep_time": "15 min", "portion": "1 bowl"},
                {"name": "Chicken & Paneer Cubes", "description": "Cold grilled chicken strips with raw paneer cubes & mint chutney", "calories": 260, "protein": 32, "carbs": 6, "fats": 12, "prep_time": "5 min", "portion": "1 bowl"},
            ],
            "lunch": [
                {"name": "Grilled Salmon with Quinoa", "description": "Atlantic salmon fillet grilled with herbs, served with quinoa & roasted vegetables", "calories": 580, "protein": 50, "carbs": 48, "fats": 20, "prep_time": "30 min", "portion": "1 plate"},
                {"name": "Chicken Steak with Brown Rice", "description": "Marinated chicken steak grilled to perfection with brown rice & sautéed veggies", "calories": 560, "protein": 52, "carbs": 50, "fats": 14, "prep_time": "30 min", "portion": "1 plate"},
                {"name": "Tuna Bowl with Brown Rice", "description": "Seared tuna with brown rice, edamame, cucumber & soy-ginger dressing", "calories": 500, "protein": 44, "carbs": 52, "fats": 12, "prep_time": "20 min", "portion": "1 bowl"},
            ],
            "evening": [
                {"name": "Protein Shake + Boiled Eggs", "description": "Whey shake blended with milk + 2 boiled eggs as post-workout snack", "calories": 320, "protein": 40, "carbs": 20, "fats": 10, "prep_time": "5 min", "portion": "1 shaker + 2 eggs"},
                {"name": "Grilled Chicken Tikka", "description": "Tender chicken tikka pieces straight from the grill with coriander chutney", "calories": 240, "protein": 36, "carbs": 8, "fats": 7, "prep_time": "25 min", "portion": "6 pieces"},
            ],
            "dinner": [
                {"name": "Grilled Fish with Stir-Fry Veggies", "description": "Basa/Rohu fillet grilled with olive oil, garlic & lemon, with stir-fried broccoli", "calories": 420, "protein": 44, "carbs": 18, "fats": 16, "prep_time": "25 min", "portion": "1 plate"},
                {"name": "Chicken Steak with Salad", "description": "Lean chicken steak with a large mixed salad & vinaigrette — low carb dinner", "calories": 380, "protein": 46, "carbs": 12, "fats": 14, "prep_time": "25 min", "portion": "1 plate"},
            ],
        },
    },
}

# ─── Tips & Warnings Database ─────────────────────────────────────────────────
GOAL_TIPS = {
    "fat_loss": [
        "Eat meals slowly — it takes 20 minutes for your brain to signal fullness.",
        "Start every meal with a bowl of vegetable salad to reduce total calorie intake.",
        "Replace refined carbs (maida, white bread) with whole grains (roti, brown rice).",
        "Train in a fasted state (morning) to maximize fat burn if tolerated.",
        "Track your calories for at least 2 weeks to build awareness.",
        "Prioritize protein at every meal — it keeps you full and preserves muscle.",
    ],
    "muscle_gain": [
        "Eat every 3-4 hours to maintain a positive nitrogen balance for muscle growth.",
        "Consume a protein-rich meal or shake within 30 minutes post-workout.",
        "Don't skip carbs — they fuel your workouts and help with muscle recovery.",
        "Sleep 7-9 hours nightly; growth hormone peaks during deep sleep.",
        "Progress overload in the gym — increase weights/reps weekly.",
        "Creatine monohydrate (3-5g/day) is safe and well-researched for strength gains.",
    ],
    "maintenance": [
        "Weigh yourself weekly (same time, same conditions) to track changes.",
        "Aim for 80/20 nutrition — 80% whole foods, 20% flexibility.",
        "Consistent meal times help regulate hunger hormones.",
        "Stay hydrated — thirst is often mistaken for hunger.",
        "Include 150+ minutes of moderate exercise per week.",
    ],
}

GOAL_WARNINGS = {
    "fat_loss": [
        "⚠️ Do NOT go below 1200 kcal (women) or 1500 kcal (men) — this causes muscle loss.",
        "⚠️ Avoid crash diets — they slow your metabolism long-term.",
        "⚠️ High cardio without adequate protein leads to muscle wasting.",
        "⚠️ Track fat loss via measurements & photos, not just the scale.",
    ],
    "muscle_gain": [
        "⚠️ A dirty bulk (excess junk food) adds unwanted fat — keep the surplus clean.",
        "⚠️ Too much protein doesn't equal more muscle — excess is stored as fat.",
        "⚠️ Without progressive overload training, extra calories become fat.",
        "⚠️ Alcohol significantly impairs muscle protein synthesis.",
    ],
    "maintenance": [
        "⚠️ Maintenance calories change as body weight changes — reassess every 4-6 weeks.",
        "⚠️ Eating the same foods daily risks nutrient deficiencies — vary your diet.",
    ],
}

DIET_TYPE_WARNINGS = {
    "vegan": [
        "🌱 Supplement B12 — it's not naturally available in plant foods.",
        "🌱 Consider Omega-3 (algae-based) and Vitamin D3 supplementation.",
        "🌱 Combine foods to get all essential amino acids (e.g., rice + lentils).",
    ],
    "vegetarian": [
        "🥚 If muscle gain is the goal, consider whey protein supplementation.",
        "🥚 Iron from plant sources (non-heme) has lower absorption — pair with Vitamin C.",
    ],
    "non_vegetarian": [
        "🍗 Limit processed meats (sausage, salami) — linked to health risks.",
        "🍗 Prefer grilling, steaming or baking over deep-frying.",
    ],
}

SUPPLEMENT_ADVICE = {
    "fat_loss": [
        {"name": "Whey Protein", "dose": "1 scoop (25g)", "timing": "Post-workout", "note": "Prevents muscle loss during deficit"},
        {"name": "Caffeine / Green Tea Extract", "dose": "200mg caffeine or 3 cups green tea", "timing": "Pre-workout", "note": "Modest thermogenic effect"},
        {"name": "Vitamin D3", "dose": "2000 IU", "timing": "With breakfast", "note": "Most Indians are deficient"},
    ],
    "muscle_gain": [
        {"name": "Creatine Monohydrate", "dose": "3-5g", "timing": "Post-workout", "note": "Proven to increase strength & muscle volume"},
        {"name": "Whey Protein", "dose": "1-2 scoops (25-50g)", "timing": "Post-workout + between meals", "note": "Fills protein gaps easily"},
        {"name": "Vitamin D3 + K2", "dose": "2000 IU D3 + 100mcg K2", "timing": "With breakfast", "note": "Supports testosterone & bone health"},
        {"name": "ZMA (Zinc, Magnesium, B6)", "dose": "1 serving", "timing": "Before bed", "note": "Supports recovery & sleep quality"},
    ],
    "maintenance": [
        {"name": "Multivitamin", "dose": "1 tablet", "timing": "With breakfast", "note": "Insurance against micronutrient gaps"},
        {"name": "Omega-3 Fish Oil", "dose": "2-3g EPA/DHA", "timing": "With meals", "note": "Anti-inflammatory, heart health"},
    ],
}

WORKOUT_NUTRITION = {
    "fat_loss": {
        "pre_workout": "Light carb + protein 60-90 min before: 1 banana + 10 almonds OR 1 roti + egg",
        "post_workout": "Protein-focused within 30 min: whey shake OR 3 boiled eggs + fruit",
        "hydration": "2.5-3.5 litres of water daily. Add electrolytes if sweating heavily.",
    },
    "muscle_gain": {
        "pre_workout": "Carb + protein 60-90 min before: Brown rice + chicken OR Banana + peanut butter + whey",
        "post_workout": "Carb + protein within 30 min: Whey shake + banana OR Rice + chicken OR Milk + bread",
        "hydration": "3-4 litres of water daily. Consider coconut water post-workout for electrolytes.",
    },
    "maintenance": {
        "pre_workout": "Moderate meal 60 min before: Fruit + nuts OR Toast + peanut butter",
        "post_workout": "Balanced meal within 60 min: Normal lunch/dinner portion",
        "hydration": "2.5-3 litres of water daily.",
    },
}


# ─── Core Calculation Functions ───────────────────────────────────────────────

def calculate_bmr(age: int, gender: str, height: float, weight: float) -> float:
    """Mifflin-St Jeor equation."""
    if gender.lower() == "male":
        return 10 * weight + 6.25 * height - 5 * age + 5
    else:
        return 10 * weight + 6.25 * height - 5 * age - 161


def calculate_tdee(bmr: float, activity: str) -> float:
    multiplier = ACTIVITY_MULTIPLIERS.get(activity.lower(), 1.375)
    return round(bmr * multiplier)


def calculate_target_calories(tdee: float, goal: str) -> int:
    adjustment = GOAL_CALORIE_ADJUSTMENT.get(goal.lower(), 0)
    return max(1200, round(tdee * (1 + adjustment)))


def calculate_macros(calories: int, weight: float, goal: str) -> dict:
    g = goal.lower()
    if g == "muscle_gain":
        protein_g = round(weight * 2.2)
        fat_pct    = 0.25
    elif g == "fat_loss":
        protein_g = round(weight * 2.0)
        fat_pct    = 0.25
    else:
        protein_g = round(weight * 1.6)
        fat_pct    = 0.30

    fat_g   = round((calories * fat_pct) / 9)
    carb_g  = round((calories - protein_g * 4 - fat_g * 9) / 4)
    carb_g  = max(50, carb_g)

    return {
        "protein": protein_g,
        "carbs":   carb_g,
        "fats":    fat_g,
        "protein_pct": round(protein_g * 4 / calories * 100),
        "carbs_pct":   round(carb_g * 4 / calories * 100),
        "fats_pct":    round(fat_g * 9 / calories * 100),
    }


def calculate_bmi(weight: float, height: float) -> dict:
    bmi = weight / ((height / 100) ** 2)
    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"
    return {"value": round(bmi, 1), "category": category}


def get_meal_plan(diet_type: str, budget: str, goal: str) -> dict:
    dt = diet_type.lower()
    bd = budget.lower()
    db = FOOD_DB.get(dt, FOOD_DB["vegetarian"]).get(bd, FOOD_DB.get(dt, FOOD_DB["vegetarian"])["medium"])

    return {
        "breakfast":     db.get("breakfast", []),
        "mid_morning":   db.get("mid_morning", []),
        "lunch":         db.get("lunch", []),
        "evening":       db.get("evening", []),
        "dinner":        db.get("dinner", []),
    }


def generate_full_diet(
    age: int,
    gender: str,
    height: float,
    weight: float,
    goal: str,
    activity: str,
    diet_type: str,
    budget: str,
    allergies: list = None,
) -> dict:
    allergies = allergies or []
    g = goal.lower()

    bmr     = calculate_bmr(age, gender, height, weight)
    tdee    = calculate_tdee(bmr, activity)
    cal     = calculate_target_calories(tdee, g)
    macros  = calculate_macros(cal, weight, g)
    bmi     = calculate_bmi(weight, height)
    meals   = get_meal_plan(diet_type, budget, g)

    tips      = GOAL_TIPS.get(g, []) + (DIET_TYPE_WARNINGS.get(diet_type.lower(), []))
    warnings  = GOAL_WARNINGS.get(g, [])
    supps     = SUPPLEMENT_ADVICE.get(g, [])
    wn        = WORKOUT_NUTRITION.get(g, {})

    return {
        "user_summary": {
            "age": age,
            "gender": gender,
            "height_cm": height,
            "weight_kg": weight,
            "bmi": bmi,
            "goal": goal,
            "activity": activity,
            "diet_type": diet_type,
            "budget": budget,
        },
        "calories": {
            "bmr":    round(bmr),
            "tdee":   tdee,
            "target": cal,
            "deficit_surplus": cal - tdee,
        },
        "macros": macros,
        "meal_plan": meals,
        "workout_nutrition": wn,
        "supplements": supps,
        "tips":     tips[:6],
        "warnings": warnings,
    }
