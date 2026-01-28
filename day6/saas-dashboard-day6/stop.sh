#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}" || exit 1
echo "Stopping backend and frontend..."
for pid in $(cat "$SCRIPT_DIR/.backend_pid" 2>/dev/null); do kill $pid 2>/dev/null; done
rm -f "$SCRIPT_DIR/.backend_pid"
for pid in $(cat "$SCRIPT_DIR/.frontend_pid" 2>/dev/null); do kill $pid 2>/dev/null; done
rm -f "$SCRIPT_DIR/.frontend_pid"
pkill -f "node.*server\.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
echo "Stopped."

