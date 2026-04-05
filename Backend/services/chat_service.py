import logging
import httpx

logger = logging.getLogger(__name__)

OLLAMA_BASE = "http://localhost:11434"
OLLAMA_MODEL = "mistral-nemo"

SYSTEM_PROMPT = (
    "You are an expert AI fitness coach named FitAI. You have deep knowledge in:\n"
    "- Strength training, hypertrophy, powerlifting, and functional fitness\n"
    "- Cardio, HIIT, endurance sports, and athletic conditioning\n"
    "- Nutrition, meal planning, macros, and supplementation for athletes\n"
    "- Sports performance, injury prevention, and recovery protocols\n"
    "- Martial arts conditioning (boxing, MMA, BJJ, wrestling, Muay Thai)\n"
    "- Gym programming, periodization, and progressive overload\n"
    "- Flexibility, mobility, and yoga for athletes\n\n"
    "RULES:\n"
    "- Always respond in the same language the user writes in.\n"
    "- Be conversational, warm, and genuinely helpful — like a real personal trainer.\n"
    "- Give detailed, practical, personalized advice. 2–5 sentences unless the user asks for a plan.\n"
    "- Remember and reference earlier parts of the conversation when relevant.\n"
    "- Personalize advice using any user profile data provided.\n"
    "- Never say you are an AI language model — you are a fitness coach named FitAI.\n"
    "- If asked about mental health or clinical conditions, encourage seeing a professional.\n"
    "- Do not repeat the same advice verbatim — vary your language and approach."
)

WORKOUT_SYSTEM_PROMPT = (
    "You are a live workout voice coach named FitAI. Give brief, energetic coaching cues "
    "during a live workout session. 1-2 short sentences only. Be encouraging, specific, and "
    "motivating. No markdown formatting. No lists."
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
        "en": "Great set! Rest up — the next exercise is coming.",
        "es": "¡Gran serie! Descansa — el próximo ejercicio se acerca.",
        "fr": "Excellent ! Repose-toi — le prochain exercice arrive.",
        "de": "Tolle Serie! Erhole dich — die nächste Übung kommt.",
        "hi": "बढ़िया सेट! आराम करो — अगला व्यायाम आने वाला है।",
        "pt": "Ótima série! Descanse — o próximo exercício está chegando.",
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
        "en": "Combine strength training with a moderate caloric deficit. HIIT 2–3x per week accelerates fat loss significantly 🔥",
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
        "en": "You've come this far — don't stop now. Every small step counts 💪",
        "es": "Has llegado hasta aquí. ¡No te detengas ahora! 💪",
        "fr": "Tu es allé si loin. Ne t'arrête pas maintenant 💪",
        "de": "Du hast es bis hierher geschafft. Hör jetzt nicht auf 💪",
        "hi": "आप इतनी दूर आए हैं। अब मत रुकिए 💪",
        "pt": "Você chegou até aqui. Não pare agora 💪",
    },
    "motivat": {
        "en": "Discipline beats motivation every time. Show up, do the work, and the results will follow 🏆",
        "es": "La disciplina supera a la motivación cada vez. ¡Preséntate, haz el trabajo y los resultados seguirán!",
        "fr": "La discipline bat la motivation à chaque fois. Montre-toi, fais le travail, les résultats suivront.",
        "de": "Disziplin schlägt Motivation jedes Mal. Erscheine, tue die Arbeit und die Ergebnisse werden folgen.",
        "hi": "अनुशासन हर बार प्रेरणा को मात देता है। आओ, काम करो, परिणाम आएंगे।",
        "pt": "Disciplina vence a motivação sempre. Apareça, faça o trabalho e os resultados virão.",
    },
}

