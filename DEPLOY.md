# 🚀 Guia de Deploy em Produção

## 📋 Checklist Pre-Deploy

- [ ] Variáveis de ambiente configuradas (`.env.production`)
- [ ] Banco de dados PostgreSQL criado e acessível
- [ ] Evolution API configurada e testada
- [ ] ADMIN_KEY gerada e segura

## 🔑 Variáveis de Ambiente Obrigatórias

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@host:5432/aria"

# NextAuth
NEXTAUTH_SECRET="chave-secreta-muito-segura"
NEXTAUTH_URL="https://seu-dominio.com"

# Evolution API
EVO_API_KEY="sua-chave-evolution-api"

# Admin
ADMIN_KEY="chave-segura-e-aleatoria-para-criar-admin"
```

## 📝 Gerar ADMIN_KEY Segura

```bash
# MacOS/Linux
openssl rand -hex 32

# Ou online: https://randomkeygen.com/
```

## 🗄️ Setup do Banco de Dados

```bash
# Em produção, execute as migrations
npm run prisma migrate deploy
```

## 👤 Criar Primeiro Admin em Produção

### Opção 1: Via API (Recomendado)

```bash
curl -X POST https://seu-dominio.com/api/admin/create-first-admin \
  -H "Authorization: Bearer SUA_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@exemplo.com",
    "password": "senha-segura",
    "name": "Admin Principal"
  }'
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Admin criado com sucesso",
  "user": {
    "id": "...",
    "email": "admin@exemplo.com",
    "name": "Admin Principal",
    "role": "admin",
    "credits": 1000
  }
}
```

### Opção 2: Via SSH (Se tiver acesso ao servidor)

Se você tem acesso SSH ao servidor de produção:

```bash
# 1. SSH para o servidor
ssh user@seu-servidor.com

# 2. Navegue para o diretório da aplicação
cd /path/to/aria

# 3. Execute o script
node scripts/create-admin.js seu-email@exemplo.com sua-senha "Seu Nome"
```

### Opção 3: Database Client (Último recurso)

Se tiver acesso direto ao banco PostgreSQL:

```sql
-- Gerar hash da senha (use uma ferramenta de hash bcrypt)
-- Exemplo: https://bcrypt-generator.com/

INSERT INTO "User" (id, email, password, name, role, credits, "createdAt")
VALUES (
  'user_' || gen_random_uuid()::text,
  'admin@exemplo.com',
  '$2a$10$...seu-hash-bcrypt...',
  'Admin Principal',
  'admin',
  1000,
  NOW()
);
```

## ✅ Verificar se Admin foi Criado

```bash
# Teste o login
curl -X POST https://seu-dominio.com/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@exemplo.com",
    "password": "senha-segura"
  }'
```

## 🔐 Segurança

### ⚠️ Importante:

1. **ADMIN_KEY** deve ser:
   - ✅ Única e aleatória (mínimo 32 caracteres)
   - ✅ Guardada em local seguro
   - ✅ Nunca commitada no Git
   - ✅ Diferente entre ambientes

2. **Depois de criar o primeiro admin:**
   - Delete a rota `/api/admin/create-first-admin` OU
   - Desative adicionando um middleware que a bloqueia em produção OU
   - Resetting a ADMIN_KEY para um valor inválido

3. **Senhas:**
   - Use senhas fortes (mínimo 12 caracteres)
   - Prefira usar um gerenciador de senhas

## 🔄 Atualizar Admin Existente

Se precisar promover um usuário existente a admin:

```bash
# Via script local (se tiver acesso ao servidor)
node scripts/make-admin.js usuario@exemplo.com

# Via API (crie uma nova rota se necessário)
```

## 📊 Monitorar Deploy

```bash
# Logs da aplicação
pm2 logs aria

# Status da aplicação
pm2 status

# Verificar banco de dados
psql $DATABASE_URL -c "SELECT COUNT(*) as total_users FROM \"User\";"
```

## 🆘 Troubleshooting

### "Erro 401 ao criar admin via API"
- [ ] ADMIN_KEY está correta?
- [ ] Header `Authorization: Bearer KEY` está correto?
- [ ] Variável de ambiente `ADMIN_KEY` está definida?

### "Erro ao conectar banco de dados"
- [ ] DATABASE_URL está correta?
- [ ] Banco PostgreSQL está rodando?
- [ ] Firewall permite conexão?

### "NextAuth não funciona"
- [ ] NEXTAUTH_SECRET está definida?
- [ ] NEXTAUTH_URL é o domínio correto?
- [ ] Certificado SSL está válido?

## 📚 Próximos Passos

1. ✅ Admin criado
2. ✅ Fazer login em `/auth/login`
3. ✅ Acessar painel admin em `/admin`
4. ✅ Gerenciar usuários em `/admin/users`

---

**Dúvidas?** Consulte [ADMIN_PANEL.md](./ADMIN_PANEL.md) para mais detalhes sobre o painel administrativo.
