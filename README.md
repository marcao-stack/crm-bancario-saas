# CRM Bancário SaaS - Plataforma de Gestão de Propostas Financeiras

Uma plataforma corporativa moderna e altamente estruturada para gestão de crédito, propostas financeiras e relacionamento com clientes. Desenvolvida com arquitetura SaaS profissional, suportando múltiplos níveis de acesso e automação de workflows.

## 🎯 Visão Geral

O **CRM Bancário SaaS** centraliza a gestão de clientes, propostas, bancos parceiros e comunicações em uma única plataforma intuitiva. Com design Swiss Style e controle de acesso baseado em papéis (RBAC), oferece uma experiência moderna e segura para equipes de diferentes níveis.

### Funcionalidades Principais

- **Dashboard em Tempo Real**: KPIs, gráficos de desempenho e resumo de atividades
- **Gestão de Clientes**: Cadastro completo, timeline de interações, upload de documentos
- **Kanban de Propostas**: 5 etapas (Rascunho, Em Análise, Aprovado, Reprovado, Contratado)
- **Gestão de Bancos**: Cadastro de parceiros, produtos e integração com propostas
- **Relatórios Gerenciais**: Análise financeira, performance de consultores e bancos
- **Links de Autorização Digital**: Assinatura remota com token único e expiração
- **Logs de Auditoria**: Rastreamento completo de ações do sistema
- **RBAC Avançado**: 4 níveis (Admin, Gerente, Consultor, Operador)
- **Notificações**: Sistema de alertas em tempo real

## 🏗️ Arquitetura

### Stack Tecnológico

**Frontend:**
- React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Recharts (visualizações)
- Wouter (roteamento)

**Backend:**
- Express 4 + TypeScript
- tRPC 11 (API type-safe)
- Drizzle ORM

**Banco de Dados:**
- MySQL/TiDB
- 14 tabelas estruturadas

**Autenticação:**
- Manus OAuth
- JWT com cookies seguros

### Estrutura de Diretórios

```
crm-bancario-saas/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── lib/              # Utilitários (tRPC client)
│   │   ├── contexts/         # Contextos React
│   │   ├── App.tsx           # Roteamento principal
│   │   └── index.css         # Design system
│   └── public/               # Arquivos estáticos
├── server/                    # Backend Express
│   ├── routers.ts            # Procedimentos tRPC
│   ├── db.ts                 # Helpers de banco
│   ├── crm.test.ts           # Testes unitários
│   └── _core/                # Framework interno
├── drizzle/                   # Schema e migrations
│   └── schema.ts             # Definição de tabelas
├── shared/                    # Código compartilhado
├── storage/                   # S3 helpers
└── package.json              # Dependências
```

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 22+
- pnpm 10+
- MySQL 8+ ou TiDB

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <repo-url>
   cd crm-bancario-saas
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   # Crie um arquivo .env.local com:
   DATABASE_URL=mysql://user:password@localhost:3306/crm_bancario
   JWT_SECRET=seu-segredo-jwt-aqui
   VITE_APP_ID=seu-app-id-manus
   OAUTH_SERVER_URL=https://api.manus.im
   ```

4. **Execute as migrations**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   pnpm dev
   ```

6. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 📊 Páginas Disponíveis

| Página | Descrição | Acesso |
|--------|-----------|--------|
| **Home** | Landing page com features | Público |
| **Dashboard** | KPIs e gráficos de desempenho | Autenticado |
| **Clientes** | Lista e busca de clientes | Autenticado |
| **Detalhe do Cliente** | Visão completa com timeline e documentos | Autenticado |
| **Propostas** | Kanban com 5 etapas | Autenticado |
| **Bancos** | Gestão de parceiros | Autenticado |
| **Relatórios** | Análise financeira e performance | Autenticado |
| **Auditoria** | Logs de ações do sistema | Admin |
| **Configurações** | Admin, segurança, notificações | Admin |

## 🔐 Controle de Acesso (RBAC)

### 4 Níveis de Acesso

| Papel | Permissões |
|-------|-----------|
| **Admin** | Acesso total, gerenciamento de usuários, configurações |
| **Gerente** | Criar/editar propostas, gerenciar consultores, relatórios |
| **Consultor** | Criar propostas, gerenciar clientes, visualizar relatórios |
| **Operador** | Visualizar dados, criar clientes, suporte operacional |

