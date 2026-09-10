#!/usr/bin/env bash
set -euo pipefail

# ── Cleanup on exit ──────────────────────────────────────────────
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill $BACKEND_PID $AI_PID 2>/dev/null || true
    wait $BACKEND_PID $AI_PID 2>/dev/null || true
    echo "All services stopped."
}
trap cleanup EXIT INT TERM

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"
mkdir -p "$LOG_DIR"

# ── Header ───────────────────────────────────────────────────────
echo "========================================"
echo "  AI Recruitment Management System"
echo "  Starting all services..."
echo "========================================"
echo ""
echo "  Spring Boot  → :8080  (backend)"
echo "  FastAPI       → :8000  (ai-service)"
echo "  Streamlit     → :8501  (frontend)"
echo ""

# ── 1. Check MySQL ───────────────────────────────────────────────
echo "[1/4] Checking MySQL..."
if ! mysqladmin ping --silent 2>/dev/null; then
    echo "ERROR: MySQL is not running."
    echo "Start MySQL first, then re-run this script."
    echo "  macOS:   brew services start mysql"
    echo "  Linux:   sudo systemctl start mysql"
    echo "  Windows: net start MySQL80"
    exit 1
fi
echo "  MySQL is up."
echo ""

# ── 2. Start Spring Boot backend ────────────────────────────────
echo "[2/4] Starting Spring Boot backend..."
cd "$PROJECT_ROOT/backend"
./mvnw spring-boot:run > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "  PID=$BACKEND_PID  Logs: logs/backend.log"

echo "  Waiting 10s for Spring Boot to start..."
sleep 10
echo ""

# ── 3. Start FastAPI ai-service ──────────────────────────────────
echo "[3/4] Starting FastAPI ai-service..."
cd "$PROJECT_ROOT/ai-service"
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi
uvicorn app.main:app --reload --port 8000 > "$LOG_DIR/ai-service.log" 2>&1 &
AI_PID=$!
echo "  PID=$AI_PID  Logs: logs/ai-service.log"
echo ""

# ── 4. Start Streamlit frontend (foreground) ─────────────────────
echo "[4/4] Starting Streamlit frontend (foreground)..."
echo "  Press Ctrl+C to stop all services."
echo ""
cd "$PROJECT_ROOT/frontend"
streamlit run app.py
