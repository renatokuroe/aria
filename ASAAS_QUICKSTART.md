# 🚀 Guia de Início - Integração ASAAS

## O que foi implementado?

Integração completa do gateway de pagamento **ASAAS** na tela de **Dashboard > Créditos** para permitir que usuários façam upgrade de planos via PIX.

## ⚙️ Passo 1: Configurar a API Key

### 1.1 Obter chave no ASAAS Sandbox
1. Acesse: https://sandbox.asaas.com
2. Faça login (ou crie uma conta se não tiver)
3. Vá para: **Configurações** → **Integrações** → **API**
4. Copie a **API Key** (use a chave Sandbox para testes)

### 1.2 Configurar no projeto
Adicione ao seu arquivo `.env.local`:

```bash
ASAAS_API_KEY="cole_sua_chave_aqui"
```

## 🧪 Passo 2: Testar Localmente

### 2.1 Iniciar o servidor
```bash
npm run dev
# ou yarn dev
```

### 2.2 Acessar a página de créditos
- Acesse: http://localhost:3000/dashboard/credits
- Certifique-se de estar logado

### 2.3 Testar o fluxo de pagamento
1. Clique em **"Fazer Upgrade"** em qualquer plano pago (Pro, Business, Enterprise)
2. Clique em **"Gerar PIX"**
3. Um QR Code será gerado
4. Você pode:
   - Escanear o QR Code com seu celular
   - Ou copiar o código PIX para usar manualmente

### 2.4 Simular pagamento (Sandbox)
No Sandbox do ASAAS você pode:
- Usar a funcionalidade de teste do dashboard
- Usar um banco que suporte teste
- Ou aguardar webhook configurado manualmente

## 📱 Como o fluxo funciona?

```
┌─────────────────────────────────────────────────────────┐
│ 1. Usuário clica em "Fazer Upgrade" (plano pago)       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Modal abre com detalhes e opção de "Gerar PIX"      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Sistema chama ASAAS para gerar PIX                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 4. QR Code + Código PIX são exibidos no modal          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Usuário paga via banco (escaneia ou copia código)   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Após pagamento, clica "Já Paguei - Verificar"       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Sistema consulta status do pagamento no ASAAS       │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │  Pagamento confirmado?              │
        └─────────────────────────────────────┘
                ↙               ↘
              SIM               NÃO
               ↓                 ↓
         Sucesso!         Aguarde pagamento
         Atualiza         ou tente novamente
         plano do
         usuário
```

## 📦 Arquivos Criados/Modificados

### ✅ Novos Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `app/api/payment/asaas/route.ts` | API para criar e verificar pagamentos |
| `app/api/payment/webhook/route.ts` | Webhook recebido do ASAAS |
| `src/components/PaymentModal.tsx` | Modal de pagamento |
| `ASAAS_INTEGRATION.md` | Documentação técnica completa |
| `ASAAS_IMPLEMENTATION.md` | Sumário de implementação |
| `scripts/test_asaas_payment.sh` | Script de teste (opcional) |

### 🔄 Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `app/dashboard/credits/page.tsx` | Integração com PaymentModal |
| `.env.example` | Adicionada variável ASAAS_API_KEY |

## 💡 Exemplos de Uso

### Testar a API diretamente

```bash
# Criar um pagamento
curl -X POST http://localhost:3000/api/payment/asaas \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "1000",
    "planValue": 19.90,
    "userEmail": "usuario@example.com",
    "userName": "Usuário"
  }'

# Resposta esperada:
{
  "success": true,
  "paymentId": "PAG_ID_123456",
  "pixUrl": "https://...",
  "qrCode": "00020126580014...",
  "qrCodeUrl": "https://...",
  "pixCode": "00020126580014...",
  "value": 19.90,
  "expiresAt": "2024-01-01T12:00:00Z"
}
```

### Verificar status de um pagamento

```bash
curl -X GET "http://localhost:3000/api/payment/asaas?paymentId=PAG_ID_123456"

# Resposta:
{
  "id": "PAG_ID_123456",
  "status": "PENDING",
  "value": 19.90,
  "paidDate": null,
  "externalReference": "usuario-example.com"
}
```

## 🔐 Configuração de Webhook (Produção)

Quando estiver em produção, configure o webhook no ASAAS:

1. Acesse: https://dashboard.asaas.com
2. Vá para: **Configurações** → **Integrações** → **Webhooks**
3. Clique em **Novo Webhook**
4. Preencha:
   - **URL:** `https://seu-dominio.com/api/payment/webhook`
   - **Eventos:** Selecione **Pagamento confirmado**
5. Salve

## 📊 Planos Disponíveis

| Plano | Limite | Preço | Método |
|-------|--------|-------|--------|
| **Free** | 100 mensagens | Grátis | Direto (sem pagamento) |
| **Pro** | 1.000 mensagens | R$ 19,90/mês | PIX ASAAS |
| **Business** | 10.000 mensagens | R$ 49,90/mês | PIX ASAAS |
| **Enterprise** | Ilimitado | R$ 99,90/mês | PIX ASAAS |

## 🆘 Problemas Comuns?

### "Erro: ASAAS_API_KEY não definida"
```bash
# 1. Verifique se a variável existe
echo $ASAAS_API_KEY

# 2. Adicione ao .env.local
ASAAS_API_KEY="sua_chave_aqui"

# 3. Reinicie o servidor Next.js
# Pressione Ctrl+C e rode novamente: npm run dev
```

### "Erro ao criar pagamento"
- Verifique se a **API Key** está correta
- Confirme que está usando a chave do **Sandbox** (não Produção)
- Verifique os logs do servidor (terminal)

### "PIX não aparece no modal"
- Pode ser um erro na geração do QR Code pelo ASAAS
- O código PIX (texto) sempre deve aparecer
- Tente novamente em alguns segundos

## 📞 Suporte e Documentação

- **Documentação ASAAS**: https://docs.asaas.com
- **Dashboard ASAAS**: https://dashboard.asaas.com
- **Documentação Local**: Veja `ASAAS_INTEGRATION.md` e `ASAAS_IMPLEMENTATION.md`

## ✨ Próximos Passos Recomendados

1. Testar em produção com a API Key de produção do ASAAS
2. Configurar webhook em produção
3. Adicionar notificações por email após pagamento
4. Implementar histórico de transações no banco de dados
5. Adicionar suporte a cartão de crédito (além de PIX)
6. Criar dashboard de admin para gerenciar transações

---

**Dúvidas?** Consulte a documentação técnica em `ASAAS_INTEGRATION.md` ou entre em contato com o suporte ASAAS.
