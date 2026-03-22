# FitAI - AI Fitness Assistant

A complete AI-powered fitness assistant with a **Next.js web dashboard**, **React Native (Expo) mobile app**, and **FastAPI backend**. Features AI pose detection, exercise tracking across all categories (Freehand, Gym, Calisthenics), diet recommendations, behavioral coaching, and a fitness chatbot.

## Architecture

### Backend (`/Backend`) — FastAPI
- **Port:** 8000 (localhost)
- **Database:** SQLite via SQLAlchemy (`Backend/fitness.db`)
- **Entry point:** `Backend/main.py`

**API Endpoints:**
- `GET /` — Health check
- `POST /workout/save` — Save workout (exercise, reps, score, calories)
- `GET /workout/stats` — Analytics (total reps, avg score, calories burned, total workouts)
- `GET /workout/history` — Recent workout history
- `POST /diet/` — Generate diet plan (weight, height, goal)
- `POST /chat/` — Fitness chatbot
- `GET /behavior/` — Workout consistency prediction
- `GET /recommendations/` — Personalized exercise recommendations
- `POST /pose-detect/` — AI pose detection (returns keypoints, rep count, feedback)

### Frontend (`/frontend`) — Next.js 14
- **Port:** 5000 (0.0.0.0)
- **Entry point:** `frontend/app/page.js`
- Full dashboard with stats, chart, diet generator, chatbot, behavior analysis

### Mobile App (`/mobile`) — Expo (React Native)
- **Port:** 8080 (Expo Metro bundler)
- **Entry point:** `mobile/app/_layout.tsx`
- **Scan QR code** in the Mobile App workflow logs with Expo Go to test on device

**Mobile Screens:**
- **Home** — Greeting, stats cards, hero banner, quick start exercises
- **Explore** — Search exercises, browse categories, filter by muscle
- **Workout** — AI trainer launcher, exercise grid, category browser
- **Stats** — Weekly bar chart, streak, lifetime stats
- **Profile** — User profile, fitness settings, preferences
- **Auth** — Sign in / Sign up / Guest mode
- **Exercise Category** — All exercises in a category with difficulty filter
- **Exercise Detail** — Full exercise info, muscles, step-by-step instructions
- **Live AI Trainer** — Camera-based rep counter with real-time AI feedback

**Mobile Tech Stack:**
- Expo Router (file-based routing)
- React Query for API state
- React Native Reanimated for animations
- Dark theme with neon accents (#00FF88 green, #FF6B35 orange, #A855F7 purple)

## Exercise Database
All exercises defined in `mobile/constants/exercises.ts`:
- **Freehand:** Push-ups (4 variants), Squats, Lunges, Jump Squat, Crunch, Leg Raise
- **Gym:** Bench Press, Chest Fly, Lat Pulldown, Seated Row, Leg Press, Shoulder Press, Bicep Curl
- **Calisthenics:** Pull-ups, Dips, L-Sit, Front Lever, Back Lever, Planche

## Development Workflows
- **Backend API:** `cd Backend && python -m uvicorn main:app --host localhost --port 8000 --reload`
- **Start application (Frontend):** `cd frontend && npm run dev` → port 5000
- **Mobile App:** `cd mobile && EXPO_NO_TELEMETRY=1 npx expo start --port 8080 --web` → port 8080

## Key Configuration
- `frontend/next.config.js` — `allowedDevOrigins: [...]` for Replit proxy
- `Backend/main.py` — CORS middleware (all origins allowed)
- `mobile/.env` — `EXPO_PUBLIC_API_URL=http://localhost:8000`
- `mobile/constants/theme.ts` — Color palette and typography
- `mobile/lib/api.ts` — API client (platform-aware base URL, uses 10.0.2.2 for Android emulator)

## AI Integration
- **MediaPipe Pose** — On-device detection (on mobile via Expo Camera)
- **YOLOv8** — Server-side detection via `/pose-detect` endpoint (returns keypoints + feedback)
- Live workout screen simulates rep counting with AI feedback while camera permission system is ready for full MediaPipe integration

## Dependencies
**Backend:** fastapi, uvicorn, numpy, pydantic, sqlalchemy, python-multipart

**Frontend:** next, react, react-dom, axios, react-chartjs-2, chart.js

**Mobile:** expo ~53, expo-router, react-native, @tanstack/react-query, react-native-reanimated, expo-camera, @expo-google-fonts/inter, async-storage
