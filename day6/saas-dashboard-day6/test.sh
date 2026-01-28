#!/bin/bash
# Run backend API check and frontend build
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}" || exit 1
echo "=== Backend health check (if running) ==="
curl -sf http://localhost:3001/api/v1/metrics >/dev/null && echo "Backend API OK" || echo "Backend not running or failed (start with start.sh first)"
echo "=== Frontend build ==="
(cd "$SCRIPT_DIR/frontend" && npm run build) && echo "Frontend build OK" || exit 1
echo "=== All checks passed ==="

