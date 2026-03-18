#!/bin/bash
# Edge case API tests for contact forms
# Tests: empty body, invalid emails, max length, unicode, honeypot, rate limiting

API_BASE="https://hesa-api.azurewebsites.net"
PASS=0
FAIL=0

assert_status() {
  local expected=$1
  local actual=$2
  local test_name=$3
  if [ "$expected" = "$actual" ]; then
    echo "PASS: $test_name (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    echo "FAIL: $test_name (expected HTTP $expected, got HTTP $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== API Edge Case Tests ==="
echo ""

# Test 1: Empty body - general
echo "--- Test: Empty body general ---"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/api/public/contact/general" -H "Content-Type: application/json" -d '{}')
status=$(echo "$response" | tail -1)
assert_status "400" "$status" "Empty body on /general returns 400"

# Test 2: Empty body - manufacturer
echo "--- Test: Empty body manufacturer ---"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/api/public/contact/manufacturer" -H "Content-Type: application/json" -d '{}')
status=$(echo "$response" | tail -1)
assert_status "400" "$status" "Empty body on /manufacturer returns 400"

# Test 3: Invalid email formats
echo "--- Test: Invalid email 'test@' ---"
sleep 2
response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/api/public/contact/general" -H "Content-Type: application/json" -d '{"name":"Test","email":"test@","consultationType":"info","message":"Test msg"}')
status=$(echo "$response" | tail -1)
assert_status "400" "$status" "Email 'test@' rejected"

echo "--- Test: Invalid email '@test.com' ---"
sleep 2
response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/api/public/contact/general" -H "Content-Type: application/json" -d '{"name":"Test","email":"@test.com","consultationType":"info","message":"Test msg"}')
status=$(echo "$response" | tail -1)
assert_status "400" "$status" "Email '@test.com' rejected"

echo "--- Test: Invalid email 'test' ---"
sleep 2
response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/api/public/contact/general" -H "Content-Type: application/json" -d '{"name":"Test","email":"test","consultationType":"info","message":"Test msg"}')
status=$(echo "$response" | tail -1)
assert_status "400" "$status" "Email 'test' rejected"

# Test 4: Message over 2000 chars
echo "--- Test: Message over 2000 chars ---"
sleep 2
LONG_MSG=$(printf 'A%.0s' $(seq 1 2001))
response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/api/public/contact/general" -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"long@test.com\",\"consultationType\":\"info\",\"message\":\"$LONG_MSG\"}")
status=$(echo "$response" | tail -1)
assert_status "400" "$status" "Message >2000 chars rejected"

# Test 5: Name over 100 chars
echo "--- Test: Name over 100 chars ---"
sleep 2
LONG_NAME=$(printf 'N%.0s' $(seq 1 101))
response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/api/public/contact/general" -H "Content-Type: application/json" -d "{\"name\":\"$LONG_NAME\",\"email\":\"name@test.com\",\"consultationType\":\"info\",\"message\":\"Test\"}")
status=$(echo "$response" | tail -1)
assert_status "400" "$status" "Name >100 chars rejected"

# Test 6: Honeypot - general
echo "--- Test: Honeypot general ---"
sleep 2
response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/api/public/contact/general" -H "Content-Type: application/json" -d '{"name":"Bot","email":"bot@test.com","consultationType":"info","message":"Bot msg","website":"spam"}')
status=$(echo "$response" | tail -1)
body=$(echo "$response" | head -1)
assert_status "200" "$status" "Honeypot general returns 200 (silent reject)"

# Test 7: XSS script tag stripped
echo "--- Test: XSS script tag stripped ---"
sleep 2
response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/api/public/contact/general" -H "Content-Type: application/json" -d '{"name":"<script>alert(1)</script>","email":"xss@test.com","consultationType":"info","message":"normal"}')
status=$(echo "$response" | tail -1)
assert_status "400" "$status" "XSS script tag stripped, name becomes empty -> 400"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
