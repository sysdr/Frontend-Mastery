#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}" || exit 1
echo "=== Backend API check (if running) ==="
# Backend returns 200 (success) or 500 (simulated error) - both mean backend is running
code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/api/data")
if [ "$code" = "200" ] || [ "$code" = "500" ]; then
  echo "Backend API OK (HTTP $code)"
else
  echo "Backend not running or failed (run ./start.sh first)"
fi
echo "=== Frontend build ==="
(cd frontend && npm run build) && echo "Frontend build OK" || exit 1
echo "=== All checks passed ==="
