#!/usr/bin/env bash
# ============================================================
#  FitAI Trainer — One-Click Startup Script (Mac / Linux)
#  Usage:  chmod +x start_app.sh && ./start_app.sh
# ============================================================

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

# ── 1. Distribute root .env to sub-folders ──────────────────────────────
info "Checking environment files..."
if [ -f "$ROOT_DIR/.env" ]; then
    ok "Root .env found — distributing to Backend, frontend, mobile..."
    python3 "$ROOT_DIR/setup_env.py"
else
    warn "No root .env found. Place your .env at: $ROOT_DIR/.env"
    warn "See .env.production_example for all required variables."

    if [ ! -f "Backend/.env" ]; then
        info "Creating minimal Backend/.env stub..."
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
GOOGLE_VERIFY_TOKENS=true
ENVEOF
    fi

    if [ ! -f "frontend/.env.local" ]; then
        info "Creating minimal frontend/.env.local stub..."
        cat > frontend/.env.local <<'ENVEOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PORT=5000
ENVEOF
    fi

    [ ! -f "mobile/.env" ] && echo "EXPO_PUBLIC_API_URL=http://localhost:8000" > mobile/.env
fi
echo ""

# ── 2. Check Python ──────────────────────────────────────────────────────
if ! command -v python3 &>/dev/null; then
    error "Python 3 not found. Install Python 3.10+ from https://python.org"
fi
ok "Python: $(python3 --version)"

# ── 3. Check Node.js ────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
    error "Node.js not found. Install from https://nodejs.org"
fi
ok "Node.js: $(node --version)"
echo ""

# ── 4. Install Python dependencies ──────────────────────────────────────
if [ ! -d "Backend/__pycache__" ]; then
    info "Installing Python packages (first run — may take a minute)..."
    (cd "$ROOT_DIR/Backend" && pip3 install -r requirements.txt)
    ok "Python packages installed."
    echo ""
fi

# ── 5. Install frontend packages ─────────────────────────────────────────
if [ ! -d "frontend/node_modules" ]; then
    info "Installing frontend npm packages (first run — may take a few minutes)..."
    (cd "$ROOT_DIR/frontend" && npm install)
    ok "Frontend packages installed."
    echo ""
fi

# ── 6. Install mobile packages ───────────────────────────────────────────
if [ ! -d "mobile/node_modules" ]; then
    info "Installing mobile npm packages (first run — may take a few minutes)..."
    (cd "$ROOT_DIR/mobile" && npm install --legacy-peer-deps)
    ok "Mobile packages installed."
    echo ""
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
        local logfile="/tmp/fitai_$(echo "$title" | tr ' ' '_').log"
        info "No GUI terminal — running '$title' in background. Log: $logfile"
        bash -c "$cmd" > "$logfile" 2>&1 &
    fi
}

# ── 7. Start Ollama LLM (if installed) ──────────────────────────────────
if command -v ollama &>/dev/null; then
    ok "Ollama found — starting server..."
    open_terminal "Ollama LLM Server" "ollama serve"
    sleep 4
    info "Pulling mistral-nemo (downloads only on first run)..."
    open_terminal "Ollama Pull" "ollama pull mistral-nemo && echo '=== mistral-nemo ready ===' && sleep 10"
else
    warn "Ollama not installed — chatbot uses keyword fallback."
    warn "Download: https://ollama.com  then: ollama pull mistral-nemo"
fi

# ── 8. Start Backend API ─────────────────────────────────────────────────
info "Starting Backend API on http://localhost:8000 ..."
open_terminal "FitAI Backend" "cd '$ROOT_DIR/Backend' && (set -a && source .env 2>/dev/null && set +a || true) && echo '[Backend] Starting...' && python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
sleep 2

# ── 9. Start Next.js Frontend ────────────────────────────────────────────
info "Starting Web Frontend on http://localhost:5000 ..."
open_terminal "FitAI Frontend" "cd '$ROOT_DIR/frontend' && echo '[Frontend] Starting...' && npm run dev"
sleep 2

# ── 10. Start Expo Mobile App ────────────────────────────────────────────
info "Starting Mobile App (Expo) on http://localhost:8080 ..."
open_terminal "FitAI Mobile" "cd '$ROOT_DIR/mobile' && echo '[Mobile] Starting Expo...' && EXPO_NO_TELEMETRY=1 npx expo start --web --port 8080"

# ── 11. Wait and open browser ────────────────────────────────────────────
info "Waiting 20 seconds for services to boot..."
sleep 20

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
echo -e "  Mobile App   →  ${BLUE}http://localhost:8080${NC}"
echo -e "  Ollama LLM   →  ${BLUE}http://localhost:11434${NC}"
echo ""
echo -e "  Close each terminal window to stop a service."
echo -e "${BOLD} ============================================${NC}"
echo ""
