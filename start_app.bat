@echo off
title FitAI Trainer — Startup
color 0A

echo.
echo  ============================================
echo   FitAI Trainer — One-Click Startup
echo  ============================================
echo.

REM ── 1. Copy example .env files if real ones are missing ────────────────
if not exist "Backend\.env" (
    echo  [INFO] Backend\.env not found — creating from example...
    echo # Copy from .env.production_example and fill in real values > Backend\.env
    echo DATABASE_URL=sqlite:///./fitness.db >> Backend\.env
    echo SMTP_HOST=smtp.gmail.com >> Backend\.env
    echo SMTP_PORT=587 >> Backend\.env
    echo SMTP_USER= >> Backend\.env
    echo SMTP_PASS= >> Backend\.env
    echo SMTP_FROM= >> Backend\.env
    echo ELEVENLABS_API_KEY= >> Backend\.env
    echo OLLAMA_BASE_URL=http://localhost:11434 >> Backend\.env
    echo SECRET_KEY=change_me_in_production >> Backend\.env
    echo  [INFO] Backend\.env created. Fill in secrets before first run.
)

if not exist "frontend\.env.local" (
    echo  [INFO] frontend\.env.local not found — creating from example...
    echo NEXT_PUBLIC_API_URL=http://localhost:8000 > frontend\.env.local
    echo NEXT_PUBLIC_PORT=5000 >> frontend\.env.local
    echo NEXT_PUBLIC_FIREBASE_API_KEY= >> frontend\.env.local
    echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN= >> frontend\.env.local
    echo NEXT_PUBLIC_FIREBASE_PROJECT_ID= >> frontend\.env.local
    echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET= >> frontend\.env.local
    echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID= >> frontend\.env.local
    echo NEXT_PUBLIC_FIREBASE_APP_ID= >> frontend\.env.local
)

if not exist "mobile\.env" (
    echo  [INFO] mobile\.env not found — creating...
    echo EXPO_PUBLIC_API_URL=http://localhost:8000 > mobile\.env
)

REM ── 2. Check Python ────────────────────────────────────────────────────
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Python not found. Install Python 3.10+ from https://python.org
    pause
    exit /b 1
)
echo  [OK] Python found.

REM ── 3. Check Node.js ───────────────────────────────────────────────────
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)
echo  [OK] Node.js found.

REM ── 4. Install Python dependencies (only if needed) ────────────────────
if not exist "Backend\__pycache__" (
    echo  [INFO] Installing Python dependencies...
    pip install -r Backend\requirements.txt --quiet
)

REM ── 5. Install frontend dependencies (only if needed) ──────────────────
if not exist "frontend\node_modules" (
    echo  [INFO] Installing frontend npm packages...
    cd frontend && npm install --silent && cd ..
)

REM ── 6. Install mobile dependencies (only if needed) ────────────────────
if not exist "mobile\node_modules" (
    echo  [INFO] Installing mobile npm packages...
    cd mobile && npm install --silent && cd ..
)

REM ── 7. Start Ollama LLM (if installed) ────────────────────────────────
ollama --version >nul 2>&1
if %errorlevel% equ 0 (
    echo  [OK] Ollama found — starting Ollama server and pulling mistral-nemo...
    start "Ollama LLM" cmd /k "ollama serve & echo [Ollama] Server started"
    timeout /t 3 /nobreak >nul
    start "Ollama Pull" cmd /k "ollama pull mistral-nemo && echo [Ollama] mistral-nemo ready && pause"
) else (
    echo  [WARN] Ollama not installed — AI chatbot will use keyword fallback mode.
    echo         Download Ollama from https://ollama.com to enable full LLM support.
)

REM ── 8. Start Backend API ───────────────────────────────────────────────
echo  [INFO] Starting Backend API on http://localhost:8000 ...
start "FitAI Backend" cmd /k "cd Backend && pip install -r requirements.txt -q && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

REM ── 9. Start Next.js Frontend ──────────────────────────────────────────
echo  [INFO] Starting Frontend on http://localhost:5000 ...
start "FitAI Frontend" cmd /k "cd frontend && npm run dev"

REM ── 10. Start Expo Mobile App ──────────────────────────────────────────
echo  [INFO] Starting Mobile App (Expo) on http://localhost:8080 ...
start "FitAI Mobile" cmd /k "cd mobile && npx expo start --web --port 8080"

REM ── 11. Wait and open browser ──────────────────────────────────────────
echo.
echo  [INFO] Waiting for services to boot (15 seconds)...
timeout /t 15 /nobreak >nul

echo  [INFO] Opening browser...
start http://localhost:5000

echo.
echo  ============================================
echo   All services launched!
echo.
echo   Backend API  →  http://localhost:8000
echo   API Docs     →  http://localhost:8000/docs
echo   Web App      →  http://localhost:5000
echo   Mobile (web) →  http://localhost:8080
echo   Ollama API   →  http://localhost:11434
echo.
echo   Close the terminal windows to stop services.
echo  ============================================
echo.
pause
