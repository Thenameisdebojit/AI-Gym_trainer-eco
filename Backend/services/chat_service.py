import httpx

OLLAMA_BASE = "http://localhost:11434"
OLLAMA_MODEL = "llama3"

SYSTEM_PROMPT = (
    "You are an expert AI fitness coach with deep knowledge in:\n"
    "- Strength training, hypertrophy, powerlifting, and functional fitness\n"
    "- Cardio, HIIT, endurance sports, and athletic conditioning\n"
    "- Nutrition, meal planning, macros, and supplementation for athletes\n"
    "- Sports performance, injury prevention, and recovery protocols\n"
    "- Martial arts conditioning (boxing, MMA, BJJ, wrestling, Muay Thai)\n"
    "- Gym programming, periodization, and progressive overload\n"
    "- Flexibility, mobility, and yoga for athletes\n\n"
    "RULES:\n"
    "- Always respond in the same language the user writes in.\n"
    "- Be concise, practical, and motivating — 2–4 sentences unless a plan is requested.\n"
    "- Personalize advice using any user profile data provided.\n"
    "- Never say you are an AI language model — you are a fitness coach.\n"
    "- If asked about mental health or clinical conditions, encourage seeing a professional."
)

WORKOUT_SYSTEM_PROMPT = (
    "You are a live workout voice coach. Your role is to give brief, energetic coaching cues "
    "during a live workout session. Keep responses to 1-2 short sentences. Be encouraging and specific. "
    "Respond in the same language specified. No markdown formatting."
)

PHASE_TEMPLATES = {
    "start": {
        "en": "We're starting with {exercise}! Get ready to crush it.",
        "es": "¡Empezamos con {exercise}! Prepárate para darlo todo.",
        "fr": "On commence avec {exercise} ! Prépare-toi à tout donner.",
        "de": "Wir beginnen mit {exercise}! Mach dich bereit, alles zu geben.",
        "hi": "हम {exercise} से शुरू कर रहे हैं! तैयार हो जाओ।",
        "pt": "Começamos com {exercise}! Prepare-se para arrasar.",
    },
    "exercise": {
        "en": "Next up: {exercise}. Keep that energy going, you're doing great!",
        "es": "A continuación: {exercise}. ¡Mantén esa energía, lo estás haciendo genial!",
        "fr": "Ensuite : {exercise}. Garde cette énergie, tu fais du super travail !",
        "de": "Als nächstes: {exercise}. Behalte die Energie, du machst das großartig!",
        "hi": "अगला है: {exercise}। यह ऊर्जा बनाए रखो, तुम बहुत अच्छा कर रहे हो!",
        "pt": "A seguir: {exercise}. Mantém essa energia, estás a arrasar!",
    },
    "rest": {
        "en": "Good work! Take your breath, the next exercise is coming up strong.",
        "es": "¡Buen trabajo! Recupera el aliento, el próximo ejercicio se acerca.",
        "fr": "Bon travail ! Reprends ton souffle, le prochain exercice arrive.",
        "de": "Gute Arbeit! Hol Luft, die nächste Übung kommt gleich.",
        "hi": "अच्छा काम! सांस लो, अगला व्यायाम आने वाला है।",
        "pt": "Bom trabalho! Recupera o fôlego, o próximo exercício está chegando.",
    },
    "complete": {
        "en": "Workout complete! You crushed it today — amazing effort!",
        "es": "¡Entrenamiento completado! Lo destrozaste hoy, ¡esfuerzo increíble!",
        "fr": "Entraînement terminé ! Tu as tout donné aujourd'hui — effort incroyable !",
        "de": "Training abgeschlossen! Du hast es heute gerockt — tolle Leistung!",
        "hi": "वर्कआउट पूरा हुआ! आज आपने शानदार किया — अद्भुत प्रयास!",
        "pt": "Treino concluído! Você arrasou hoje — esforço incrível!",
    },
}

