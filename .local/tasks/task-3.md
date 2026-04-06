---
title: Remove Live AI badge + language-aware chatbot
---
# Remove Live AI Badge + Language-Aware Chatbot

  ## What & Why
  Two related polish tasks:
  1. Remove the "Live AI" glowing pill badge from the top-right app header — cosmetic noise the user wants removed.
  2. When the user switches language (EN/ES/FR/DE/HI/PT) the floating chatbot and the AI Coach screen must greet, prompt, and respond in that language. The language is passed with every API call so backend replies come back in the selected language too.

  ## Done looks like
  - No "Live AI" badge visible anywhere in the app header
  - Changing language in Settings immediately updates the floating chatbot greeting, quick-prompt chips, input placeholder, and error fallback text
  - The AI Coach screen behaves the same way
  - Messages sent to /api/chat include a language field; the backend returns responses in that language
  - All 6 languages (EN/ES/FR/DE/HI/PT) work correctly

  ## Out of scope
  - Replacing the stub chat service with a real AI model
  - Translating user-typed free-text before sending

  ## Tasks
  1. **Add chatbot translation keys** — Add chatGreeting, chatPlaceholder, chatOnline, chatErrorMsg, and chatPrompt1–chatPrompt6 to all 6 language objects in AppSettingsContext.js.

  2. **Remove Live AI badge and update FloatingChatbot** — Delete the "Live AI" pill div from the header. Add useAppSettings() to FloatingChatbot; replace all hardcoded English strings with translated keys; send language in the fetch body; add a useEffect on language that resets messages to the new-language greeting when language changes.

  3. **Update AI Coach screen** — Same language treatment for AICoach.js: use translated greeting, quick prompts, placeholder, and error text; send language in the fetch body; reset messages on language change via useEffect.

  4. **Forward language through the API route** — Update frontend/app/api/chat/route.js to read language from the request body and pass it as a query param to the backend endpoint.

  5. **Backend language support** — Update Backend/routes/chatbot.py to accept language: str = "en" and pass it to the service. Update Backend/services/chat_service.py to return language-appropriate stub responses for all 6 languages.

  ## Relevant files
  - frontend/app/page.js:24-163,278-281
  - frontend/app/api/chat/route.js
  - frontend/screens/AICoach.js
  - frontend/context/AppSettingsContext.js
  - Backend/routes/chatbot.py
  - Backend/services/chat_service.py