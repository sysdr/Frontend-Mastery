#!/bin/bash

# --- Configuration ---
PROJECT_NAME="saas-dashboard-forms"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=3000
BASE_URL="http://localhost:$PORT"

# --- Helper Functions ---
log_info() {
  echo -e "\e[32m[INFO] $1\e[0m"
}

log_warn() {
  echo -e "\e[33m[WARN] $1\e[0m"
}

log_error() {
  echo -e "\e[31m[ERROR] $1\e[0m"
}

log_success() {
  echo -e "\e[32m[PASS] $1\e[0m"
}

log_fail() {
  echo -e "\e[31m[FAIL] $1\e[0m"
}

# --- Test Functions ---
test_server_running() {
  log_info "Testing if server is running on port $PORT..."
  
  for i in {1..10}; do
    if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200"; then
      log_success "Server is running and responding on $BASE_URL"
      return 0
    fi
    log_warn "Waiting for server to start... (attempt $i/10)"
    sleep 2
  done
  
  log_fail "Server is not responding on $BASE_URL"
  return 1
}

test_main_page_loads() {
  log_info "Testing if main page loads correctly..."
  
  RESPONSE=$(curl -s "$BASE_URL")
  
  if echo "$RESPONSE" | grep -q "root"; then
    log_success "Main page loads and contains root element"
    return 0
  else
    log_fail "Main page does not contain expected content"
    return 1
  fi
}

test_files_exist() {
  log_info "Testing if required source files exist..."
  
  REQUIRED_FILES=(
    "src/App.jsx"
    "src/main.jsx"
    "src/index.css"
    "src/components/UserProfileForm.jsx"
    "src/components/Dashboard.jsx"
    "tailwind.config.js"
    "package.json"
  )
  
  ALL_PASS=true
  for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$SCRIPT_DIR/$file" ]; then
      log_success "File exists: $file"
    else
      log_fail "File missing: $file"
      ALL_PASS=false
    fi
  done
  
  if $ALL_PASS; then
    return 0
  else
    return 1
  fi
}

test_dependencies_installed() {
  log_info "Testing if required dependencies are installed..."
  
  cd "$SCRIPT_DIR" || return 1
  
  if [ -d "node_modules/react-hook-form" ]; then
    log_success "react-hook-form is installed"
  else
    log_fail "react-hook-form is NOT installed"
    return 1
  fi
  
  if [ -d "node_modules/tailwindcss" ]; then
    log_success "tailwindcss is installed"
  else
    log_fail "tailwindcss is NOT installed"
    return 1
  fi
  
  return 0
}

test_build() {
  log_info "Testing if project builds successfully..."
  
  cd "$SCRIPT_DIR" || return 1
  
  if npm run build > /dev/null 2>&1; then
    log_success "Project builds successfully"
    return 0
  else
    log_fail "Project build failed"
    return 1
  fi
}

# --- Run All Tests ---
run_tests() {
  echo ""
  echo "=========================================="
  echo "   Day 13 - React Hook Form Tests"
  echo "=========================================="
  echo ""
  
  TESTS_PASSED=0
  TESTS_FAILED=0
  
  test_files_exist
  if [ $? -eq 0 ]; then ((TESTS_PASSED++)); else ((TESTS_FAILED++)); fi
  
  test_dependencies_installed
  if [ $? -eq 0 ]; then ((TESTS_PASSED++)); else ((TESTS_FAILED++)); fi
  
  test_build
  if [ $? -eq 0 ]; then ((TESTS_PASSED++)); else ((TESTS_FAILED++)); fi
  
  test_server_running
  if [ $? -eq 0 ]; then ((TESTS_PASSED++)); else ((TESTS_FAILED++)); fi
  
  test_main_page_loads
  if [ $? -eq 0 ]; then ((TESTS_PASSED++)); else ((TESTS_FAILED++)); fi
  
  echo ""
  echo "=========================================="
  echo "   Test Results"
  echo "=========================================="
  echo -e "\e[32mPassed: $TESTS_PASSED\e[0m"
  echo -e "\e[31mFailed: $TESTS_FAILED\e[0m"
  echo "=========================================="
  
  if [ $TESTS_FAILED -eq 0 ]; then
    log_success "All tests passed!"
    return 0
  else
    log_fail "Some tests failed."
    return 1
  fi
}

run_tests