DEFAULT_REPLY = {
    "en": "Great question! Stay consistent and trust the process — every workout brings you closer to your goal 💪",
    "es": "¡Buena pregunta! Sé constante y confía en el proceso — cada entrenamiento te acerca más a tu objetivo 💪",
    "fr": "Bonne question ! Reste régulier et fais confiance au processus — chaque séance te rapproche de ton objectif 💪",
    "de": "Gute Frage! Bleib konsequent und vertraue dem Prozess — jedes Training bringt dich deinem Ziel näher 💪",
    "hi": "अच्छा सवाल! नियमित रहें और प्रक्रिया पर भरोसा रखें — हर वर्कआउट आपको आपके लक्ष्य के करीब लाता है 💪",
    "pt": "Ótima pergunta! Seja consistente e confie no processo — cada treino te aproxima do seu objetivo 💪",
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

LANG_NAMES = {
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "hi": "Hindi",
    "pt": "Portuguese",
}

LANG_INSTRUCTIONS = {
    "en": "Respond in English.",
    "es": "Responde en español.",
    "fr": "Réponds en français.",
    "de": "Antworte auf Deutsch.",
    "hi": "हिंदी में जवाब दें।",
    "pt": "Responda em português.",
}


def _build_profile_context(user_profile: dict) -> str:
    if not user_profile:
        return ""
    parts = []
    if user_profile.get("name") and user_profile["name"] not in ("User", ""):
        parts.append(f"Name: {user_profile['name']}")
    if user_profile.get("first_name"):
        name = f"{user_profile.get('first_name', '')} {user_profile.get('last_name', '')}".strip()
        if name and name not in parts:
            parts.append(f"Name: {name}")
    if user_profile.get("age"):
        parts.append(f"Age: {user_profile['age']}")
    if user_profile.get("weight"):
        parts.append(f"Weight: {user_profile['weight']} kg")
    if user_profile.get("height"):
        parts.append(f"Height: {user_profile['height']} cm")
    if user_profile.get("goal"):
        goal_labels = {
            "muscle_gain": "muscle gain",
            "fat_loss": "fat loss",
            "flexibility": "flexibility & mobility",
            "mma": "martial arts / MMA",
            "general": "general fitness",
        }
        goal = goal_labels.get(user_profile["goal"], user_profile["goal"])
        parts.append(f"Fitness goal: {goal}")
    if user_profile.get("level"):
        parts.append(f"Fitness level: {user_profile['level']}")
    return f"\n\nUser profile: {', '.join(parts)}" if parts else ""


def _build_history_context(workout_history: list) -> str:
    if not workout_history:
        return ""
    lines = ["Recent workout history:"]
    for s in workout_history[:5]:
        title = s.get("title", "Unknown workout")
        date = s.get("date", "")
        calories = s.get("calories_burned", s.get("calories", ""))
        duration = s.get("duration", "")
        parts = [title]
        if date:
            parts.append(f"on {date[:10]}")
        if duration:
            parts.append(f"{duration} min")
        if calories:
            parts.append(f"{calories} kcal")
        lines.append(f"  - {', '.join(parts)}")
    return "\n\n" + "\n".join(lines)


def keyword_reply(msg: str, language: str = "en") -> str:
    lang = language if language in LANG_NAMES else "en"
    msg_lower = msg.lower()
    for keyword, topic in KEYWORD_MAP:
        if keyword.lower() in msg_lower:
            translations = REPLIES[topic]
            return translations.get(lang, translations["en"])
    return DEFAULT_REPLY.get(lang, DEFAULT_REPLY["en"])


def reply(msg: str, language: str = "en") -> str:
    return keyword_reply(msg, language)


async def ensure_model_available() -> bool:
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(f"{OLLAMA_BASE}/api/tags")
            if r.status_code != 200:
                return False
            tags = r.json().get("models", [])
            names = [m.get("name", "") for m in tags]
            if any(OLLAMA_MODEL in n for n in names):
                logger.info("Ollama model '%s' is already available.", OLLAMA_MODEL)
                return True
            logger.info("Pulling '%s' model from Ollama — this may take a few minutes…", OLLAMA_MODEL)
            pull_resp = await client.post(
                f"{OLLAMA_BASE}/api/pull",
                json={"name": OLLAMA_MODEL, "stream": False},
                timeout=600.0,
            )
            if pull_resp.status_code == 200:
                logger.info("Successfully pulled '%s'.", OLLAMA_MODEL)
                return True
            logger.warning("Failed to pull '%s': status %s", OLLAMA_MODEL, pull_resp.status_code)
            return False
    except Exception as exc:
        logger.debug("Ollama not available: %s", exc)
        return False


def _build_system_message(
    language: str,
    user_profile: dict = None,
    workout_history: list = None,
    current_exercise: str = None,
) -> str:
    lang = language if language in LANG_NAMES else "en"
    profile_ctx = _build_profile_context(user_profile or {})
    history_ctx = _build_history_context(workout_history or [])
    exercise_ctx = (
        f"\n\nCurrent workout context: The user is currently doing {current_exercise}."
        if current_exercise else ""
    )
    lang_instruction = LANG_INSTRUCTIONS.get(lang, LANG_INSTRUCTIONS["en"])
    return (
        f"{SYSTEM_PROMPT}{profile_ctx}{history_ctx}{exercise_ctx}\n\n"
        f"Language instruction: {lang_instruction}"
    )


async def ollama_chat(
    message: str,
    language: str = "en",
    user_profile: dict = None,
    workout_history: list = None,
    current_exercise: str = None,
    conversation_history: list = None,
) -> str:
    system_content = _build_system_message(
        language, user_profile, workout_history, current_exercise
    )

    messages = [{"role": "system", "content": system_content}]

    if conversation_history:
        for turn in conversation_history:
            role = turn.get("role", "user")
            content = turn.get("content", "")
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": message})

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{OLLAMA_BASE}/api/chat",
                json={
                    "model": OLLAMA_MODEL,
                    "messages": messages,
                    "stream": False,
                    "options": {"temperature": 0.7, "top_p": 0.9},
                },
            )
            if response.status_code == 200:
                result = response.json()
                text = result.get("message", {}).get("content", "").strip()
                if text:
                    return text
                logger.debug("Ollama returned empty content: %s", result)
            else:
                logger.debug("Ollama /api/chat returned status %s", response.status_code)
    except Exception as exc:
        logger.debug("Ollama chat failed: %s", exc)
    return ""


