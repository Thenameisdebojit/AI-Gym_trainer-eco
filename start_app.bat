@echo off
setlocal
title FitAI Trainer - Startup

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

if /I "%~1"=="backend" goto run_backend
if /I "%~1"=="frontend" goto run_frontend
if /I "%~1"=="mobile" goto run_mobile
if /I "%~1"=="ollama_pull" goto run_ollama_pull

color 0A
echo.
echo  ============================================
echo   FitAI Trainer - One-Click Startup
echo  ============================================
echo.

echo  [INFO] Checking environment files...
if exist "%ROOT%\.env" (
    for %%I in ("%ROOT%\.env") do (
        if %%~zI gtr 0 (
            echo  [OK] Root .env found - distributing to Backend, frontend, and mobile...
            python "%ROOT%\setup_env.py"
            if errorlevel 1 (
                echo  [WARN] setup_env.py reported a problem. Check your .env syntax.
            )
        ) else (
            echo  [INFO] Root .env is empty - keeping existing sub-folder env files.
        )
    )
) else (
    echo  [INFO] No root .env found. Using existing sub-folder env files.
)

if not exist "%ROOT%\Backend\.env" (
    echo  [WARN] Backend\.env is missing. Copy .env.production_example to %ROOT%\.env if needed.
)
if not exist "%ROOT%\frontend\.env.local" (
    echo  [WARN] frontend\.env.local is missing.
)
if not exist "%ROOT%\mobile\.env" (
    > "%ROOT%\mobile\.env" echo EXPO_PUBLIC_API_URL=http://localhost:8000
    echo  [INFO] Created minimal mobile\.env
)
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python not found. Install Python 3.10+ from https://python.org
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('python --version 2^>^&1') do echo  [OK] %%v

node --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version 2^>^&1') do echo  [OK] Node.js %%v
echo.

echo  [INFO] Checking backend Python dependencies...
python -c "import fastapi, uvicorn, sqlalchemy, httpx" >nul 2>&1
if errorlevel 1 (
    echo  [INFO] Installing backend Python packages. This may take a minute...
    pushd "%ROOT%\Backend"
    python -m pip install -r requirements.txt
    if errorlevel 1 (
        popd
        echo  [ERROR] Failed to install backend Python packages.
        pause
        exit /b 1
    )
    popd
) else (
    echo  [OK] Backend Python packages already available.
)
echo.

echo  [INFO] Checking frontend npm packages...
if not exist "%ROOT%\frontend\node_modules\next\package.json" (
    pushd "%ROOT%\frontend"
    if exist "package-lock.json" (
        echo  [INFO] Installing frontend packages with npm ci...
        call npm ci
    ) else (
        echo  [INFO] Installing frontend packages with npm install...
        call npm install
    )
    if errorlevel 1 (
        popd
        echo  [ERROR] Failed to install frontend npm packages.
        pause
        exit /b 1
    )
    popd
) else (
    echo  [OK] Frontend npm packages already available.
)
echo.

echo  [INFO] Checking mobile npm packages...
if not exist "%ROOT%\mobile\node_modules\expo\package.json" (
    pushd "%ROOT%\mobile"
    echo  [INFO] Installing mobile packages with npm install --legacy-peer-deps...
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        popd
        echo  [ERROR] Failed to install mobile npm packages.
        pause
        exit /b 1
    )
    popd
) else (
    echo  [OK] Mobile npm packages already available.
)
echo.

ollama --version >nul 2>&1
if not errorlevel 1 (
    echo  [OK] Ollama found - launching Ollama server...
    start "Ollama - LLM Server" cmd /k "ollama serve"
    timeout /t 4 /nobreak >nul
    echo  [INFO] Pulling mistral-nemo. First download may take a while...
    start "Ollama - Pull mistral-nemo" cmd /k call "%~f0" ollama_pull
) else (
    echo  [WARN] Ollama not installed - chatbot uses keyword fallback.
    echo         Get it from https://ollama.com then run: ollama pull mistral-nemo
)
echo.

echo  [INFO] Starting Backend API on http://localhost:8000 ...
start "FitAI - Backend API" cmd /k call "%~f0" backend
timeout /t 2 /nobreak >nul

echo  [INFO] Starting Web Frontend on http://localhost:5000 ...
start "FitAI - Web Frontend" cmd /k call "%~f0" frontend
timeout /t 2 /nobreak >nul

echo  [INFO] Starting Mobile App on http://localhost:8080 ...
start "FitAI - Mobile App" cmd /k call "%~f0" mobile

echo.
echo  [INFO] Waiting 20 seconds for all services to boot...
timeout /t 20 /nobreak >nul

echo  [INFO] Opening browser at http://localhost:5000 ...
start "" "http://localhost:5000"

echo.
echo  ============================================
echo   Launch started successfully.
echo.
echo   Backend API  ^>  http://localhost:8000
echo   API Docs     ^>  http://localhost:8000/docs
echo   Web App      ^>  http://localhost:5000
echo   Mobile App   ^>  http://localhost:8080
echo   Ollama LLM   ^>  http://localhost:11434
echo.
echo   Close each service window to stop it.
echo   Press any key here to close this launcher window.
echo  ============================================
echo.
pause >nul

:run_backend
cd /d "%ROOT%\Backend"
echo.
echo [Backend] Starting on http://localhost:8000
echo.
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload --app-dir "%ROOT%\Backend" --reload-dir "%ROOT%\Backend"
goto :eof

:run_frontend
cd /d "%ROOT%\frontend"
echo.
echo [Frontend] Starting on http://localhost:5000
echo.
call npm run dev
goto :eof

:run_mobile
cd /d "%ROOT%\mobile"
echo.
echo [Mobile] Starting Expo on http://localhost:8080
echo.
set EXPO_NO_TELEMETRY=1
call npx expo start --web --port 8080
goto :eof

:run_ollama_pull
echo.
ollama pull mistral-nemo
echo.
echo [OK] mistral-nemo is ready.
pause
goto :eof
