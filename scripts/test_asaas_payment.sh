#!/bin/bash

# Script de teste da integração ASAAS
# Use este script para testar a criação de pagamentos

API_URL="http://localhost:3000/api/payment/asaas"
TEST_EMAIL="teste@example.com"
TEST_NAME="Teste"

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Teste de Integração ASAAS ===${NC}\n"

# Teste 1: Criar pagamento Pro
echo -e "${YELLOW}1. Testando criação de pagamento - Plano Pro${NC}"
response=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"planId\": \"1000\",
    \"planValue\": 19.90,
    \"userEmail\": \"$TEST_EMAIL\",
    \"userName\": \"$TEST_NAME\"
  }")

echo "Response:"
echo "$response" | jq . 2>/dev/null || echo "$response"

# Extrair paymentId se sucesso
paymentId=$(echo "$response" | jq -r '.paymentId // empty' 2>/dev/null)

if [ ! -z "$paymentId" ]; then
  echo -e "${GREEN}✓ Pagamento criado com sucesso!${NC}"
  echo -e "ID: ${GREEN}$paymentId${NC}\n"

  # Teste 2: Verificar status do pagamento
  echo -e "${YELLOW}2. Verificando status do pagamento${NC}"
  status_response=$(curl -s -X GET "$API_URL?paymentId=$paymentId")
  
  echo "Response:"
  echo "$status_response" | jq . 2>/dev/null || echo "$status_response"
  
  status=$(echo "$status_response" | jq -r '.status // empty' 2>/dev/null)
  if [ ! -z "$status" ]; then
    echo -e "${GREEN}✓ Status obtido: $status${NC}\n"
  else
    echo -e "${RED}✗ Erro ao obter status${NC}\n"
  fi
else
  echo -e "${RED}✗ Erro ao criar pagamento${NC}"
  echo -e "Verifique se:"
  echo -e "  1. O servidor está rodando em http://localhost:3000"
  echo -e "  2. A variável ASAAS_API_KEY está configurada no .env.local"
  echo ""
fi

# Teste 3: Testar diferentes valores
echo -e "${YELLOW}3. Testando diferentes planos${NC}"

declare -a plans=(
  "100|0|Free"
  "1000|19.90|Pro"
  "10000|49.90|Business"
  "999999|99.90|Enterprise"
)

for plan in "${plans[@]}"; do
  IFS='|' read -r id value name <<< "$plan"
  
  if [ "$value" != "0" ]; then
    echo -n "  Plano $name (R\$ $value)... "
    response=$(curl -s -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -d "{
        \"planId\": \"$id\",
        \"planValue\": $value,
        \"userEmail\": \"${name,,}@test.local\",
        \"userName\": \"$name\"
      }")
    
    if echo "$response" | jq '.success' 2>/dev/null | grep -q "true"; then
      echo -e "${GREEN}✓${NC}"
    else
      echo -e "${RED}✗${NC}"
    fi
  fi
done

echo -e "\n${YELLOW}=== Teste Concluído ===${NC}\n"
