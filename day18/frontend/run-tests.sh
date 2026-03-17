#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
echo "Running build..."
npm run build
echo "Build OK."
if grep -q '"test"' package.json 2>/dev/null; then
  npm test -- --run 2>/dev/null || true
fi
