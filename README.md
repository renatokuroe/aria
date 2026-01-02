# Aria - WhatsApp Bot Management Platform

Sistema de gerenciamento de bots WhatsApp integrado com Evolution API.

## 🚀 Tecnologias

- Next.js 14
- TypeScript
- Prisma ORM
- NextAuth.js
- Chakra UI
- Evolution API

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL (ou outro banco suportado pelo Prisma)
- Conta Evolution API

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd aria
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/aria"
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"
EVO_API_KEY="sua-chave-evolution-api"
ADMIN_KEY="sua-chave-admin"
```

4. Execute as migrations do Prisma:
```bash
npx prisma migrate dev
```

5. **[OPCIONAL] Criar usuário admin:**

Para acessar o painel administrativo, você precisa de uma conta admin. Escolha uma das opções:

**Criar novo admin:**
```bash
node scripts/create-admin.js seu-email@exemplo.com sua-senha "Seu Nome"
```

**Ou promover um usuário existente:**
```bash
node scripts/make-admin.js email-existente@exemplo.com
```

**Listar usuários:**
```bash
node scripts/list-users.js
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📦 Build para Produção

```bash
npm run build
npm start
```

## 🗂️ Estrutura do Projeto

```
aria/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard pages
│   └── qr/               # QR Code pages
├── prisma/                # Prisma schema e migrations
├── src/
│   └── lib/              # Utilitários e configurações
└── public/               # Assets estáticos
```

## 🔐 Segurança

- Nunca commite arquivos `.env`
- Use variáveis de ambiente para credenciais
- A chave `ADMIN_KEY` protege endpoints administrativos

## � API Documentation

### Base URL
```
https://n8n-panel.aria.social.br/webhook/manage
```

### Headers
```
Content-Type: application/json
```

### Operações Disponíveis

#### 1. Criar Instância
Cria uma nova instância para gerenciar um WhatsApp.

```bash
curl -X POST 'https://n8n-panel.aria.social.br/webhook/manage' \
  -H 'Content-Type: application/json' \
  -d '{
    "operation": "CREATE_INSTANCE",
    "apiKey": "YOUR_API_KEY",
    "instanceName": "SEU_NOME_INSTANCIA",
    "phoneNumber": "5511999999999"
  }'
```

#### 2. Configurar Webhooks
Define os webhooks para a instância.

```bash
curl -X POST 'https://n8n-panel.aria.social.br/webhook/manage' \
  -H 'Content-Type: application/json' \
  -d '{
    "operation": "SET_WEBHOOKS",
    "apiKey": "YOUR_API_KEY",
    "instanceName": "SEU_NOME_INSTANCIA"
  }'
```

#### 3. Obter QR Code
Recupera o QR Code para conectar o WhatsApp.

```bash
curl -X POST 'https://n8n-panel.aria.social.br/webhook/manage' \
  -H 'Content-Type: application/json' \
  -d '{
    "operation": "GET_QR_CODE",
    "apiKey": "YOUR_API_KEY",
    "instanceName": "SEU_NOME_INSTANCIA"
  }'
```

#### 4. Definir Prompt (Sistema)
Define o comportamento da IA para a instância.

```bash
curl -X POST 'https://n8n-panel.aria.social.br/webhook/manage' \
  -H 'Content-Type: application/json' \
  -d '{
    "operation": "SET_PROMPT",
    "apiKey": "YOUR_API_KEY",
    "instanceName": "SEU_NOME_INSTANCIA",
    "systemPrompt": "Você é um assistente de atendimento ao cliente educado e eficiente..."
  }'
```

#### 5. Definir Prompt (Encodado)
Para prompts complexos ou com caracteres especiais, use a versão encodada:

```bash
# Se você tiver 'jq' instalado
SYSTEM_PROMPT_ENCODED=$(jq -Rs '.' prompt_temp.txt)

curl -X POST 'https://n8n-panel.aria.social.br/webhook/manage' \
  -H 'Content-Type: application/json' \
  -d "{ \"operation\": \"SET_PROMPT\", \"apiKey\": \"YOUR_API_KEY\", \"instanceName\": \"SEU_NOME_INSTANCIA\", \"systemPrompt\": $SYSTEM_PROMPT_ENCODED }"
```

#### 6. Obter Contagem de Mensagens
Recupera quantas mensagens foram processadas.

```bash
curl -X POST 'https://n8n-panel.aria.social.br/webhook/manage' \
  -H 'Content-Type: application/json' \
  -d '{
    "operation": "GET_MESSAGE_COUNT",
    "apiKey": "YOUR_API_KEY",
    "instanceName": "SEU_NOME_INSTANCIA"
  }'
```

#### 7. Obter Plano
Recupera informações do plano atual da instância.

```bash
curl -X POST 'https://n8n-panel.aria.social.br/webhook/manage' \
  -H 'Content-Type: application/json' \
  -d '{
    "operation": "GET_PLAN",
    "apiKey": "YOUR_API_KEY",
    "instanceName": "SEU_NOME_INSTANCIA"
  }'
```

#### 8. Definir Plano
Define o plano (limites) para a instância.

```bash
curl -X POST 'https://n8n-panel.aria.social.br/webhook/manage' \
  -H 'Content-Type: application/json' \
  -d '{
    "operation": "SET_PLAN",
    "apiKey": "YOUR_API_KEY",
    "instanceName": "SEU_NOME_INSTANCIA",
    "plan": "1000"
  }'
```

### Parâmetros Comuns

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `operation` | string | Tipo de operação a executar |
| `apiKey` | string | Chave de API para autenticação |
| `instanceName` | string | Nome da instância (ID único) |

## �📝 Licença

MIT