async def get_workout_tip(
    exercise: str,
    phase: str,
    language: str = "en",
    user_profile: dict = None,
    workout_history: list = None,
) -> str:
    lang = language if language in LANG_NAMES else "en"
    phase_key = phase if phase in PHASE_TEMPLATES else "exercise"

    fallback = PHASE_TEMPLATES[phase_key].get(lang, PHASE_TEMPLATES[phase_key]["en"]).format(exercise=exercise)

    profile_ctx = _build_profile_context(user_profile or {}).strip()
    history_summary = ""
    if workout_history:
        sessions_done = len(workout_history)
        history_summary = f" The user has completed {sessions_done} previous session(s)."

    lang_name = LANG_NAMES.get(lang, "English")
    extra = (f" {profile_ctx.replace(chr(10), ' ').strip()}" if profile_ctx else "") + history_summary

    phase_prompts = {
        "start": (
            f"The user is starting their workout with {exercise}.{extra} "
            f"Give a short motivational coaching cue to start (1–2 sentences). Language: {lang_name}."
        ),
        "exercise": (
            f"The user just started the exercise: {exercise}.{extra} "
            f"Give a brief form tip or motivation (1–2 sentences). Language: {lang_name}."
        ),
        "rest": (
            f"The user completed {exercise} and is now resting.{extra} "
            f"Give brief encouragement and a hint about the next effort (1–2 sentences). Language: {lang_name}."
        ),
        "complete": (
            f"The user just completed their full workout session!{extra} "
            f"Give a short celebration and recovery tip (1–2 sentences). Language: {lang_name}."
        ),
    }
    prompt_text = phase_prompts.get(phase_key, phase_prompts["exercise"])

    system_msg = f"{WORKOUT_SYSTEM_PROMPT}\n\nLanguage: {lang_name}."
    user_msg = prompt_text

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                f"{OLLAMA_BASE}/api/chat",
                json={
                    "model": OLLAMA_MODEL,
                    "messages": [
                        {"role": "system", "content": system_msg},
                        {"role": "user", "content": user_msg},
                    ],
                    "stream": False,
                    "options": {"temperature": 0.8},
                },
            )
            if response.status_code == 200:
                result = response.json()
                text = result.get("message", {}).get("content", "").strip()
                if text:
                    return text
    except Exception as exc:
        logger.debug("Ollama workout-tip failed: %s", exc)

    return fallback
