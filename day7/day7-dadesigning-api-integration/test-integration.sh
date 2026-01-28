#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Running integration tests..."
echo ""

# Test backend endpoints
echo "Testing backend endpoints..."
cd "$SCRIPT_DIR/day7-backend-api" || exit 1
node test-server.js
BACKEND_TEST_RESULT=$?

cd "$SCRIPT_DIR"

if [ $BACKEND_TEST_RESULT -eq 0 ]; then
    echo ""
    echo "✓ All integration tests passed!"
    exit 0
else
    echo ""
    echo "✗ Some integration tests failed."
    exit 1
fi
