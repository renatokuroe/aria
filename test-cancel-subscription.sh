#!/bin/bash

# Teste de downgrade para Free plan
# Este teste verifica se a lógica de cancelamento está funcionando

API_URL="http://localhost:3000/api/payment/cancel-subscription"

USER_EMAIL="test@example.com"
CURRENT_PLAN_VALUE="19.90"

echo "📊 Testando cancelamento de subscription (downgrade para Free)..."
echo "================================================"

RESPONSE=$(curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "userEmail": "$USER_EMAIL",
  "currentPlanValue": $CURRENT_PLAN_VALUE
}
EOF
)

echo "Resposta:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

echo ""
echo "================================================"
echo "✓ Teste completo!"
