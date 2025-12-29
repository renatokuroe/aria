#!/bin/bash

# Teste de pagamento com cartão de crédito
# Usando dados de teste do ASAAS Sandbox

API_URL="http://localhost:3000/api/payment/asaas"

# Dados de teste
PLAN_ID="plan_pro"
PLAN_VALUE="29.90"
USER_EMAIL="test@example.com"
USER_NAME="Teste User"

# Cartão de teste ASAAS (Mastercard - Aprova no Sandbox)
CARD_NUMBER="5162306219378829"
CARD_EXPIRY_MONTH="05"
CARD_EXPIRY_YEAR="27"  # Ano válido 2027
CARD_CVV="318"

# Dados do titular (CPF válido para teste)
CARD_HOLDER_NAME="Marcelo Henrique Almeida"
CARD_CPF="24971563792"
CARD_EMAIL="marcelo@example.com"
CARD_PHONE="4738010919"
CARD_CEP="89223005"
ADDRESS_NUMBER="277"

echo "📊 Testando pagamento com cartão..."
echo "================================================"

RESPONSE=$(curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "planId": "$PLAN_ID",
  "planValue": $PLAN_VALUE,
  "userEmail": "$USER_EMAIL",
  "userName": "$USER_NAME",
  "cardNumber": "$CARD_NUMBER",
  "cardExpiryMonth": "$CARD_EXPIRY_MONTH",
  "cardExpiryYear": "$CARD_EXPIRY_YEAR",
  "cardCvv": "$CARD_CVV",
  "cardHolderName": "$CARD_HOLDER_NAME",
  "cardCpf": "$CARD_CPF",
  "cardEmail": "$CARD_EMAIL",
  "cardPhone": "$CARD_PHONE",
  "cardCep": "$CARD_CEP",
  "addressNumber": "$ADDRESS_NUMBER"
}
EOF
)

echo "Resposta:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

echo ""
echo "================================================"
echo "✓ Teste completo!"
