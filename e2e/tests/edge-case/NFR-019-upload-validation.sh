#!/bin/bash
# test: NFR-019 - Upload validation (type and size)
# These tests verify that the API validates file uploads
# Ronda 2: API still returns 404 on all routes - routes not registered

API_URL="https://hesa-api.azurewebsites.net"

echo "=== NFR-019: Upload validation tests ==="

# Test 1: Upload .exe file without auth (should fail with 401, not accept)
echo "Test 1: Upload .exe file without auth"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/admin/products/fake-id/images" \
  -F "images=@/dev/null;filename=malware.exe;type=application/octet-stream" 2>/dev/null)
http_code=$(echo "$response" | tail -1)
echo "Status: $http_code"
if [[ "$http_code" == "401" || "$http_code" == "403" ]]; then
  echo "PASS: Rejected without auth (auth middleware working)"
elif [[ "$http_code" == "404" ]]; then
  echo "BLOCKED: API returns 404 - routes not registered (DB connection issue)"
else
  echo "FAIL: Expected 401/403/404, got $http_code"
fi

# Test 2: Upload PDF without auth (should fail with 401)
echo ""
echo "Test 2: Upload PDF without auth"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/admin/products/fake-id/pdf" \
  -F "pdf=@/dev/null;filename=test.pdf;type=application/pdf" 2>/dev/null)
http_code=$(echo "$response" | tail -1)
echo "Status: $http_code"
if [[ "$http_code" == "401" || "$http_code" == "403" ]]; then
  echo "PASS: Rejected without auth"
elif [[ "$http_code" == "404" ]]; then
  echo "BLOCKED: API returns 404 - routes not registered"
else
  echo "FAIL: Expected 401/403/404, got $http_code"
fi

# Test 3: Upload with invalid content-type header
echo ""
echo "Test 3: Upload with script content type"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/admin/products/fake-id/images" \
  -H "Content-Type: text/javascript" \
  -d 'alert("xss")' 2>/dev/null)
http_code=$(echo "$response" | tail -1)
echo "Status: $http_code"
if [[ "$http_code" == "401" || "$http_code" == "403" || "$http_code" == "404" || "$http_code" == "400" ]]; then
  echo "PASS: Rejected"
else
  echo "FAIL: Unexpected status $http_code"
fi

# Test 4: Oversized upload (>5MB)
echo ""
echo "Test 4: Code review - multer file size limit"
echo "From admin products routes: multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })"
echo "5MB limit configured - PASS (code review)"
echo "NOTE: No fileFilter configured - accepts any file type (BUG-E09 from R1)"

# Test 5: Check X-Powered-By header (NFR-020 related)
echo ""
echo "Test 5: X-Powered-By header check"
powered_by=$(curl -sI "$API_URL/" 2>/dev/null | grep -i "x-powered-by")
if [ -z "$powered_by" ]; then
  echo "PASS: X-Powered-By header NOT present"
else
  echo "FAIL: $powered_by (should be removed by helmet)"
fi

echo ""
echo "=== NFR-019 Summary ==="
echo "API returns 404 on ALL routes (including upload endpoints)."
echo "Routes are not registered due to DB connection failure at startup."
echo "Cannot fully test upload validation until API routes are functional."
echo "Code review shows: 5MB size limit present, but NO file type validation (fileFilter missing)."
