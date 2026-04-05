---
title: Mistral-nemo LLM + Account/Profile page
---
# Mistral-nemo LLM + Account Profile Page

## What & Why

Two complementary improvements to complete the AI fitness trainer experience:

**1. Real LLM brain for the chatbot (mistral-nemo via Ollama)**
The chatbot currently falls back to scripted keyword replies even when Ollama is installed. Users who have Ollama + `mistral-nemo` installed see no benefit. This task wires the real model in — with multi-turn conversation memory, full user-profile + workout-history context, and transparent auto-detection. If Ollama is running with mistral-nemo, every response is a genuine LLM reply. If not, the keyword fallback remains silent and invisible.

**2. Dedicated Account/Profile page + Settings cleanup**
The Settings screen contains a large blue profile-editing card that clutters the preferences view. The user wants that card removed from Settings and replaced with a dedicated Account page accessible by tapping the avatar in the top-right corner. The new page lets users upload a profile photo, pick from a set of preset avatars, and edit name/age/weight/height/goal/level — all saved to localStorage.

## Done looks like

- Chatbot (both FloatingChatbot and AI Coach tab) responds with genuine multi-sentence, context-aware LLM answers when Ollama + mistral-nemo is running — not scripted one-liners.
- When the LLM is unavailable the app silently falls back; no error is shown to the user.
- Conversation history (all previous messages in the session) is sent with each request so the LLM maintains context across turns.
- The Ollama LLM workflow pulls `mistral-nemo` before serving.
- Settings page no longer contains the big blue profile card; it shows a compact "Account & Profile" row with a chevron.
- Clicking the avatar initials button (top-right header) OR the "Account & Profile" row in Settings navigates to a new Account screen.
- Account screen shows: circular avatar (upload photo or pick from 8+ preset emoji avatars), editable Name / Age / Weight / Height / Goal / Fitness Level fields, and a Save button.
- Saved profile is persisted to localStorage (`fitai_user`) and immediately reflected in the header initials and avatar.

## Out of scope

- Cloud profile sync or backend profile storage.
- ElevenLabs / TTS changes.
- Mobile (Expo) app changes.
- Streaming Ollama responses (single-shot response is fine).

## Tasks

1. **Switch model to mistral-nemo** — Update `OLLAMA_MODEL` from `llama3` to `mistral-nemo` in the backend chat service and ensure-model-available function. Update the Ollama LLM workflow command to pull `mistral-nemo`.

2. **Multi-turn Ollama chat** — Rewrite `ollama_chat()` to use the Ollama `/api/chat` endpoint (which accepts a `messages` array) instead of `/api/generate` with a single combined prompt string. This gives the LLM proper conversation memory. Accept a `conversationHistory` list (of `{role, content}` dicts) in `ChatRequest`; prepend the system prompt as the first message, then append history + the new user message.

3. **Frontend chat sends conversation history** — Update both `FloatingChatbot` and `AICoach` to forward the current `messages` array (as `conversationHistory`) with every chat API call. Update the `/api/chat` Next.js route to pass `conversationHistory` through to the backend.

4. **Account screen** — Create a new `Account.js` screen with: a circular avatar (128px) showing either the uploaded image (stored as base64 in localStorage `fitai_avatar`) or a chosen preset emoji avatar; a file-input button to upload a photo; a grid of 8 preset emoji avatars to pick; editable fields for Name, Age, Weight (kg), Height (cm), Fitness Goal (dropdown: general / muscle_gain / fat_loss / flexibility / mma), and Fitness Level (dropdown: beginner / intermediate / advanced); a Save button that writes all values to `fitai_user` in localStorage and shows a success toast; a back-arrow header.

5. **Settings cleanup + navigation wiring** — Remove the large profile card from `Settings.js`. Add a compact "Account & Profile" setting row (with avatar thumbnail, user name, "Edit Profile →" chevron) that triggers navigation to the Account screen. In `page.js`: add `Account` to `SCREEN_MAP`; change the header avatar/initials button from "sign out" to "navigate to Account"; keep logout accessible via the Settings logout row (which already exists). Add a `navigateTo('account')` call path through `AppSettingsContext` or a lifted `setActive` prop.

## Relevant files

`Backend/services/chat_service.py`
`Backend/routes/chatbot.py`
`frontend/app/api/chat/route.js`
`frontend/screens/AICoach.js:48-86`
`frontend/app/page.js:27-227,229-376`
`frontend/screens/Settings.js:114-170`
`frontend/context/AppSettingsContext.js`