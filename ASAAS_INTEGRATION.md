# Integração ASAAS - Documentação

## Visão Geral

A integração ASAAS foi implementada para gerenciar pagamentos de planos na tela de **Credits & Upgrade**. O sistema permite que usuários paguem por upgrades de planos usando PIX de forma instantânea.

## Configuração

### 1. Variáveis de Ambiente

Adicione a seguinte variável ao seu arquivo `.env` ou `.env.local`:

```bash
ASAAS_API_KEY="sua-chave-api-sandbox-aqui"
```

**Obter a chave API:**
1. Acesse [dashboard.asaas.com](https://dashboard.asaas.com)
2. Faça login com sua conta
3. Vá para **Configurações > Integrações > API**
4. Copie a chave API (use a chave Sandbox para testes)

### 2. Estrutura de Pagamento

O sistema funciona em 3 etapas:

#### Etapa 1: Usuário Seleciona Plano
- Usuário clica em "Fazer Upgrade" em um plano pago
- Modal de pagamento é aberto com os detalhes do plano

#### Etapa 2: Geração do PIX
- Sistema chama `/api/payment/asaas`
- ASAAS gera um código PIX e QR Code
- QR Code é exibido ao usuário (e código PIX para cópia)

#### Etapa 3: Webhook de Confirmação
- Após pagamento confirmado, ASAAS envia notificação para `/api/payment/webhook`
- Sistema processa o webhook e envia requisição para n8n:

```json
{
  "operation": "PAYMENT_RECEIVED",
  "payment": {
    "value": 19.90,
    "externalReference": "usuario email"
  },
  "instanceName": "usuario email"
}
```

## API Routes

### POST `/api/payment/asaas`

**Parâmetros:**
```json
{
  "planId": "1000",
  "planValue": 19.90,
  "userEmail": "usuario@example.com",
  "userName": "Usuário"
}
```

**Resposta:**
```json
{
  "success": true,
  "paymentId": "id-do-pagamento",
  "pixUrl": "url-do-qr-code",
  "qrCode": "id-do-pagamento",
  "value": 19.90,
  "expiresAt": "2024-01-01T12:00:00Z"
}
```

### GET `/api/payment/asaas?paymentId={id}`

Verifica o status de um pagamento.

**Resposta:**
```json
{
  "id": "id-do-pagamento",
  "status": "CONFIRMED",
  "value": 19.90,
  "paidDate": "2024-01-01T12:05:00Z",
  "externalReference": "usuario-email"
}
```

### POST `/api/payment/webhook`

Webhook recebido do ASAAS quando pagamento é confirmado.

## Planos Configurados

| Plano | Mensagens | Preço | ID |
|-------|-----------|-------|-----|
| Free | 100 | R$ 0 | 100 |
| Pro | 1.000 | R$ 19,90 | 1000 |
| Business | 10.000 | R$ 49,90 | 10000 |
| Enterprise | Ilimitado | R$ 99,90 | 999999 |

## Componentes

### PaymentModal (`src/components/PaymentModal.tsx`)

Modal que gerencia todo o fluxo de pagamento:
- Exibe detalhes do plano
- Gera PIX via ASAAS
- Mostra QR Code e código PIX
- Permite verificar status do pagamento

### Credits Page (`app/dashboard/credits/page.tsx`)

Página principal de créditos com:
- Exibição de plano atual
- Lista de planos disponíveis
- Integração com PaymentModal
- Callback para atualizar plano após pagamento

## Fluxo de Testes

1. **Gerar PIX:**
   - Clique em "Fazer Upgrade" em um plano pago
   - Clique em "Gerar PIX"
   - Um PIX será gerado e exibido

2. **Usar Teste PIX Sandbox ASAAS:**
   - Use um banco que suporte sandbox
   - Ou use a funcionalidade de teste da ASAAS

3. **Verificar Pagamento:**
   - Após pagar, clique em "Já Paguei - Verificar"
   - Sistema verificará status junto à ASAAS

4. **Confirmação:**
   - Após confirmação, webhook é disparado
   - Sistema atualiza plano automaticamente

## Webhook ASAAS

Configure o webhook no dashboard ASAAS:

1. Vá para **Configurações > Integrações > Webhooks**
2. Clique em **Novo Webhook**
3. URL: `https://seu-dominio.com/api/payment/webhook`
4. Eventos: Selecione **Pagamento confirmado** (payment.confirmed)

## Segurança

- ✅ API Key armazenada em variável de ambiente
- ✅ Validação de email e valor de plano
- ✅ Webhook sem autenticação (ASAAS usa IP whitelist)
- ⚠️ **TODO:** Adicionar assinatura de webhook para validação extra

## Troubleshooting

### "ASAAS_API_KEY não definida"
- Verifique se a variável está no `.env.local`
- Restart o servidor

### "Erro ao criar pagamento"
- Verifique se a API Key está correta
- Confirme que está usando Sandbox para testes
- Verifique logs do servidor

### Pagamento não atualiza após confirmação
- Webhook pode não estar configurado corretamente
- Verifique logs em Configurações > Webhooks no dashboard ASAAS
- Verifique logs do servidor em `/api/payment/webhook`

## Links Úteis

- [Documentação ASAAS API](https://docs.asaas.com/)
- [Dashboard ASAAS](https://dashboard.asaas.com)
- [Sandbox ASAAS](https://sandbox.asaas.com)
- [GitHub ASAAS SDK](https://github.com/asaasx/asaas-sdk-js)
