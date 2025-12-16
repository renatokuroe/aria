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

## 📝 Licença

MIT

