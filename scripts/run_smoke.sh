#!/usr/bin/env bash
set -euo pipefail
URL="http://localhost:3001"
CJ="/tmp/aria_cookies.txt"

echo "--- CSRF raw ---"
curl -s -i "$URL/api/auth/csrf" || true
csrf=$(curl -s "$URL/api/auth/csrf" | jq -r .csrfToken || true)
echo "csrf=[${csrf}]"

if [[ -n "$csrf" && "$csrf" != "null" ]]; then
  echo "--- Login (credentials) ---"
  curl -s -i -c "$CJ" -b "$CJ" -X POST "$URL/api/auth/callback/credentials" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode "csrfToken=$csrf" \
    --data-urlencode "email=auth@example.com" \
    --data-urlencode "password=password123" \
    --data-urlencode "json=true" || true
else
  echo "no csrf, skip login"
fi

echo "--- Create prompt (auth) ---"
curl -s -i -c "$CJ" -b "$CJ" -X POST -H "Content-Type: application/json" -d '{"title":"smoke","content":"testing auth"}' "$URL/api/prompts" || true

echo "--- List prompts (GET) ---"
curl -s "$URL/api/prompts" | jq . || true

echo "--- Verify via Prisma ---"
node -e "const {PrismaClient}=require('@prisma/client');(async()=>{const p=new PrismaClient();const user=await p.user.findUnique({where:{email:'auth@example.com'}});if(!user){console.log('user not found');await p.$disconnect();process.exit(0);}const prompts=await p.prompt.findMany({where:{userId:user.id}});console.log('prompts count:',prompts.length);console.log(prompts);await p.$disconnect();})()" || true
