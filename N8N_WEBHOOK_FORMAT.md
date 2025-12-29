# N8N Webhook - Formato de Requisição

## Requisição Enviada Após Pagamento Confirmado

Quando um pagamento é confirmado via ASAAS, o sistema envia uma requisição para o webhook do n8n no seguinte formato:

### URL
```
POST https://n8n-panel.aria.social.br/webhook/manage
```

### Headers
```
Content-Type: application/json
```

### Body (Exemplo)
```json
{
  "operation": "PAYMENT_RECEIVED",
  "payment": {
    "value": 19.90,
    "externalReference": "usuario example.com"
  },
  "instanceName": "usuario example.com"
}
```

## Detalhes dos Campos

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `operation` | string | Tipo de operação | `"PAYMENT_RECEIVED"` |
| `payment.value` | number | Valor do pagamento | `19.90` |
| `payment.externalReference` | string | Email do usuário (sem @) | `"usuario example.com"` |
| `instanceName` | string | Nome da instância (mesmo que email) | `"usuario example.com"` |

## Fluxo Completo de Integração

```
1. Usuário clica "Fazer Upgrade" → PaymentModal abre
   ↓
2. Usuário clica "Gerar PIX" → POST /api/payment/asaas
   ↓
3. Sistema chama ASAAS API → PIX gerado
   ↓
4. QR Code é exibido → Usuário paga
   ↓
5. Pagamento confirmado → ASAAS envia webhook
   ↓
6. POST /api/payment/webhook processa webhook
   ↓
7. Extrai dados e envia para n8n:
   POST /webhook/manage com dados acima
   ↓
8. n8n processa o PAYMENT_RECEIVED
   - Atualiza plano do usuário
   - Envia confirmação por email (opcional)
   - Registra transação (opcional)
   ↓
9. Sistema refaz GET_PLAN e atualiza UI
```

## Transformação de Email

O email é processado da seguinte forma:

```
Email original:  usuario@example.com
                        ↓ (remove @)
Email processado: usuario example.com

Exemplos:
- joao@gmail.com          → joao gmail.com
- maria.silva@company.br  → maria.silva company.br
- admin@aria.social.br    → admin aria.social.br
```

## Valores dos Planos

Conforme enviado:

| Plano | Valor | externalReference |
|-------|-------|-------------------|
| Pro | 19.90 | email (sem @) |
| Business | 49.90 | email (sem @) |
| Enterprise | 99.90 | email (sem @) |

## Observações

1. **Garantia de Entrega**: O webhook é enviado apenas uma vez quando o pagamento é confirmado
2. **Timeout**: A requisição tem timeout padrão de 30 segundos
3. **Retry**: Se falhar, o sistema faz até 3 tentativas (com intervals crescentes)
4. **Logs**: Verifique os logs em `/api/payment/webhook` para troubleshooting

## Exemplo de Integração n8n

Quando n8n recebe a requisição, espera:

```json
{
  "operation": "PAYMENT_RECEIVED",
  "payment": {
    "value": 49.90,
    "externalReference": "joao gmail.com"
  },
  "instanceName": "joao gmail.com"
}
```

N8n pode então:
- Buscar o usuário pelo email
- Atualizar seu plano
- Enviar confirmação por email
- Registrar a transação
- Gerar nota fiscal (se necessário)

## Monitoramento

Para monitorar os webhooks:

1. **No ASAAS Dashboard**:
   - Configurações → Integrações → Webhooks
   - Clique no webhook e veja o histórico de envios

2. **No Servidor Next.js**:
   - Verificar logs em `/api/payment/webhook`
   - Response HTTP indica sucesso (200) ou erro

3. **No n8n**:
   - Webhook executions
   - Logs de cada execução

## Configuração do Webhook no ASAAS (Produção)

1. URL: `https://seu-dominio.com/api/payment/webhook`
2. Evento: `Pagamento confirmado` (payment.confirmed)
3. Método: POST
4. Content-Type: application/json
