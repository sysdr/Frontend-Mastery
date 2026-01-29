#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
echo "Running unit tests..."
npm test -- --watchAll=false --passWithNoTests
echo "Unit tests passed."
PORT=3000
if curl -sf -o /dev/null -w "%{http_code}" "http://localhost:$PORT" 2>/dev/null | grep -q 200; then
  echo "Dashboard at http://localhost:$PORT is responding."
else
  echo "Dashboard not running on port $PORT (start with ./start.sh to test manually)."
fi
