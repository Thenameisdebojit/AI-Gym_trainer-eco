# FitAI — Universal AI Fitness Trainer

A complete AI-powered fitness ecosystem with a **Next.js web dashboard**, **React Native (Expo) mobile app**, and **FastAPI backend**. Features 7 exercise domains, a Smart Workout Generator, streak tracking, AI pose detection, exercise tracking, diet recommendations, behavioral coaching, and a fitness chatbot.

## Architecture

### Backend (`/Backend`) — FastAPI
- **Port:** 8000 (localhost)
- **Database:** SQLite via SQLAlchemy (`Backend/fitness.db`)
- **Entry point:** `Backend/main.py`

**API Endpoints:**
- `GET /` — Health check (lists all features)
- `POST /workout/save` — Save workout (exercise, reps, score, calories)
- `GET /workout/stats` — Analytics (total reps, avg score, calories burned, total workouts)
- `GET /workout/history` — Recent workout history
- `POST /workout/generate` — **Smart Workout Generator** (goal, equipment, level, duration)
- `GET /exercises` — All 58+ exercises (optional `?domain=` filter)
- `POST /calories/calculate` — Calorie estimation by MET, weight, duration
- `POST /diet/` — Generate diet plan (weight, height, goal)
- `POST /chat/` — Fitness chatbot
- `GET /behavior/` — Workout consistency prediction
- `GET /recommendations/` — Personalized exercise recommendations
- `POST /pose-detect/` — AI pose detection (returns keypoints, rep count, feedback)

**Services:**
- `Backend/services/workout_generator.py` — Generates personalized workout plans by goal, equipment, and fitness level with domain prioritization

### Frontend (`/frontend`) — Next.js 14
- **Port:** 5000 (0.0.0.0)
- **Entry point:** `frontend/app/page.js`
- Full dashboard with stats, chart, diet generator, chatbot, behavior analysis

### Mobile App (`/mobile`) — Expo (React Native)
- **Port:** 8080 (Expo Metro bundler)
- **Entry point:** `mobile/app/_layout.tsx`
- **Scan QR code** in the Mobile App workflow logs with Expo Go to test on device

**Mobile Screens:**
- **Home** — Greeting, streak badge, stats cards, hero banner, all 7 category chips, quick start exercises, Smart Generator CTA
- **Explore** — Search exercises by name/muscle/category, browse all 7 categories, filter by muscle group, filter by equipment
- **Workout** — AI trainer launcher, Smart Workout Generator (goal × equipment × level), generated plan display, quick start grid, category list
- **Stats** — Weekly bar chart, streak, lifetime stats
- **Profile** — User profile, fitness settings, preferences
- **Auth** — Sign in / Sign up / Guest mode
- **Exercise Category** — All exercises in a domain with subcategory grouping and difficulty filter
- **Exercise Detail** — Full exercise info, muscles, equipment, variations, step-by-step instructions, CTA to live trainer
- **Live AI Trainer** — Camera-based rep counter with real-time AI feedback

**Mobile Tech Stack:**
- Expo Router (file-based routing)
- React Query for API state
- React Native Reanimated for animations
- AsyncStorage for streak persistence
- Dark theme with neon accents (#00FF88 green, #FF6B35 orange, #A855F7 purple)

## Exercise Database (58 exercises across 7 domains)
All exercises defined in `mobile/constants/exercises.ts`:
- **Gym (15):** Bench Press, Incline Bench, Cable Fly, Lat Pulldown, Seated Row, Deadlift, Leg Press, Leg Extension, Leg Curl, Shoulder Press, Lateral Raise, Bicep Curl, Tricep Pushdown, Calf Raise
- **Bodyweight / Freehand (9):** Push-ups (3 variants), Squat, Lunge, Jump Squat, Crunch, Leg Raise, Plank
- **Calisthenics (7):** Pull-up, Dips, Muscle-Up, L-Sit, Front Lever, Planche, Handstand Push-up
- **Martial Arts (7):** Jab-Cross, Hook-Uppercut, Roundhouse Kick, Shadow Boxing, Front Kick, Sprawl Drill, Bob & Weave
- **Yoga (7):** Downward Dog, Warrior I, Warrior II, Tree Pose, Pigeon Pose, Sun Salutation, Boat Pose
- **Cardio (7):** Jumping Jacks, Burpee, High Knees, Mountain Climbers, Box Jump, Speed Skaters, Jump Rope
- **Rehab (7):** Glute Bridge, Bird Dog, Dead Bug, Clamshell, Single Leg Balance, Thoracic Rotation, Hip Flexor Stretch

## Smart Workout Generator
Goal options: muscle_gain, fat_loss, flexibility, mma, general
Equipment levels: none, minimal, full_gym
Fitness levels: beginner, intermediate, advanced
- Frontend fallback generates locally if backend is unreachable
- Backend generates via POST /workout/generate
- Domain prioritization: primary goal domain appears first in results

## APK Build (Android)
Config files: `mobile/eas.json`, `mobile/app.json`
- **Quick test (NOW):** Scan QR code from Mobile App workflow logs with Expo Go app
- **APK build:** Run `mobile/build-apk.sh` (requires free Expo account at expo.dev)
- Package: `com.fitai.assistant`, version `1.0.0`
- Preview profile builds an `.apk` file; Production profile builds `.aab` for store

## Streak System
- Tracked via AsyncStorage in `mobile/app/(tabs)/index.tsx`
- Increments once per day on app open
- Displayed as an animated flame badge on the home screen

## Development Workflows
- **Backend API:** `cd Backend && python -m uvicorn main:app --host localhost --port 8000 --reload`
- **Start application (Frontend):** `cd frontend && npm run dev` → port 5000
- **Mobile App:** `cd mobile && EXPO_NO_TELEMETRY=1 ./node_modules/.bin/expo start --web --port 8080` → port 8080

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
