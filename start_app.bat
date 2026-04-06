@echo off
setlocal EnableDelayedExpansion
title FitAI Trainer — Startup

:: Get the absolute directory of this batch file (trailing backslash removed)
set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

color 0A
echo.
echo  ============================================
echo   FitAI Trainer ^— One-Click Startup
echo  ============================================
echo.

:: ── 1. Distribute root .env to sub-folders ─────────────────────────────
echo  [INFO] Checking environment files...
if exist "%ROOT%\.env" (
    echo  [OK] Root .env found ^— distributing to Backend, frontend, mobile...
    python "%ROOT%\setup_env.py"
    if errorlevel 1 (
        echo  [WARN] setup_env.py had a problem. Check your .env syntax.
    )
) else (
    echo  [INFO] No root .env found. Using existing sub-folder .env files.
    if not exist "%ROOT%\Backend\.env" (
        echo  [WARN] Backend\.env is missing. Copy .env.production_example and fill in values.
        echo         Place it at: %ROOT%\.env
    )
    if not exist "%ROOT%\frontend\.env.local" (
        echo  [WARN] frontend\.env.local is missing.
    )
    if not exist "%ROOT%\mobile\.env" (
        echo EXPO_PUBLIC_API_URL=http://localhost:8000 > "%ROOT%\mobile\.env"
        echo  [INFO] Created minimal mobile\.env
    )
)
echo.

:: ── 2. Check Python ────────────────────────────────────────────────────
python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python not found. Install Python 3.10+ from https://python.org
    pause & exit /b 1
)
for /f "tokens=*" %%v in ('python --version 2^>^&1') do echo  [OK] %%v

:: ── 3. Check Node.js ───────────────────────────────────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js not found. Install from https://nodejs.org
    pause & exit /b 1
)
for /f "tokens=*" %%v in ('node --version 2^>^&1') do echo  [OK] Node.js %%v
echo.

:: ── 4. Install Python dependencies ──────────────────────────────────────
if not exist "%ROOT%\Backend\__pycache__" (
    echo  [INFO] Installing Python packages (first run ^— this may take a minute)...
    pushd "%ROOT%\Backend"
    pip install -r requirements.txt
    popd
    echo  [OK] Python packages ready.
    echo.
)

:: ── 5. Install frontend dependencies ────────────────────────────────────
if not exist "%ROOT%\frontend\node_modules" (
    echo  [INFO] Installing frontend npm packages (first run ^— this may take a few minutes)...
    pushd "%ROOT%\frontend"
    call npm install
    popd
    echo  [OK] Frontend packages ready.
    echo.
)

:: ── 6. Install mobile dependencies ──────────────────────────────────────
if not exist "%ROOT%\mobile\node_modules" (
    echo  [INFO] Installing mobile npm packages (first run ^— this may take a few minutes)...
    pushd "%ROOT%\mobile"
    call npm install --legacy-peer-deps
    popd
    echo  [OK] Mobile packages ready.
    echo.
)

:: ── 7. Start Ollama LLM (if installed) ────────────────────────────────
ollama --version >nul 2>&1
if not errorlevel 1 (
    echo  [OK] Ollama found ^— launching Ollama server...
    start "Ollama — LLM Server" cmd /k "ollama serve"
    timeout /t 4 /nobreak >nul
    echo  [INFO] Pulling mistral-nemo model (may download on first run)...
    start "Ollama — Pull mistral-nemo" cmd /k "ollama pull mistral-nemo && echo. && echo [OK] mistral-nemo is ready! && pause"
) else (
    echo  [WARN] Ollama not installed ^— chatbot uses keyword fallback.
    echo         Get it from https://ollama.com then run: ollama pull mistral-nemo
)
echo.

:: ── 8. Start Backend API ───────────────────────────────────────────────
echo  [INFO] Starting Backend API on http://localhost:8000 ...
start "FitAI — Backend API" cmd /k "cd /d "%ROOT%\Backend" && echo. && echo [Backend] Starting on http://localhost:8000 && echo. && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 2 /nobreak >nul

:: ── 9. Start Next.js Frontend ──────────────────────────────────────────
echo  [INFO] Starting Web Frontend on http://localhost:5000 ...
start "FitAI — Web Frontend" cmd /k "cd /d "%ROOT%\frontend" && echo. && echo [Frontend] Starting on http://localhost:5000 && echo. && npm run dev"
timeout /t 2 /nobreak >nul

:: ── 10. Start Expo Mobile App ──────────────────────────────────────────
echo  [INFO] Starting Mobile App (Expo) on http://localhost:8080 ...
start "FitAI — Mobile App" cmd /k "cd /d "%ROOT%\mobile" && echo. && echo [Mobile] Starting Expo on http://localhost:8080 && echo. && set EXPO_NO_TELEMETRY=1 && npx expo start --web --port 8080"

:: ── 11. Wait and open browser ──────────────────────────────────────────
echo.
echo  [INFO] Waiting 20 seconds for all services to boot...
timeout /t 20 /nobreak

echo  [INFO] Opening browser at http://localhost:5000 ...
start "" "http://localhost:5000"

echo.
echo  ============================================
echo   All services are running!
echo.
echo   Backend API  ^>  http://localhost:8000
echo   API Docs     ^>  http://localhost:8000/docs
echo   Web App      ^>  http://localhost:5000
echo   Mobile App   ^>  http://localhost:8080
echo   Ollama LLM   ^>  http://localhost:11434
echo.
echo   Close each terminal window to stop a service.
echo   Press any key here to close this launcher window.
echo  ============================================
echo.
pause >nul
