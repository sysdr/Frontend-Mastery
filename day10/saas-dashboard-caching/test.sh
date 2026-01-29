#!/bin/bash
set -e
API_PORT=3001
APP_PORT=3000
echo "Testing API at http://localhost:$API_PORT/api/metrics ..."
curl -sf "http://localhost:$API_PORT/api/metrics" | head -c 200
echo ""
echo "Checking metrics response..."
DATA=$(curl -sf "http://localhost:$API_PORT/api/metrics")
if echo "$DATA" | grep -q '"id":"CPU"' && echo "$DATA" | grep -q '"id":"Memory"' && echo "$DATA" | grep -q '"id":"Network"' && echo "$DATA" | grep -q '"value"'; then
  echo "API returned CPU, Memory, Network with values - OK"
else
  echo "API response missing metrics - check server"
  exit 1
fi
echo "Testing dashboard at http://localhost:$APP_PORT ..."
curl -sf -o /dev/null -w "%{http_code}" "http://localhost:$APP_PORT" | grep -q 200 && echo "Dashboard OK" || { echo "Dashboard not responding"; exit 1; }
echo "All tests passed."