REPLIES = {
    "muscle": {
        "en": "Focus on progressive overload and adequate protein — aim for 1.6–2.2 g per kg of body weight daily 🥩",
        "es": "Enfócate en la sobrecarga progresiva y proteína adecuada — apunta a 1,6–2,2 g por kg de peso corporal diariamente 🥩",
        "fr": "Mise sur la surcharge progressive et les protéines — vise 1,6–2,2 g par kg de poids corporel par jour 🥩",
        "de": "Setze auf progressive Überlastung und ausreichend Protein — Ziel: 1,6–2,2 g pro kg Körpergewicht täglich 🥩",
        "hi": "प्रगतिशील ओवरलोड और पर्याप्त प्रोटीन पर ध्यान दें — रोज़ाना 1.6–2.2 ग्राम प्रति किलो वज़न लक्ष्य रखें 🥩",
        "pt": "Foque na sobrecarga progressiva e proteína adequada — aponte para 1,6–2,2 g por kg de peso corporal diariamente 🥩",
    },
    "fat": {
        "en": "Combine strength training with a moderate caloric deficit. HIIT 2–3x per week accelerates results 🔥",
        "es": "Combina entrenamiento de fuerza con un déficit calórico moderado. HIIT 2–3 veces por semana acelera los resultados 🔥",
        "fr": "Combine entraînement de force et déficit calorique modéré. Le HIIT 2–3 fois par semaine accélère les résultats 🔥",
        "de": "Kombiniere Krafttraining mit einem moderaten Kaloriendefizit. HIIT 2–3x pro Woche beschleunigt die Ergebnisse 🔥",
        "hi": "शक्ति प्रशिक्षण को मध्यम कैलोरी घाटे के साथ मिलाएं। HIIT सप्ताह में 2–3 बार परिणाम तेज़ करता है 🔥",
        "pt": "Combine treino de força com déficit calórico moderado. HIIT 2–3x por semana acelera os resultados 🔥",
    },
    "rest": {
        "en": "Most people thrive with 1–2 rest days per week. Listen to your body — recovery is where growth happens 😴",
        "es": "La mayoría progresa con 1–2 días de descanso por semana. Escucha tu cuerpo — la recuperación es donde ocurre el crecimiento 😴",
        "fr": "La plupart des gens s'épanouissent avec 1–2 jours de repos par semaine. Écoute ton corps — la récupération c'est là que la croissance se produit 😴",
        "de": "Die meisten gedeihen mit 1–2 Ruhetagen pro Woche. Hör auf deinen Körper — Erholung ist der Moment, wo das Wachstum stattfindet 😴",
        "hi": "ज़्यादातर लोग सप्ताह में 1–2 आराम के दिनों से अच्छा प्रदर्शन करते हैं। अपने शरीर को सुनें — विकास रिकवरी में होता है 😴",
        "pt": "A maioria das pessoas se dá bem com 1–2 dias de descanso por semana. Ouça seu corpo — a recuperação é onde o crescimento acontece 😴",
    },
    "nutri": {
        "en": "Eat a balanced meal 2–3 hours before training: carbs for energy, protein for muscle. Stay hydrated! 🥗",
        "es": "Come una comida equilibrada 2–3 horas antes del entrenamiento: carbohidratos para energía, proteína para músculo. ¡Mantente hidratado! 🥗",
        "fr": "Mange un repas équilibré 2–3 heures avant l'entraînement : glucides pour l'énergie, protéines pour les muscles. Reste hydraté ! 🥗",
        "de": "Iss 2–3 Stunden vor dem Training eine ausgewogene Mahlzeit: Kohlenhydrate für Energie, Protein für Muskeln. Bleib hydratiert! 🥗",
        "hi": "प्रशिक्षण से 2–3 घंटे पहले संतुलित भोजन करें: ऊर्जा के लिए कार्बोहाइड्रेट, मांसपेशियों के लिए प्रोटीन। हाइड्रेटेड रहें! 🥗",
        "pt": "Faça uma refeição equilibrada 2–3 horas antes do treino: carboidratos para energia, proteína para músculo. Mantenha-se hidratado! 🥗",
    },
    "flex": {
        "en": "Stretch daily for 10–15 minutes. Yoga and foam rolling also help improve range of motion significantly 🧘",
        "es": "Estírate diariamente durante 10–15 minutos. El yoga y el foam rolling también mejoran significativamente el rango de movimiento 🧘",
        "fr": "Étire-toi quotidiennement pendant 10–15 minutes. Le yoga et le foam rolling améliorent aussi significativement l'amplitude des mouvements 🧘",
        "de": "Dehne dich täglich 10–15 Minuten. Yoga und Foam Rolling verbessern auch die Beweglichkeit erheblich 🧘",
        "hi": "रोज़ाना 10–15 मिनट स्ट्रेच करें। योग और फोम रोलिंग भी गति की सीमा में काफी सुधार करते हैं 🧘",
        "pt": "Alongue-se diariamente por 10–15 minutos. Yoga e foam rolling também ajudam a melhorar significativamente a amplitude de movimento 🧘",
    },
    "plan": {
        "en": "A solid weekly plan: 3 strength days, 2 cardio days, 1 active recovery, 1 full rest. Adjust based on your goal! 📅",
        "es": "Un buen plan semanal: 3 días de fuerza, 2 de cardio, 1 de recuperación activa, 1 de descanso total. ¡Ajusta según tu objetivo! 📅",
        "fr": "Un plan hebdomadaire solide : 3 jours de force, 2 de cardio, 1 de récupération active, 1 de repos total. Adapte selon ton objectif ! 📅",
        "de": "Ein solider Wochenplan: 3 Krafttage, 2 Cardiotage, 1 aktive Erholung, 1 vollständige Ruhe. Passe es deinem Ziel an! 📅",
        "hi": "एक ठोस साप्ताहिक योजना: 3 शक्ति दिन, 2 कार्डियो दिन, 1 सक्रिय रिकवरी, 1 पूर्ण आराम। अपने लक्ष्य के अनुसार समायोजित करें! 📅",
        "pt": "Um plano semanal sólido: 3 dias de força, 2 de cardio, 1 de recuperação ativa, 1 de descanso total. Ajuste conforme seu objetivo! 📅",
    },
    "sad": {
        "en": "You've come this far. Don't stop now 💪",
        "es": "Has llegado hasta aquí. ¡No te detengas ahora! 💪",
        "fr": "Tu es allé si loin. Ne t'arrête pas maintenant 💪",
        "de": "Du hast es bis hierher geschafft. Hör jetzt nicht auf 💪",
        "hi": "आप इतनी दूर आए हैं। अब मत रुकिए 💪",
        "pt": "Você chegou até aqui. Não pare agora 💪",
    },
    "motivat": {
        "en": "Discipline > Motivation. Keep going!",
        "es": "Disciplina > Motivación. ¡Sigue adelante!",
        "fr": "Discipline > Motivation. Continue !",
        "de": "Disziplin > Motivation. Weiter so!",
        "hi": "अनुशासन > प्रेरणा। चलते रहो!",
        "pt": "Disciplina > Motivação. Continue!",
    },
}

