# FitAI — Universal AI Fitness Trainer

A production-grade AI-powered fitness ecosystem with a **Next.js web dashboard** (fully reconstructed with premium UI/UX), **React Native (Expo) mobile app**, and **FastAPI backend**. Features 7 exercise domains, a Smart Workout Generator, streak tracking, AI pose detection, exercise tracking, diet recommendations, behavioral coaching, and a fitness chatbot.

## Frontend Architecture (Reconstructed)

### Component System (`/frontend/components/`)
- **`cards/WorkoutCard.js`** — Reusable workout card (compact + full variants, gradient domain icons)
- **`cards/StatCard.js`** — Stats card with 8 color variants (blue, green, orange, purple, light variants)
- **`cards/BannerCard.js`** — Hero banner with gradient, badge, icon, CTA
- **`ui/Button.js`** — Full-featured button (8 variants, 5 sizes, loading state, icon support)
- **`ui/ProgressBar.js`** — Animated progress bar with label and percentage
- **`ui/Tabs.js`** — Pill and underline tab variants
- **`charts/WeightChart.js`** — Canvas-based smooth bezier weight chart

### Screens (`/frontend/screens/`)
- **`Training.js`** — Home: current plan card, stats, body-focus tabs, workout generator, recent + equipment sections
- **`Discover.js`** — Search, hero banner, 7 category grid, 5 horizontal scroll sections
- **`Report.js`** — Stats cards, weekly bar chart, streak & personal best, weight tracking + chart, BMI calculator
- **`AICoach.js`** — Chat interface with quick prompts, AI chatbot, consistency analyzer
- **`Settings.js`** — Profile card, premium banner, toggle switches, language, units, backup

### Design System (`/frontend/app/globals.css`)
- Primary: `#2563EB` (blue), Background: `#F8FAFC`, Cards: `#FFFFFF`, Text: `#0F172A`
- CSS variables for all colors, shadows, radii, and spacing
- Smooth `fadeIn`, `slideUp`, `scaleIn`, `shimmer` animations
- Skeleton loading states via `.skeleton` class

### API Routes (`/frontend/app/api/`)
- `GET /api/exercises?domain=` — Proxy to backend exercise list
- `POST /api/workout/generate` — Proxy to AI workout generator
- `POST /api/chat` — Proxy to AI chatbot
- `GET /api/behavior?days_missed=&consistency=` — Consistency risk analysis
- `GET /api/recommendations` — Personalized exercise recommendations
- `GET /api/workout/stats` — Workout statistics
- `POST /api/diet` — AI diet plan generator

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
- `POST /diet/` — **Full AI Diet Planner** (age, gender, height, weight, goal, activity, diet_type, budget, allergies) → BMR/TDEE/macros/5-meal plan/tips/supplements
- `GET /diet/bmi` — BMI check (weight, height)
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

## Full App Enhancement (Phase 2 — Production System)

### Problems Solved
- ❌ Fake static data everywhere → ✅ All stats pulled from real backend SQLite sessions table
- ❌ Navigation exists visually only → ✅ Full drill-down: Filter → List → Live Session
- ❌ No workout session engine → ✅ Countdown + per-exercise timer + auto-advance + save
- ❌ Search is UI only → ✅ Working search filtering all 24 workouts + AI exercises
- ❌ No data architecture → ✅ `sessions` table with full session history, calories, duration

### New Backend Files
- `Backend/models/session.py` — SQLAlchemy `Session` model (title, exercises_completed, duration, calories, body_part, level, date)
- `Backend/routes/sessions.py` — `/sessions/save` (POST), `/sessions/history` (GET), `/sessions/stats` (GET)
- `frontend/app/api/sessions/route.js` — Next.js proxy for sessions endpoints

### Frontend Complete Rewrites
- **`frontend/screens/Training.js`** — Full production rewrite:
  - Real stats banner from backend (sessions count, calories, minutes)
  - Workout filter: body part (6 options) × mode (home/gym) × level (beginner/intermediate/advanced)
  - Exercise preview cards show before you start
  - "View Exercises" opens drill-down list with all exercises for selection
  - "Start Workout" → 5-second countdown ring → per-exercise 30-second timer → pulsing animation → rest timer → done summary
  - Session auto-saved to backend on completion (POST /api/sessions)
  - Stats cards refresh from real saved sessions
- **`frontend/screens/Discover.js`** — Full production rewrite:
  - 24 real categorized workouts, each with a full exercise list (reps, duration, calories, type)
  - Live search filters by title, description, category, and level
  - Category filter chips (All, Gym, Cardio, Yoga, Calisthenics, Martial Arts, Rehab, Bodyweight)
  - Clicking a card opens a full DETAIL PAGE (not a modal): hero image, stats grid, complete exercise list
  - "Start Workout" button on detail page triggers 5-second countdown → live session engine → save
  - Three-view state machine: browse → detail → session
  - Session saved to backend on completion; statistics update in real time
  - Empty state with clear guidance when no results found
- **`frontend/screens/Report.js`** — Full production rewrite:
  - All stats (sessions, calories, minutes) pulled from `/api/sessions?type=stats`
  - Recent Sessions list shows real saved sessions from backend (not hardcoded)
  - Weekly activity bar chart built from real session dates and calories
  - Empty state when no sessions have been completed yet
  - BMI calculator and weight tracking preserved and improved

### Mobile Enhancements
- `mobile/app/workout/session.tsx` — Added "countdown" phase before workout intro:
  - 5-second animated countdown screen with pulsing orange ring
  - "Skip Countdown" button for fast start
  - Auto-advances to workout intro after countdown completes

## Workout Session Flow (Full Interactive Engine)
Added complete end-to-end workout execution system:

### New Files
- **`mobile/store/useWorkoutStore.ts`** — Zustand global state store for workout plans, active sessions, completed sets, and persistent history
- **`mobile/app/workout/session.tsx`** — Full exercise flow screen with:
  - Intro phase: Shows full workout plan before starting
  - Exercise phase: Rep counter (auto + manual), play/pause, set indicator, AI feedback messages
  - Rest phase: 45-second countdown timer with skip option
  - Done phase: Trophy screen with total reps, calories, sets, and time
  - Persists data to AsyncStorage via Zustand
- **`mobile/app/workout/history.tsx`** — Full workout history screen with session summary, totals, and clear option

### Updated Files
- **`mobile/app/(tabs)/workout.tsx`** — Added "Start Full Workout" button after generating a plan; added "History" header link; wired to Zustand store
- **`mobile/app/(tabs)/stats.tsx`** — Connected real streak from AsyncStorage; shows workout history count from store; added "View History" card link
- **`mobile/app/_layout.tsx`** — Registered new `workout/session` and `workout/history` routes

### State Management Pattern
- `setCurrentPlan(plan)` → saves plan to Zustand
- `router.push("/workout/session")` → navigates to session
- Session screen reads `currentPlan` from store, starts workout, tracks sets
- `finishSession(duration)` → saves to AsyncStorage and resets active session

## Dependencies
**Backend:** fastapi, uvicorn, numpy, pydantic, sqlalchemy, python-multipart

**Frontend:** next, react, react-dom, axios, react-chartjs-2, chart.js

**Mobile:** expo ~53, expo-router, react-native, @tanstack/react-query, react-native-reanimated, expo-camera, @expo-google-fonts/inter, async-storage, zustand
