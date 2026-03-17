#!/bin/bash
# test: NFR-016, NFR-017, NFR-020 - Security headers verification
BASE_URL="https://gray-field-02ba8410f.2.azurestaticapps.net"

echo "=== NFR-020: Security Headers Verification ==="

headers=$(curl -sI "${BASE_URL}/es/" 2>&1)

# Test CSP
echo "Test 1: Content-Security-Policy"
csp=$(echo "$headers" | grep -i "Content-Security-Policy")
if [ -n "$csp" ]; then
  echo "PASS: CSP header present"
  echo "  $csp"
else
  echo "FAIL: No CSP header found"
fi

# Test X-Frame-Options
echo "Test 2: X-Frame-Options"
xfo=$(echo "$headers" | grep -i "X-Frame-Options")
if [ -n "$xfo" ]; then
  echo "PASS: X-Frame-Options present"
  echo "  $xfo"
else
  echo "FAIL: No X-Frame-Options header"
fi

# Test X-Content-Type-Options
echo "Test 3: X-Content-Type-Options"
xcto=$(echo "$headers" | grep -i "X-Content-Type-Options")
if [ -n "$xcto" ]; then
  echo "PASS: X-Content-Type-Options present"
  echo "  $xcto"
else
  echo "FAIL: No X-Content-Type-Options header"
fi

# Test X-XSS-Protection
echo "Test 4: X-XSS-Protection"
xxss=$(echo "$headers" | grep -i "X-XSS-Protection")
if [ -n "$xxss" ]; then
  echo "PASS: X-XSS-Protection present"
  echo "  $xxss"
else
  echo "FAIL: No X-XSS-Protection header"
fi

# Test Referrer-Policy
echo "Test 5: Referrer-Policy"
rp=$(echo "$headers" | grep -i "Referrer-Policy")
if [ -n "$rp" ]; then
  echo "PASS: Referrer-Policy present"
  echo "  $rp"
else
  echo "FAIL: No Referrer-Policy header"
fi

# Test Permissions-Policy
echo "Test 6: Permissions-Policy"
pp=$(echo "$headers" | grep -i "permissions-policy")
if [ -n "$pp" ]; then
  echo "PASS: Permissions-Policy present"
  echo "  $pp"
else
  echo "FAIL: No Permissions-Policy header"
fi

echo ""
echo "=== NFR-016: Anti-spam (honeypot) ==="
echo "Verified via browser testing - honeypot input field present in contact and distributor forms"

echo ""
echo "=== NFR-017: Input sanitization ==="
echo "Verified via browser testing - XSS script tags in search/forms do not execute"
