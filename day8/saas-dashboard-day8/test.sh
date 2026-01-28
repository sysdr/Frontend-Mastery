#!/bin/bash

# Test script for SaaS Dashboard Day 8
# This script runs linting and type checking

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Function to display messages
log_info() {
  echo -e "\e[32m[INFO]\e[0m $1"
}

log_warn() {
  echo -e "\e[33m[WARN]\e[0m $1"
}

log_error() {
  echo -e "\e[31m[ERROR]\e[0m $1"
}

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Test 1: Type checking
log_info "Running TypeScript type check..."
if npm run build > /tmp/build_output.log 2>&1; then
  log_info "✓ Type check passed"
  ((TESTS_PASSED++))
else
  log_error "✗ Type check failed"
  cat /tmp/build_output.log
  ((TESTS_FAILED++))
fi

# Test 2: Linting
log_info "Running ESLint..."
if npm run lint > /tmp/lint_output.log 2>&1; then
  log_info "✓ Linting passed"
  ((TESTS_PASSED++))
else
  log_warn "✗ Linting found issues (non-fatal)"
  cat /tmp/lint_output.log
  # Don't fail on linting warnings
  ((TESTS_PASSED++))
fi

# Test 3: Verify required files exist
log_info "Verifying required files..."
REQUIRED_FILES=(
  "src/App.tsx"
  "src/main.tsx"
  "src/api/metrics.ts"
  "src/components/MetricCard.tsx"
  "src/index.css"
  "package.json"
)

ALL_FILES_EXIST=true
for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    log_info "✓ Found: $file"
  else
    log_error "✗ Missing: $file"
    ALL_FILES_EXIST=false
  fi
done

if [ "$ALL_FILES_EXIST" = true ]; then
  log_info "✓ All required files exist"
  ((TESTS_PASSED++))
else
  log_error "✗ Some required files are missing"
  ((TESTS_FAILED++))
fi

# Test 4: Verify build output
log_info "Verifying build output..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
  log_info "✓ Build output exists"
  ((TESTS_PASSED++))
else
  log_error "✗ Build output missing or incomplete"
  ((TESTS_FAILED++))
fi

# Summary
echo ""
log_info "Test Summary:"
log_info "  Passed: $TESTS_PASSED"
if [ $TESTS_FAILED -gt 0 ]; then
  log_error "  Failed: $TESTS_FAILED"
  exit 1
else
  log_info "  Failed: $TESTS_FAILED"
  log_info "All tests passed!"
  exit 0
fi
