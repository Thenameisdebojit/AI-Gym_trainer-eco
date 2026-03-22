# AI Fitness Assistant

An AI-powered fitness tracking and coaching web application with workout analytics, diet recommendations, behavioral coaching, and a fitness chatbot.

## Architecture

This is a full-stack application with two main components:

### Backend (`/Backend`)
- **Framework:** FastAPI (Python)
- **Database:** SQLite via SQLAlchemy ORM (`fitness.db`)
- **Port:** 8000 (localhost)
- **Entry point:** `Backend/main.py`

**API Routes:**
- `GET /` — Health check
- `POST /workout/save` — Save workout session (exercise, reps, score)
- `GET /workout/stats` — Get total reps and average score analytics
- `POST /diet/` — Generate diet plan based on weight, height, and goal
- `POST /chat/` — Fitness chatbot reply
- `GET /behavior/` — Predict workout consistency/skip risk

### Frontend (`/frontend`)
- **Framework:** Next.js 14 (React)
- **Port:** 5000 (0.0.0.0 for Replit proxy compatibility)
- **Entry point:** `frontend/app/page.js`

**Pages:**
- `/` — Main dashboard with stats cards, rep progress chart, diet generator, chatbot, and behavior analysis

## Development Workflows

- **Backend API:** `cd Backend && python -m uvicorn main:app --host localhost --port 8000 --reload`
- **Start application (Frontend):** `cd frontend && npm run dev` (port 5000)

## Key Configuration

- `frontend/next.config.js` — Sets `allowedDevOrigins: ["*"]` for Replit proxy compatibility
- `Backend/main.py` — CORS middleware allows all origins for frontend-backend communication
- `Backend/config/database.py` — SQLite database at `Backend/fitness.db`

## Dependencies

**Backend:** fastapi, uvicorn, numpy, pydantic, sqlalchemy, python-multipart

**Frontend:** next, react, react-dom, axios, react-chartjs-2, chart.js