DEFAULT_REPLY = {
    "en": "Stay consistent and trust the process! Every rep counts 💪",
    "es": "¡Sé constante y confía en el proceso! Cada repetición cuenta 💪",
    "fr": "Reste régulier et fais confiance au processus ! Chaque répétition compte 💪",
    "de": "Bleib konsequent und vertraue dem Prozess! Jede Wiederholung zählt 💪",
    "hi": "नियमित रहें और प्रक्रिया पर भरोसा रखें! हर दोहराव मायने रखता है 💪",
    "pt": "Seja consistente e confie no processo! Cada repetição conta 💪",
}

KEYWORD_MAP = [
    ("muscle",   "muscle"),
    ("músculo",  "muscle"),
    ("muskeln",  "muscle"),
    ("मांसपेशी", "muscle"),
    ("fat",         "fat"),
    ("grasa",       "fat"),
    ("graisse",     "fat"),
    ("fett",        "fat"),
    ("gordura",     "fat"),
    ("वसा",         "fat"),
    ("फैट",         "fat"),
    ("rest",        "rest"),
    ("descanso",    "rest"),
    ("repos",       "rest"),
    ("ruhe",        "rest"),
    ("आराम",        "rest"),
    ("nutri",       "nutri"),
    ("nutrición",   "nutri"),
    ("nutrição",    "nutri"),
    ("nutrition",   "nutri"),
    ("ernährung",   "nutri"),
    ("पोषण",        "nutri"),
    ("flex",           "flex"),
    ("flexibilidad",   "flex"),
    ("flexibilité",    "flex"),
    ("flexibilität",   "flex"),
    ("flexibilidade",  "flex"),
    ("लचीलापन",        "flex"),
    ("plan",    "plan"),
    ("plano",   "plan"),
    ("प्लान",   "plan"),
    ("साप्ताहिक", "plan"),
    ("sad",     "sad"),
    ("triste",  "sad"),
    ("motivat", "motivat"),
    ("motivaci", "motivat"),
    ("motivation", "motivat"),
    ("प्रेरणा",  "motivat"),
]


