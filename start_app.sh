#!/usr/bin/env bash
# ============================================================
#  FitAI Trainer — One-Click Startup Script (Mac / Linux)
#  Usage:  chmod +x start_app.sh && ./start_app.sh
# ============================================================

set -e
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
BOLD="\033[1m"
NC="\033[0m"

info()  { echo -e "${BLUE}[INFO]${NC} $*"; }
ok()    { echo -e "${GREEN}[ OK ]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERR ]${NC} $*"; exit 1; }

echo ""
echo -e "${BOLD} ============================================${NC}"
echo -e "${BOLD}  FitAI Trainer — One-Click Startup${NC}"
echo -e "${BOLD} ============================================${NC}"
echo ""

# ── 1. Create .env files if missing ─────────────────────────────────────
if [ ! -f "Backend/.env" ]; then
    info "Backend/.env not found — creating stub..."
    cat > Backend/.env <<'ENVEOF'
DATABASE_URL=sqlite:///./fitness.db
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
ELEVENLABS_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434
SECRET_KEY=change_me_in_production
GOOGLE_VERIFY_TOKENS=false
ENVEOF
    warn "Backend/.env created. Fill in secrets (see .env.production_example)."
fi

if [ ! -f "frontend/.env.local" ]; then
    info "frontend/.env.local not found — creating stub..."
    cat > frontend/.env.local <<'ENVEOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PORT=5000
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
ENVEOF
fi

if [ ! -f "mobile/.env" ]; then
    info "mobile/.env not found — creating stub..."
    echo "EXPO_PUBLIC_API_URL=http://localhost:8000" > mobile/.env
fi

# ── 2. Check Python ──────────────────────────────────────────────────────
if ! command -v python3 &>/dev/null; then
    error "Python 3 not found. Install Python 3.10+ from https://python.org"
fi
ok "Python found: $(python3 --version)"

# ── 3. Check Node.js ────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
    error "Node.js not found. Install from https://nodejs.org"
fi
ok "Node.js found: $(node --version)"

# ── 4. Install Python dependencies ──────────────────────────────────────
if [ ! -d "Backend/__pycache__" ]; then
    info "Installing Python dependencies..."
    pip3 install -r Backend/requirements.txt -q
fi

# ── 5. Install frontend packages ─────────────────────────────────────────
if [ ! -d "frontend/node_modules" ]; then
    info "Installing frontend npm packages..."
    cd frontend && npm install --silent && cd "$ROOT_DIR"
fi

# ── 6. Install mobile packages ───────────────────────────────────────────
if [ ! -d "mobile/node_modules" ]; then
    info "Installing mobile npm packages..."
    cd mobile && npm install --silent && cd "$ROOT_DIR"
fi

# ── Helper: open a new terminal window (cross-platform) ─────────────────
open_terminal() {
    local title="$1"
    local cmd="$2"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "tell application \"Terminal\" to do script \"echo '=== $title ===' && $cmd\""
    elif command -v gnome-terminal &>/dev/null; then
        gnome-terminal --title="$title" -- bash -c "$cmd; exec bash"
    elif command -v xterm &>/dev/null; then
        xterm -title "$title" -e bash -c "$cmd; exec bash" &
    else
        # Fallback: run in background, log to file
        local logfile="/tmp/fitai_$(echo $title | tr ' ' '_').log"
        info "No GUI terminal found — running '$title' in background. Log: $logfile"
        bash -c "$cmd" > "$logfile" 2>&1 &
    fi
}

# ── 7. Start Ollama LLM (if installed) ──────────────────────────────────
if command -v ollama &>/dev/null; then
    ok "Ollama found — starting server..."
    open_terminal "Ollama LLM Server" "ollama serve"
    sleep 3
    info "Pulling mistral-nemo model (this may take a while on first run)..."
    open_terminal "Ollama Pull mistral-nemo" "ollama pull mistral-nemo && echo '=== mistral-nemo ready ===' && sleep 5"
else
    warn "Ollama not installed — AI chatbot will use keyword fallback mode."
    warn "To enable full LLM support, download Ollama from https://ollama.com"
    warn "Then run:  ollama pull mistral-nemo"
fi

# ── 8. Start Backend API ─────────────────────────────────────────────────
info "Starting Backend API on http://localhost:8000 ..."
open_terminal "FitAI Backend API" "cd '$ROOT_DIR/Backend' && source .env 2>/dev/null || true && python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

sleep 2

# ── 9. Start Next.js Frontend ────────────────────────────────────────────
info "Starting Web Frontend on http://localhost:5000 ..."
open_terminal "FitAI Frontend" "cd '$ROOT_DIR/frontend' && npm run dev"

sleep 2

# ── 10. Start Expo Mobile App ────────────────────────────────────────────
info "Starting Mobile App (Expo) on http://localhost:8080 ..."
open_terminal "FitAI Mobile" "cd '$ROOT_DIR/mobile' && EXPO_NO_TELEMETRY=1 npx expo start --web --port 8080"

# ── 11. Wait and open browser ────────────────────────────────────────────
info "Waiting 15 seconds for services to boot..."
sleep 15

if command -v xdg-open &>/dev/null; then
    xdg-open http://localhost:5000
elif command -v open &>/dev/null; then
    open http://localhost:5000
fi

echo ""
echo -e "${BOLD} ============================================${NC}"
echo -e "${GREEN}  All services launched!${NC}"
echo ""
echo -e "  Backend API  →  ${BLUE}http://localhost:8000${NC}"
echo -e "  API Docs     →  ${BLUE}http://localhost:8000/docs${NC}"
echo -e "  Web App      →  ${BLUE}http://localhost:5000${NC}"
echo -e "  Mobile (web) →  ${BLUE}http://localhost:8080${NC}"
echo -e "  Ollama API   →  ${BLUE}http://localhost:11434${NC}"
echo ""
echo -e "  Close the terminal windows to stop services."
echo -e "${BOLD} ============================================${NC}"
echo ""
