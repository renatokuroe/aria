# Integração ASAAS - Sumário de Implementação

## ✅ Arquivos Criados

### 1. **API Routes**

#### [app/api/payment/asaas/route.ts](app/api/payment/asaas/route.ts)
- POST: Criar pagamento PIX via ASAAS
- GET: Verificar status de um pagamento
- Retorna QR Code e código PIX para o cliente
- Requisição para n8n após pagamento confirmado

#### [app/api/payment/webhook/route.ts](app/api/payment/webhook/route.ts)
- POST: Webhook recebido do ASAAS
- Processa confirmação de pagamento
- Extrai email da referência externa
- Envia request para n8n conforme especificado

### 2. **Componentes**

#### [src/components/PaymentModal.tsx](src/components/PaymentModal.tsx)
- Modal de pagamento reutilizável
- Fluxo completo: geração PIX → exibição QR Code → verificação status
- Suporte a copiar código PIX
- Callbacks para atualizar estado pai
- Validação de email e valores

### 3. **Páginas Atualizadas**

#### [app/dashboard/credits/page.tsx](app/dashboard/credits/page.tsx)
- Integração do PaymentModal
- Fluxo de upgrade direto para plano Free
- Fluxo de pagamento para planos pagos
- Callback para atualizar plano após confirmação
- Mantém compatibilidade com estrutura existente

### 4. **Configuração**

#### [.env.example](.env.example)
- Adicionada variável `ASAAS_API_KEY`

## 🔧 Configuração Necessária

### 1. Obter API Key ASAAS
```bash
1. Acesse https://sandbox.asaas.com
2. Login com sua conta
3. Vá para: Configurações > Integrações > API
4. Copie a chave API (Use a Sandbox para testes)
```

### 2. Configurar Variável de Ambiente
```bash
# .env.local
ASAAS_API_KEY="sua_chave_aqui"
```

### 3. Configurar Webhook no ASAAS (Produção)
```
Dashboard ASAAS > Configurações > Integrações > Webhooks
URL: https://seu-dominio.com/api/payment/webhook
Eventos: Pagamento confirmado (payment.confirmed)
```

## 📋 Fluxo de Pagamento

```
1. Usuário clica "Fazer Upgrade" em plano pago
   ↓
2. Modal abre com detalhes do plano
   ↓
3. Usuário clica "Gerar PIX"
   ↓
4. Sistema chama POST /api/payment/asaas
   ↓
5. ASAAS gera código PIX + QR Code
   ↓
6. Modal exibe QR Code e código PIX
   ↓
7. Usuário escaneia/copia e paga no banco
   ↓
8. Após confirmação no banco:
   - ASAAS envia webhook para /api/payment/webhook
   - Sistema processa e envia para n8n:
     {
       "operation": "PAYMENT_RECEIVED",
       "payment": {
         "value": 19.90,
         "externalReference": "usuario email"
       },
       "instanceName": "usuario email"
     }
   ↓
9. Sistema atualiza plano do usuário
   ↓
10. Modal fecha e exibe mensagem de sucesso
```

## 💰 Planos Configurados

| Plano | Mensagens | Preço | Fluxo |
|-------|-----------|-------|-------|
| Free | 100 | R$ 0 | Direto (sem ASAAS) |
| Pro | 1.000 | R$ 19,90 | PIX ASAAS |
| Business | 10.000 | R$ 49,90 | PIX ASAAS |
| Enterprise | Ilimitado | R$ 99,90 | PIX ASAAS |

## 🧪 Teste Local

### Sem API Real (Mock)
Modificar a URL de sandbox para um mock server se quiser testar sem conectar ao ASAAS:

```bash
# Não é necessário configurar ASAAS_API_KEY para testes mock
# O sistema retornará erro amigável se não estiver configurada
```

### Com API ASAAS Sandbox
```bash
# 1. Configure ASAAS_API_KEY no .env.local
# 2. Rode o servidor
npm run dev

# 3. Abra http://localhost:3000/dashboard/credits
# 4. Clique em "Fazer Upgrade" em um plano pago
# 5. Clique em "Gerar PIX"
# 6. QR Code e código PIX serão exibidos

# 7. Para testar pagamento no Sandbox ASAAS:
# - Use a funcionalidade de teste do dashboard ASAAS
# - Ou use um banco que suporte sandbox
```

### Script de Teste
```bash
chmod +x scripts/test_asaas_payment.sh
./scripts/test_asaas_payment.sh
```

## 📝 Variáveis de Ambiente

```bash
# .env.local

# Obrigatória para pagamentos reais
ASAAS_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Opcional (automático)
# NEXTAUTH_URL já deve estar configurado
```

## 🔒 Segurança

- ✅ API Key nunca é exposta ao cliente (apenas servidor)
- ✅ Validação de email e valor antes de criar pagamento
- ✅ Webhook valida payload do ASAAS
- ✅ Referência externa usa email do usuário
- ⚠️ **TODO em produção:** Adicionar assinatura HMAC no webhook

## 🐛 Troubleshooting

### "ASAAS_API_KEY não definida"
```bash
# Verificar se variável existe
echo $ASAAS_API_KEY

# Adicionar ao .env.local
ASAAS_API_KEY="sua_chave_aqui"

# Reiniciar servidor
```

### "Erro ao criar pagamento"
- Verifique se API Key está correta
- Verifique logs: `console` do navegador + terminal
- Teste em https://sandbox.asaas.com

### Pagamento não atualiza
- Webhook pode não estar configurado
- Verifique se URL webhook é acessível
- Logs no dashboard ASAAS > Webhooks

## 📚 Documentação Completa

Veja [ASAAS_INTEGRATION.md](ASAAS_INTEGRATION.md) para documentação detalhada.

## 🚀 Próximos Passos

1. **Adicionar Assinatura HMAC** no webhook para maior segurança
2. **Persistir histórico de pagamentos** no banco de dados
3. **Suportar múltiplos métodos** de pagamento (cartão de crédito)
4. **Notificações por email** após pagamento confirmado
5. **Dashboard de transações** para usuários/admin
6. **Cancelamento de assinaturas** para planos recorrentes

## 📞 Suporte

- ASAAS: https://docs.asaas.com/
- Dashboard: https://dashboard.asaas.com
- GitHub Issues: [seu repositório]
