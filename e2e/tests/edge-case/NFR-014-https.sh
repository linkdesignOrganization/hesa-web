#!/bin/bash
# test: NFR-014 - HTTPS in all communications
BASE_URL="https://gray-field-02ba8410f.2.azurestaticapps.net"

echo "=== NFR-014: HTTPS Verification ==="

# Test 1: HTTP redirects to HTTPS
echo "Test 1: HTTP to HTTPS redirect"
response=$(curl -sI "http://gray-field-02ba8410f.2.azurestaticapps.net/" 2>&1 | head -1)
if echo "$response" | grep -q "301"; then
  echo "PASS: HTTP redirects with 301"
else
  echo "FAIL: HTTP does not redirect properly. Response: $response"
fi

# Test 2: HTTPS works
echo "Test 2: HTTPS works"
response=$(curl -sI "${BASE_URL}/" 2>&1 | head -1)
if echo "$response" | grep -q "200"; then
  echo "PASS: HTTPS returns 200 OK"
else
  echo "FAIL: HTTPS failed. Response: $response"
fi

# Test 3: HSTS header present
echo "Test 3: HSTS header"
hsts=$(curl -sI "${BASE_URL}/" 2>&1 | grep -i "Strict-Transport-Security")
if [ -n "$hsts" ]; then
  echo "PASS: HSTS header present: $hsts"
else
  echo "FAIL: No HSTS header found"
fi