### Proteção de Rotas

```typescript
// Backend: Proteção com protectedProcedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
  return next({ ctx });
});

// Frontend: Bloqueio de acesso
if (user?.role !== 'admin') {
  return <div>Acesso restrito</div>;
}
```

## 🧪 Testes

### Executar Testes

```bash
# Rodar todos os testes
pnpm test

# Modo watch
pnpm test --watch

# Com cobertura
pnpm test --coverage
```

### Cobertura de Testes

- ✅ 24 testes unitários (todos passando)
- ✅ Autenticação e logout
- ✅ CRUD de clientes, propostas, bancos
- ✅ Validação de RBAC
- ✅ Links de autorização digital
- ✅ Notificações

## 📝 Usando a API tRPC

### Exemplo: Listar Clientes

**Frontend:**
```typescript
import { trpc } from "@/lib/trpc";

export function ClientsList() {
  const { data: clients, isLoading } = trpc.clients.list.useQuery({ limit: 50 });
  
  return (
    <div>
      {clients?.map(client => (
        <div key={client.id}>{client.fullName}</div>
      ))}
    </div>
  );
}
```

**Backend:**
```typescript
// server/routers.ts
clients: router({
  list: publicProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return await db.query.clients.findMany({
        limit: input.limit,
      });
    }),
}),
```

## 🎨 Design System (Swiss Style)

### Cores

- **Primária**: Branco (`#FFFFFF`)
- **Acento**: Vermelho vivo (`oklch(0.6 0.25 30)`)
- **Texto**: Preto (`#000000`)
- **Bordas**: Preto 10% opacidade

### Tipografia

- **Font**: Inter sans-serif
- **Headings**: Bold, tracking tight
- **Body**: Regular, 16px, line-height 1.5

### Componentes

Todos os componentes usam `shadcn/ui` com customizações Swiss Style:

```tsx
// Botão com acento vermelho
<Button className="bg-red-600 hover:bg-red-700">Ação</Button>

// Card com borda fina
<Card className="border-black/10">Conteúdo</Card>

// Input com focus ring
<Input className="focus-visible:ring-red-600" />
```

## 📦 Build e Deploy

### Build para Produção

```bash
pnpm build
```

Gera:
- `dist/` - Aplicação compilada
- `dist/index.js` - Servidor Express

### Deploy no Manus

1. Crie um checkpoint via UI
2. Clique em "Publish"
3. Configure domínio customizado (opcional)

## 🔄 Workflow de Desenvolvimento

### 1. Adicionar Nova Entidade

```typescript
// 1. Defina o schema em drizzle/schema.ts
export const proposals = mysqlTable("proposals", {
  id: int("id").autoincrement().primaryKey(),
  // ... campos
});

// 2. Gere migration
pnpm drizzle-kit generate

// 3. Aplique ao banco
pnpm drizzle-kit migrate

// 4. Adicione helpers em server/db.ts
export async function getProposals() {
  return await db.query.proposals.findMany();
}

// 5. Crie procedimento tRPC em server/routers.ts
proposals: router({
  list: publicProcedure.query(({ ctx }) => getProposals()),
}),

// 6. Use no frontend
const { data } = trpc.proposals.list.useQuery();

// 7. Escreva testes em server/crm.test.ts
it("should list proposals", async () => {
  const result = await caller.proposals.list();
  expect(Array.isArray(result)).toBe(true);
});
```

## 🐛 Troubleshooting

### Erro: "Database connection failed"

```bash
# Verifique as variáveis de ambiente
echo $DATABASE_URL

# Teste a conexão MySQL
mysql -u user -p -h localhost
```

### Erro: "RBAC forbidden"

- Verifique o `role` do usuário no banco
- Confirme que o procedimento usa `protectedProcedure`
- Valide o token JWT

### Erro: "Module not found"

```bash
# Limpe cache e reinstale
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📚 Documentação Adicional

- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
2. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
3. Push para a branch: `git push origin feature/nova-funcionalidade`
4. Abra um Pull Request

## 📄 Licença

MIT License - veja LICENSE.md para detalhes

## 📞 Suporte

Para suporte, entre em contato com o time de desenvolvimento ou abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando Manus**