def keyword_reply(msg: str, language: str = "en") -> str:
    lang = language if language in ("en", "es", "fr", "de", "hi", "pt") else "en"
    msg_lower = msg.lower()
    for keyword, topic in KEYWORD_MAP:
        if keyword.lower() in msg_lower:
            translations = REPLIES[topic]
            return translations.get(lang, translations["en"])
    return DEFAULT_REPLY.get(lang, DEFAULT_REPLY["en"])


def reply(msg: str, language: str = "en") -> str:
    return keyword_reply(msg, language)


async def ollama_chat(message: str, language: str = "en", user_profile: dict = None) -> str:
    lang = language if language in ("en", "es", "fr", "de", "hi", "pt") else "en"

    profile_ctx = ""
    if user_profile:
        parts = []
        if user_profile.get("name") and user_profile["name"] != "User":
            parts.append(f"Name: {user_profile['name']}")
        if user_profile.get("age"):
            parts.append(f"Age: {user_profile['age']}")
        if user_profile.get("weight"):
            parts.append(f"Weight: {user_profile['weight']}")
        if user_profile.get("height"):
            parts.append(f"Height: {user_profile['height']}")
        if parts:
            profile_ctx = f"\n\nUser profile: {', '.join(parts)}"

    lang_instruction = {
        "en": "Respond in English.",
        "es": "Responde en español.",
        "fr": "Réponds en français.",
        "de": "Antworte auf Deutsch.",
        "hi": "हिंदी में जवाब दें।",
        "pt": "Responda em português.",
    }.get(lang, "Respond in English.")

    full_prompt = (
        f"{SYSTEM_PROMPT}{profile_ctx}\n\n"
        f"Instruction: {lang_instruction}\n\n"
        f"User: {message}\n\nAssistant:"
    )

    async with httpx.AsyncClient(timeout=25.0) as client:
        response = await client.post(
            f"{OLLAMA_BASE}/api/generate",
            json={"model": OLLAMA_MODEL, "prompt": full_prompt, "stream": False},
        )
        result = response.json()
        text = result.get("response", "").strip()
        if text:
            return text
    return ""


async def get_workout_tip(exercise: str, phase: str, language: str = "en", user_profile: dict = None) -> str:
    lang = language if language in ("en", "es", "fr", "de", "hi", "pt") else "en"
    phase_key = phase if phase in PHASE_TEMPLATES else "exercise"

    fallback = PHASE_TEMPLATES[phase_key].get(lang, PHASE_TEMPLATES[phase_key]["en"]).format(exercise=exercise)

    profile_ctx = ""
    if user_profile:
        parts = []
        if user_profile.get("name") and user_profile["name"] != "User":
            parts.append(f"Name: {user_profile['name']}")
        if user_profile.get("age"):
            parts.append(f"Age: {user_profile['age']}")
        if user_profile.get("weight"):
            parts.append(f"Weight: {user_profile['weight']}")
        if parts:
            profile_ctx = f" User profile: {', '.join(parts)}."

    lang_instruction = {
        "en": "English",
        "es": "Spanish",
        "fr": "French",
        "de": "German",
        "hi": "Hindi",
        "pt": "Portuguese",
    }.get(lang, "English")

    phase_prompts = {
        "start": f"The user is starting their workout with {exercise}.{profile_ctx} Give a short motivational coaching cue to start (1-2 sentences). Language: {lang_instruction}.",
        "exercise": f"The user just started the exercise: {exercise}.{profile_ctx} Give a brief form tip or motivation (1-2 sentences). Language: {lang_instruction}.",
        "rest": f"The user completed {exercise} and is now resting.{profile_ctx} Give a brief encouragement and hint about the next effort (1-2 sentences). Language: {lang_instruction}.",
        "complete": f"The user just completed their full workout session!{profile_ctx} Give a short celebration and recovery tip (1-2 sentences). Language: {lang_instruction}.",
    }
    prompt_text = phase_prompts.get(phase_key, phase_prompts["exercise"])

    full_prompt = f"{WORKOUT_SYSTEM_PROMPT}\n\nCoach: {prompt_text}\n\nResponse:"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                f"{OLLAMA_BASE}/api/generate",
                json={"model": OLLAMA_MODEL, "prompt": full_prompt, "stream": False},
            )
            result = response.json()
            text = result.get("response", "").strip()
            if text:
                return text
    except Exception:
        pass

    return fallback
