#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}" || exit 1
echo "Stopping backend and frontend..."
for pid in $(cat .backend_pid 2>/dev/null); do kill $pid 2>/dev/null; done
rm -f .backend_pid
for pid in $(cat .frontend_pid 2>/dev/null); do kill $pid 2>/dev/null; done
rm -f .frontend_pid
if command -v lsof >/dev/null 2>&1; then
  pids=$(lsof -ti :3001 2>/dev/null); [ -n "$pids" ] && kill $pids 2>/dev/null || true
  pids=$(lsof -ti :3000 2>/dev/null); [ -n "$pids" ] && kill $pids 2>/dev/null || true
fi
echo "Stopped."
