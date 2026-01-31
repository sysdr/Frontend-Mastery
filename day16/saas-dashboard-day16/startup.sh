#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Starting SaaS Dashboard..."

# Check for existing processes
if [ -f .server_pid ]; then
    OLD_PID=$(cat .server_pid)
    if ps -p "$OLD_PID" > /dev/null 2>&1; then
        echo "Server already running with PID $OLD_PID"
        echo "Use ./stop.sh to stop it first, or access http://localhost:3000"
        exit 0
    fi
fi

# Check if port 3000 is in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Port 3000 is already in use!"
    echo "Existing process(es) on port 3000:"
    lsof -Pi :3000 -sTCP:LISTEN
    echo ""
    echo "Kill existing process? (y/n):"
    read -r KILL_EXISTING
    if [[ "$KILL_EXISTING" == "y" ]]; then
        lsof -Pi :3000 -sTCP:LISTEN -t | xargs kill -9 2>/dev/null || true
        sleep 1
    else
        exit 1
    fi
fi

# Start the dev server
npm run dev -- --host 0.0.0.0 --port 3000 &
SERVER_PID=$!
echo "$SERVER_PID" > .server_pid

echo "Dashboard starting..."
sleep 3

echo "=================================================="
echo "  SaaS Dashboard is running!"
echo "  Access it at: http://localhost:3000"
echo "  PID: $SERVER_PID"
echo "  Stop with: ./stop.sh"
echo "=================================================="
