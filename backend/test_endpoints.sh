#!/bin/bash

BASE_URL="http://127.0.0.1:8000"

echo "======================================"
echo "🧪 Testing Airbnb Clone API Endpoints"
echo "======================================"

echo -e "\n\n1. Testing GET / (Welcome)"
curl -s $BASE_URL/

echo -e "\n\n2. Testing GET /health"
curl -s $BASE_URL/health

echo -e "\n\n3. Testing GET /listings/"
curl -s $BASE_URL/listings/ | head -c 200
echo "..."

echo -e "\n\n4. Testing GET /listings/1"
curl -s $BASE_URL/listings/1

echo -e "\n\n5. Testing POST /auth/register"
curl -s -X POST $BASE_URL/auth/register -H "Content-Type: application/json" -d '{"email": "testuser'${RANDOM}'@example.com", "password": "testpass", "name": "Test User"}'

echo -e "\n\n6. Testing POST /auth/token (Login)"
TOKEN=$(curl -s -X POST $BASE_URL/auth/token -H "Content-Type: application/x-www-form-urlencoded" -d "username=demo@airbnb.local&password=demopass" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
echo "Token obtained: ${TOKEN:0:15}..."

echo -e "\n\n7. Testing GET /auth/me (Protected Endpoint)"
if [ ! -z "$TOKEN" ]; then
  curl -s -H "Authorization: Bearer $TOKEN" $BASE_URL/auth/me
else
  echo "Failed to obtain token"
fi

echo -e "\n\n======================================"
echo "✅ Done testing!"
echo "======================================"
