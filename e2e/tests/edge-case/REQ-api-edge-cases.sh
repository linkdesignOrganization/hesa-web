#!/bin/bash
# Edge case tests for HESA public API endpoints
# Tests: XSS injection, invalid pageKeys, POST to read-only endpoints

API_URL="https://hesa-api.azurewebsites.net"
PASS=0
FAIL=0

echo "=== API Edge Case Tests ==="
echo ""

# Test 1: XSS in pageKey parameter
echo "Test 1: XSS attempt in pageKey"
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/public/content/nosotros%3Cscript%3Ealert(1)%3C%2Fscript%3E" 2>/dev/null)
status=$(echo "$response" | tail -1)
if [ "$status" = "404" ]; then
  echo "  PASS: XSS in pageKey returns 404"
  PASS=$((PASS + 1))
else
  echo "  FAIL: Expected 404, got $status"
  FAIL=$((FAIL + 1))
fi

# Test 2: Invalid pageKey
echo "Test 2: Invalid pageKey"
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/public/content/invalid_page" 2>/dev/null)
status=$(echo "$response" | tail -1)
body=$(echo "$response" | head -1)
if [ "$status" = "404" ] && echo "$body" | grep -q "Page not found"; then
  echo "  PASS: Invalid pageKey returns 404 with 'Page not found'"
  PASS=$((PASS + 1))
else
  echo "  FAIL: Expected 404 with 'Page not found'"
  FAIL=$((FAIL + 1))
fi

# Test 3: Empty pageKey
echo "Test 3: Empty pageKey"
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/public/content/" 2>/dev/null)
status=$(echo "$response" | tail -1)
if [ "$status" = "404" ]; then
  echo "  PASS: Empty pageKey returns 404"
  PASS=$((PASS + 1))
else
  echo "  FAIL: Expected 404, got $status"
  FAIL=$((FAIL + 1))
fi

# Test 4: POST to read-only home endpoint
echo "Test 4: POST to read-only /api/public/home"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/public/home" -H "Content-Type: application/json" -d '{"test":"data"}' 2>/dev/null)
status=$(echo "$response" | tail -1)
if [ "$status" = "404" ]; then
  echo "  PASS: POST to read-only endpoint returns 404"
  PASS=$((PASS + 1))
else
  echo "  FAIL: Expected 404, got $status"
  FAIL=$((FAIL + 1))
fi

# Test 5: Valid pageKey whitelist check
echo "Test 5: Valid pageKey 'nosotros' returns 200"
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/public/content/nosotros" 2>/dev/null)
status=$(echo "$response" | tail -1)
if [ "$status" = "200" ]; then
  echo "  PASS: Valid pageKey returns 200"
  PASS=$((PASS + 1))
else
  echo "  FAIL: Expected 200, got $status"
  FAIL=$((FAIL + 1))
fi

# Test 6: Team API returns array
echo "Test 6: Team API returns array"
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/public/team" 2>/dev/null)
status=$(echo "$response" | tail -1)
body=$(echo "$response" | head -1)
if [ "$status" = "200" ] && echo "$body" | grep -q "^\["; then
  echo "  PASS: Team API returns 200 with array"
  PASS=$((PASS + 1))
else
  echo "  FAIL: Expected 200 with array"
  FAIL=$((FAIL + 1))
fi

# Test 7: No sensitive data in error responses
echo "Test 7: Error responses do not leak stack traces"
response=$(curl -s "$API_URL/api/public/content/invalid" 2>/dev/null)
if echo "$response" | grep -qi "stack\|trace\|at \./\|node_modules\|TypeError\|Error:"; then
  echo "  FAIL: Error response contains stack trace"
  FAIL=$((FAIL + 1))
else
  echo "  PASS: No stack traces in error response"
  PASS=$((PASS + 1))
fi

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
