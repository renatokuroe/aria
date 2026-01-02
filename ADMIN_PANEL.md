# 🔐 Painel Administrativo - Aria

## Visão Geral

O painel administrativo permite gerenciar usuários, visualizar estatísticas do sistema e acompanhar o consumo de recursos.

## 📋 Recursos

- **Dashboard**: Visão geral com estatísticas gerais
- **Gerenciar Usuários**: Listar, editar e deletar usuários
- **Consumo de Mensagens**: Ver prompts criados e leituras de QR code por usuário
- **Créditos**: Gerenciar e adicionar créditos aos usuários
- **Roles**: Definir usuários como admins ou usuários normais

## 🚀 Como Começar

### 1. Listar Usuários Existentes

Para ver todos os usuários cadastrados:

```bash
node scripts/list-users.js
```

### 2. Criar Seu Primeiro Admin

**Opção A: Criar um novo usuário admin**

```bash
node scripts/create-admin.js seu-email@exemplo.com sua-senha "Seu Nome"
```

Exemplo:
```bash
node scripts/create-admin.js admin@aria.com senha123 "Admin Principal"
```

**Opção B: Promover um usuário existente a admin**

```bash
node scripts/make-admin.js seu-email@exemplo.com
```

Exemplo:
```bash
node scripts/make-admin.js usuario-existente@exemplo.com
```

### 3. Acessar o Painel

Após fazer login com uma conta admin, clique no botão **"Admin"** no canto inferior direito do dashboard.

Ou acesse diretamente: `http://localhost:3000/admin`

## 📊 Dashboard Principal

Exibe:
- Total de usuários e novos usuários esta semana
- Total de prompts criados
- Total de leituras de QR code
- Total de créditos distribuídos
- Distribuição de usuários por tipo (admin/user)

## 👥 Gerenciar Usuários

### Visualizar Usuários

A página mostra uma tabela com:
- Email do usuário
- Nome
- Role (admin ou user)
- Créditos disponíveis
- Número de prompts criados
- Número de QR reads

### Editar Usuário

Clique em **"Editar"** para:
- Alterar nome
- Mudar role (user ↔ admin)
- Ajustar quantidade de créditos

### Deletar Usuário

Clique em **"Deletar"** para remover um usuário permanentemente (com confirmação).

## 🔑 Estrutura de Roles

### User
- Acesso ao dashboard regular
- Criar e gerenciar seus próprios prompts
- Ler QR codes
- Consumir créditos

### Admin
- Acesso ao painel administrativo
- Gerenciar todos os usuários
- Visualizar estatísticas do sistema
- Editar e deletar qualquer usuário

## 🔒 Segurança

- ✅ Acesso restrito apenas a usuários logados
- ✅ Verificação de role (admin) em cada requisição da API
- ✅ Middleware protege rotas `/admin`
- ✅ Confirmação para ações destrutivas (delete)

## 📡 API Endpoints (Protegidos)

### GET `/api/admin/users`
Lista todos os usuários com estatísticas de consumo.

**Resposta:**
```json
[
  {
    "id": "user-id",
    "email": "user@example.com",
    "name": "Usuário",
    "role": "user",
    "credits": 100,
    "createdAt": "2024-01-02T10:00:00Z",
    "_count": {
      "prompts": 5,
      "qrReads": 12
    }
  }
]
```

### GET `/api/admin/users/:id`
Obter detalhes completos de um usuário específico.

### PATCH `/api/admin/users/:id`
Atualizar informações do usuário.

**Payload:**
```json
{
  "name": "Novo Nome",
  "role": "admin",
  "credits": 150
}
```

### DELETE `/api/admin/users/:id`
Deletar um usuário.

### GET `/api/admin/stats`
Obter estatísticas gerais do sistema.

**Resposta:**
```json
{
  "totalUsers": 50,
  "totalPrompts": 127,
  "totalQRReads": 456,
  "totalCredits": 5000,
  "newUsersThisWeek": 3,
  "usersByRole": [
    { "role": "user", "_count": 49 },
    { "role": "admin", "_count": 1 }
  ]
}
```

## 🎯 Casos de Uso Comuns

### Adicionar Créditos a um Usuário
1. Vá para "Gerenciar Usuários"
2. Clique em "Editar" ao lado do usuário
3. Aumente o valor no campo "Créditos"
4. Clique "Salvar"

### Promover Usuário a Admin
1. Vá para "Gerenciar Usuários"
2. Clique em "Editar" ao lado do usuário
3. Mude "Role" para "Admin"
4. Clique "Salvar"

### Acompanhar Consumo de Recursos
1. No dashboard principal, veja as estatísticas gerais
2. Em "Gerenciar Usuários", veja "Prompts" e "QR Reads" por usuário
3. Click em "Editar" para ver detalhes completos de consumo

## ⚠️ Importante

- ⚠️ Deletar um usuário remove todos seus dados, prompts e histórico
- ⚠️ Apenas admins podem acessar o painel
- ⚠️ Certifique-se de ter backup antes de operações em massa

## 🔧 Troubleshooting

### "Acesso negado" ao tentar acessar admin
- Verifique se sua conta é admin: `npx ts-node scripts/make-admin.ts seu-email@exemplo.com`
- Faça logout e login novamente para atualizar a sessão

### Usuários não aparecem na lista
- Verifique a conexão com o banco de dados
- Confirme que sua conta é admin

### Erro ao editar usuário
- Verifique se o usuário ainda existe
- Confirme os dados do formulário antes de salvar

## 📝 Próximas Melhorias

- [ ] Exportar dados de usuários em CSV
- [ ] Gráficos de estatísticas ao longo do tempo
- [ ] Sistema de logs de ações admin
- [ ] Busca e filtro de usuários
- [ ] Autenticação de dois fatores para admin
- [ ] Soft delete para usuários
