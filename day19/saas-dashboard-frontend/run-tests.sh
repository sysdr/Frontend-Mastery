#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
echo "[TEST] Running build..."
npm run build || { echo "[FAIL] Build failed."; exit 1; }
echo "[PASS] Build OK."
if curl -sf -o /dev/null http://localhost:5173 2>/dev/null; then
  echo "[PASS] Dev server responding on 5173."
else
  echo "[SKIP] Dev server not running (start with ./start.sh to test live)."
fi
echo "[DONE] Tests complete."
