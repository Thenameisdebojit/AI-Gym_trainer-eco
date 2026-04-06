---
title: Ollama LLM + ElevenLabs voice agent (full AI end-to-end)
---
# Ollama LLM + ElevenLabs Voice Agent (Full AI End-to-End)

  ## What & Why
  Replace the keyword-matching stub chatbot with a real local LLM powered by Ollama (llama3/mistral running at http://localhost:11434), add ElevenLabs high-quality TTS, and wire up full voice interaction in two places:
  1. A microphone icon in the chatbot input area (both FloatingChatbot and AICoach) so users can speak their question and hear the AI reply out loud.
  2. A live Voice Coach that speaks motivational tips and form guidance at key moments during a workout session when the Voice Coach toggle in Settings is ON.

  ## Done looks like
  - Chatbot replies come from the real Ollama LLM (not keyword stubs); if Ollama is unreachable, the app falls back gracefully to the existing keyword responses with no crash
  - Context-aware prompts: the LLM is given the user's profile (age, weight, goal), recent workout history, and current exercise context so its answers are personalized
  - A microphone button (🎤) appears to the right of the send button in both the floating chatbot popup and the AI Coach screen
  - Clicking the mic button activates the browser's speech recognition; the transcript populates the chat input and is sent automatically
  - The AI's text reply is spoken aloud using ElevenLabs TTS (backend route → ElevenLabs API → audio stream) with a browser SpeechSynthesis fallback when no ElevenLabs key is configured
  - The Voice Coach toggle in Settings is wired to global app state (persisted in localStorage) — not just local UI state
  - When Voice Coach is ON and a workout session is active in Training, the AI automatically speaks:
    - A motivational opening tip when the workout starts
    - A form/technique cue on each exercise transition
    - An encouragement message during rest periods
    - A celebration summary when the workout completes
  - All AI responses respect the user's selected language (EN/ES/FR/DE/HI/PT) via the existing language param

  ## Out of scope
  - Pose detection / camera-based rep counting (separate future task)
  - Streaming token-by-token LLM output (batch response is fine for v1)
  - ElevenLabs voice cloning or custom voice training
  - Mobile (Expo) app voice integration (web-only for this task)

  ## Architecture notes
  - Ollama: install via package management; add an "Ollama" workflow running `ollama serve`; pull model `llama3` on first run. Backend tries Ollama, catches connection errors and falls back to keyword service.
  - ElevenLabs: new backend endpoint `POST /chat/tts` accepts `{text, language}` and returns an audio/mpeg stream. Frontend proxies via `/api/tts`. If `ELEVENLABS_API_KEY` secret is absent, skip ElevenLabs and use browser SpeechSynthesis.
  - STT: browser `SpeechRecognition` API — no API key, works in Chrome/Edge. Gracefully disabled if browser doesn't support it.
  - Voice Coach: add `voiceCoach` and `setVoiceCoach` to AppSettingsContext (localStorage key `fitai_voiceCoach`); Settings.js wires its local `voice` state to this context value.
  - Workout tip endpoint: `POST /chat/workout-tip` accepts `{exercise, phase, language, userProfile}` and returns a short 1-2 sentence coaching tip from Ollama (or fallback).

  ## Tasks

  1. **Ollama service setup** — Install Ollama, add an Ollama workflow (`ollama serve`), and configure the backend to try pulling llama3 on startup. Document fallback behavior if Ollama is not available.

  2. **Context-aware Ollama chat service** — Replace `chat_service.py` keyword matching with an async Ollama HTTP call using a rich fitness-coach system prompt. Include user profile context (age, weight, goal from request body). Fall back to keyword matching on connection error. Add a new `POST /chat/workout-tip` endpoint for phase-based workout coaching.

  3. **ElevenLabs TTS backend route** — Add `POST /chat/tts` to the chatbot router. Reads `ELEVENLABS_API_KEY` from env; if present, calls ElevenLabs API and proxies the audio stream back. If key is absent, returns a 503 so the frontend falls back to browser TTS.

  4. **Frontend API routes** — Add Next.js proxy routes: `/api/tts` → backend `/chat/tts`, and `/api/chat/workout-tip` → backend `/chat/workout-tip`. Update existing `/api/chat` to forward user profile fields from request body.

  5. **Voice microphone in chatbot UI** — Add a 🎤 mic button to the right of the send button in both FloatingChatbot (page.js) and AICoach.js. Clicking activates `SpeechRecognition`; visual states: idle / recording (pulsing red) / processing. After recognition, the transcript fills the input and auto-sends. On receiving the AI reply, call `/api/tts` and play the returned audio (or browser SpeechSynthesis if TTS unavailable).

  6. **Voice Coach global state + Settings wiring** — Add `voiceCoach` / `setVoiceCoach` to AppSettingsContext with localStorage persistence. Update Settings.js to read/write this context value instead of local state. Add translation keys for any new voice-coach-related UI strings across all 6 languages.

  7. **Workout voice coaching hooks in Training.js** — At four moments in the workout session flow (start, exercise transition, rest, complete), if `voiceCoach` is true: call `/api/chat/workout-tip` with the current exercise name, phase, and user profile, then speak the response via TTS. Show a subtle "AI Coach speaking…" indicator while audio plays.

  ## Relevant files
  - `Backend/services/chat_service.py`
  - `Backend/routes/chatbot.py`
  - `Backend/main.py`
  - `Backend/requirements.txt`
  - `frontend/app/api/chat/route.js`
  - `frontend/app/page.js:24-167`
  - `frontend/screens/AICoach.js`
  - `frontend/screens/Settings.js:78-233`
  - `frontend/screens/Training.js`
  - `frontend/context/AppSettingsContext.js`