# API Documentation - CRM Bancário SaaS

Documentação completa da API tRPC do CRM Bancário SaaS.

## 📋 Índice

1. [Autenticação](#autenticação)
2. [Clientes](#clientes)
3. [Propostas](#propostas)
4. [Bancos](#bancos)
5. [Notificações](#notificações)
6. [Logs de Auditoria](#logs-de-auditoria)
7. [Links de Autorização](#links-de-autorização)
8. [Erros](#erros)

---

## Autenticação

### `auth.me`

Retorna os dados do usuário autenticado.

**Tipo:** `publicProcedure`

**Resposta:**
```typescript
{
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: "admin" | "manager" | "consultant" | "operator";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}
```

**Exemplo:**
```typescript
const { data: user } = trpc.auth.me.useQuery();
console.log(user?.role); // "admin" | "manager" | "consultant" | "operator"
```

### `auth.logout`

Faz logout do usuário.

**Tipo:** `publicProcedure`

**Resposta:**
```typescript
{ success: boolean }
```

**Exemplo:**
```typescript
const logout = trpc.auth.logout.useMutation();
await logout.mutateAsync();
```

---

## Clientes

### `clients.list`

Lista todos os clientes com filtros opcionais.

**Tipo:** `protectedProcedure`

**Parâmetros:**
```typescript
{
  limit?: number;        // Padrão: 50
  offset?: number;       // Padrão: 0
  status?: "prospect" | "active" | "inactive";
  search?: string;       // Busca por nome ou email
}
```

**Resposta:**
```typescript
{
  id: number;
  fullName: string;
  cpfCnpj: string | null;
  email: string | null;
  phone: string | null;
  status: "prospect" | "active" | "inactive";
  creditScore: number | null;
  monthlyIncome: number | null;
  createdAt: Date;
  updatedAt: Date;
}[]
```

**Exemplo:**
```typescript
const { data: clients } = trpc.clients.list.useQuery({
  limit: 20,
  status: "active",
  search: "João"
});
```

### `clients.getById`

Retorna um cliente específico.

**Tipo:** `protectedProcedure`

**Parâmetros:**
```typescript
{ id: number }
```

**Resposta:**
```typescript
{
  id: number;
  fullName: string;
  cpfCnpj: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  rg: string | null;
  status: "prospect" | "active" | "inactive";
  creditScore: number | null;
  monthlyIncome: number | null;
  maritalStatus: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

**Exemplo:**
```typescript
const { data: client } = trpc.clients.getById.useQuery({ id: 123 });
```

### `clients.create`

Cria um novo cliente.

**Tipo:** `protectedProcedure`

**Parâmetros:**
```typescript
{
  fullName: string;
  cpfCnpj: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  rg?: string;
  status?: "prospect" | "active" | "inactive";
  creditScore?: number;
  monthlyIncome?: number;
  maritalStatus?: string;
}
```

**Resposta:**
```typescript
{
  id: number;
  fullName: string;
  // ... outros campos
}
```

**Exemplo:**
```typescript
const create = trpc.clients.create.useMutation();
const newClient = await create.mutateAsync({
  fullName: "João Silva",
  cpfCnpj: "123.456.789-00",
  email: "joao@example.com",
  phone: "(11) 98765-4321",
  status: "prospect"
});
```

### `clients.update`

Atualiza um cliente existente.

**Tipo:** `protectedProcedure`

**Parâmetros:**
```typescript
{
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: "prospect" | "active" | "inactive";
  creditScore?: number;
  monthlyIncome?: number;
  // ... outros campos opcionais
}
```

**Resposta:**
```typescript
{ success: boolean }
```

**Exemplo:**
```typescript
const update = trpc.clients.update.useMutation();
await update.mutateAsync({
  id: 123,
  status: "active",
  creditScore: 750
});
```

### `clients.delete`

Deleta um cliente.

**Tipo:** `protectedProcedure` (apenas Admin/Manager)

**Parâmetros:**
```typescript
{ id: number }
```

**Resposta:**
```typescript
{ success: boolean }
```

---

## Propostas

### `proposals.list`

Lista todas as propostas com filtros.

**Tipo:** `protectedProcedure`

**Parâmetros:**
```typescript
{
  limit?: number;
  offset?: number;
  status?: "draft" | "analysis" | "approved" | "rejected" | "contracted";
  clientId?: number;
  bankId?: number;
  consultantId?: number;
}
```

**Resposta:**
```typescript
{
  id: number;
  number: string;
  clientId: number;
  bankId: number;
  consultantId: number;
  amount: number;
  status: "draft" | "analysis" | "approved" | "rejected" | "contracted";
  createdAt: Date;
  updatedAt: Date;
}[]
```

### `proposals.getById`

Retorna uma proposta específica.

**Tipo:** `protectedProcedure`

**Parâmetros:**
```typescript
{ id: number }
```

**Resposta:**
```typescript
{
  id: number;
  number: string;
  clientId: number;
  bankId: number;
  consultantId: number;
  amount: number;
  interestRate: number;
  term: number;
  status: "draft" | "analysis" | "approved" | "rejected" | "contracted";
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### `proposals.create`

Cria uma nova proposta.

**Tipo:** `protectedProcedure`

**Parâmetros:**
```typescript
{
  clientId: number;
  bankId: number;
  amount: number;
  interestRate: number;
  term: number;
  description?: string;
}
```

**Resposta:**
```typescript
{
  id: number;
  number: string;
  // ... outros campos
}
```

### `proposals.updateStatus`

Atualiza o status de uma proposta.

**Tipo:** `protectedProcedure`

**Parâmetros:**
```typescript
{
  id: number;
  status: "draft" | "analysis" | "approved" | "rejected" | "contracted";
  reason?: string;
}
```

**Resposta:**
```typescript
{ success: boolean }
```

**Exemplo:**
```typescript
const updateStatus = trpc.proposals.updateStatus.useMutation();
await updateStatus.mutateAsync({
  id: 456,
  status: "approved"
});
```

---

## Bancos

### `banks.list`

Lista todos os bancos parceiros.

**Tipo:** `protectedProcedure`

**Parâmetros:**
```typescript
{
  limit?: number;
  offset?: number;
  status?: "active" | "inactive";
}
```

**Resposta:**
```typescript
{
  id: number;
  name: string;
  logo: string | null;
  status: "active" | "inactive";
  approvalRate: number;
  sla: number;
  createdAt: Date;
  updatedAt: Date;
}[]
```

### `banks.getById`

Retorna um banco específico.

**Tipo:** `protectedProcedure`

**Parâmetros:**
```typescript
{ id: number }
```

**Resposta:**
```typescript
{
  id: number;
  name: string;
  logo: string | null;
  status: "active" | "inactive";
  approvalRate: number;
  sla: number;
  minAmount: number;
  maxAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Notificações

### `notifications.list`

Lista notificações do usuário.

**Tipo:** `protectedProcedure`

**Parâmetros:**
```typescript
{
  limit?: number;
  offset?: number;
  read?: boolean;
}
```

**Resposta:**
```typescript
{
  id: number;
  userId: number;
  title: string;
  content: string;
  read: boolean;
  createdAt: Date;
}[]
```

### `notifications.markAsRead`

Marca uma notificação como lida.

**Tipo:** `protectedProcedure`

**Parâmetros:**
```typescript
{ id: number }
```

**Resposta:**
```typescript
{ success: boolean }
```

---

## Logs de Auditoria

### `auditLogs.list`

Lista logs de auditoria (apenas Admin).

**Tipo:** `protectedProcedure` (Admin only)

**Parâmetros:**
```typescript
{
  limit?: number;
  offset?: number;
  userId?: number;
  action?: string;
  startDate?: Date;
  endDate?: Date;
}
```

**Resposta:**
```typescript
{
  id: number;
  userId: number;
  action: string;
  entity: string;
  entityId: number;
  changes: Record<string, any>;
  ipAddress: string | null;
  createdAt: Date;
}[]
```

---

## Links de Autorização

### `authorizationLinks.generate`

Gera um link de autorização para assinatura.

**Tipo:** `protectedProcedure`

**Parâmetros:**
```typescript
{
  proposalId: number;
  expiresIn?: number; // em horas, padrão: 72
}
```

**Resposta:**
```typescript
{
  token: string;
  expiresAt: Date;
  url: string;
}
```

### `authorizationLinks.validate`

Valida um link de autorização.

**Tipo:** `publicProcedure`

**Parâmetros:**
```typescript
{ token: string }
```

**Resposta:**
```typescript
{
  valid: boolean;
  proposalId?: number;
  expiresAt?: Date;
}
```

### `authorizationLinks.sign`

Assina uma proposta através do link de autorização.

**Tipo:** `publicProcedure`

**Parâmetros:**
```typescript
{
  token: string;
  clientName: string;
  clientEmail: string;
}
```

**Resposta:**
```typescript
{ success: boolean }
```

---

## Erros

### Códigos de Erro

| Código | Descrição |
|--------|-----------|
| `UNAUTHORIZED` | Usuário não autenticado |
| `FORBIDDEN` | Usuário não tem permissão |
| `NOT_FOUND` | Recurso não encontrado |
| `BAD_REQUEST` | Dados inválidos |
| `INTERNAL_SERVER_ERROR` | Erro no servidor |

### Exemplo de Erro

```typescript
try {
  await trpc.clients.getById.useQuery({ id: 999 });
} catch (error) {
  if (error.data?.code === 'NOT_FOUND') {
    console.log('Cliente não encontrado');
  }
}
```

---

## Exemplos Completos

### Criar e Atualizar Cliente

```typescript
// Criar cliente
const createClient = trpc.clients.create.useMutation();
const newClient = await createClient.mutateAsync({
  fullName: "Maria Santos",
  cpfCnpj: "987.654.321-00",
  email: "maria@example.com",
  status: "prospect"
});

// Atualizar cliente
const updateClient = trpc.clients.update.useMutation();
await updateClient.mutateAsync({
  id: newClient.id,
  status: "active",
  creditScore: 800
});
```

### Criar Proposta e Gerar Link de Autorização

```typescript
// Criar proposta
const createProposal = trpc.proposals.create.useMutation();
const proposal = await createProposal.mutateAsync({
  clientId: 123,
  bankId: 1,
  amount: 50000,
  interestRate: 8.5,
  term: 36
});

// Gerar link de autorização
const generateLink = trpc.authorizationLinks.generate.useMutation();
const { url } = await generateLink.mutateAsync({
  proposalId: proposal.id,
  expiresIn: 72
});

console.log(`Link de assinatura: ${url}`);
```

### Filtrar e Listar Propostas

```typescript
const { data: proposals } = trpc.proposals.list.useQuery({
  status: "approved",
  bankId: 1,
  limit: 20
});

proposals?.forEach(p => {
  console.log(`${p.number}: R$ ${p.amount}`);
});
```

---

## Rate Limiting

- Limite: 100 requisições por minuto por usuário
- Resetado a cada minuto

## Paginação

Todas as listas suportam paginação:

```typescript
const { data: clients } = trpc.clients.list.useQuery({
  limit: 20,      // Itens por página
  offset: 40      // Pular 40 itens (página 3)
});
```

---

**Última atualização:** 2026-05-08
