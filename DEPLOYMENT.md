# Guia de Deployment - CRM Bancário SaaS

Instruções completas para fazer deploy da aplicação em diferentes ambientes.

## 📋 Índice

1. [Deployment no Manus](#deployment-no-manus)
2. [Deployment em Produção](#deployment-em-produção)
3. [Variáveis de Ambiente](#variáveis-de-ambiente)
4. [Banco de Dados](#banco-de-dados)
5. [Troubleshooting](#troubleshooting)

---

## Deployment no Manus

O Manus fornece hosting integrado com suporte a domínios customizados.

### Pré-requisitos

- Projeto criado no Manus
- Checkpoint salvo
- Variáveis de ambiente configuradas

### Passos

1. **Crie um Checkpoint**
   ```bash
   # No Management UI, clique em "Save Checkpoint"
   # ou via CLI (se disponível)
   ```

2. **Acesse o Management UI**
   - Clique no botão "Publish" no header
   - Ou vá para Dashboard → Publish

3. **Configure o Domínio**
   - Domínio automático: `seu-app.manus.space`
   - Domínio customizado: Configure em Settings → Domains

4. **Monitore o Deploy**
   - Status em tempo real no Dashboard
   - Logs disponíveis em More → View Docs

### Rollback

Se houver problemas após deploy:

1. Vá para Management UI → Version History
2. Selecione um checkpoint anterior
3. Clique "Rollback"
4. Republique

---

## Deployment em Produção

Para deploy em servidores próprios ou plataformas como Railway, Render, Vercel.

### Build

```bash
# Instale dependências
pnpm install

# Build da aplicação
pnpm build

# Saída em:
# - dist/ (aplicação compilada)
# - dist/index.js (servidor Express)
```

### Variáveis de Ambiente Obrigatórias

```bash
# Banco de dados
DATABASE_URL=mysql://user:password@host:3306/crm_bancario

# Autenticação
JWT_SECRET=seu-segredo-jwt-aleatorio-e-forte
VITE_APP_ID=seu-app-id-manus
OAUTH_SERVER_URL=https://api.manus.im

# Informações do proprietário
OWNER_NAME="Nome do Proprietário"
OWNER_OPEN_ID=seu-open-id

# APIs internas
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua-chave-frontend

# OAuth Portal
VITE_OAUTH_PORTAL_URL=https://auth.manus.im

# Analytics (opcional)
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu-website-id
```

### Docker

Crie um `Dockerfile`:

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Copie arquivos
COPY package.json pnpm-lock.yaml ./
COPY . .

# Instale dependências
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Build
RUN pnpm build

# Expose porta
EXPOSE 3000

# Start
CMD ["node", "dist/index.js"]
```

Build e run:

```bash
docker build -t crm-bancario .
docker run -p 3000:3000 \
  -e DATABASE_URL=mysql://... \
  -e JWT_SECRET=... \
  crm-bancario
```

### Docker Compose

Crie um `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: mysql://root:password@mysql:3306/crm_bancario
      JWT_SECRET: ${JWT_SECRET}
      VITE_APP_ID: ${VITE_APP_ID}
      OAUTH_SERVER_URL: https://api.manus.im
    depends_on:
      - mysql

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: crm_bancario
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

Run:

```bash
docker-compose up -d
```

### Railway

1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Railway detectará automaticamente o `package.json`
4. Deploy automático

### Render

1. Crie um novo Web Service
2. Conecte o repositório
3. Configure:
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `node dist/index.js`
4. Adicione variáveis de ambiente
5. Deploy

### Vercel (Frontend Only)

Se quiser separar frontend e backend:

```bash
# Build apenas frontend
pnpm build:client
```

---

## Variáveis de Ambiente

### Desenvolvimento

Crie `.env.local`:

```bash
DATABASE_URL=mysql://root:password@localhost:3306/crm_bancario
JWT_SECRET=dev-secret-key-change-in-production
VITE_APP_ID=dev-app-id
OAUTH_SERVER_URL=https://api.manus.im
OWNER_NAME="Dev Owner"
OWNER_OPEN_ID=dev-open-id
```

### Produção

Use variáveis de ambiente do servidor:

```bash
export DATABASE_URL=mysql://prod_user:strong_password@prod_host:3306/crm_bancario
export JWT_SECRET=$(openssl rand -base64 32)
export VITE_APP_ID=prod-app-id
# ... outras variáveis
```

### Segurança

- **JWT_SECRET**: Mínimo 32 caracteres aleatórios
- **DATABASE_URL**: Use credenciais fortes
- **Nunca** commite `.env` no git

---

## Banco de Dados

### Migrations

Antes de fazer deploy, execute as migrations:

```bash
# Gere migrations a partir do schema
pnpm drizzle-kit generate

# Aplique ao banco
pnpm drizzle-kit migrate
```

### Backup

```bash
# Backup do MySQL
mysqldump -u user -p database > backup.sql

# Restore
mysql -u user -p database < backup.sql
```

### Monitoramento

```bash
# Conexão ao MySQL
mysql -u user -p -h host database

# Ver tamanho do banco
SELECT table_schema, 
       ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
FROM information_schema.tables
GROUP BY table_schema;

# Ver queries lentas
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

---

## Performance

### Otimizações

1. **Caching**
   ```typescript
   // Implemente cache com Redis
   import { Redis } from 'redis';
   const redis = new Redis();
   ```

2. **Database Indexing**
   ```sql
   CREATE INDEX idx_client_status ON clients(status);
   CREATE INDEX idx_proposal_status ON proposals(status);
   ```

3. **CDN**
   - Use CDN para assets estáticos
   - Configure em Settings → Domains

### Monitoramento

- Monitore CPU, memória e disco
- Configure alertas para downtime
- Revise logs regularmente

---

## SSL/TLS

### Certificado Automático

O Manus fornece certificados SSL automáticos.

### Certificado Customizado

Se usar domínio próprio:

```bash
# Let's Encrypt (gratuito)
certbot certonly --standalone -d seu-dominio.com

# Configure no servidor
cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem /app/cert.pem
cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem /app/key.pem
```

---

## Troubleshooting

### Erro: "Database connection failed"

```bash
# Teste a conexão
mysql -u user -p -h host -e "SELECT 1"

# Verifique DATABASE_URL
echo $DATABASE_URL
```

### Erro: "Port already in use"

```bash
# Mude a porta
PORT=3001 node dist/index.js

# Ou mate o processo
lsof -i :3000
kill -9 <PID>
```

### Erro: "Out of memory"

```bash
# Aumente o limite
NODE_OPTIONS=--max-old-space-size=2048 node dist/index.js
```

### Erro: "CORS blocked"

Verifique `server/_core/index.ts`:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### Erro: "OAuth callback failed"

- Verifique `VITE_APP_ID` e `OAUTH_SERVER_URL`
- Confirme que o callback URL está registrado no Manus
- Teste em `http://localhost:3000/api/oauth/callback`

---

## Checklist de Deploy

- [ ] Todas as migrations executadas
- [ ] Variáveis de ambiente configuradas
- [ ] JWT_SECRET alterado (produção)
- [ ] Banco de dados em backup
- [ ] SSL/TLS configurado
- [ ] Logs habilitados
- [ ] Monitoramento configurado
- [ ] Teste de login realizado
- [ ] Teste de CRUD de clientes
- [ ] Teste de propostas
- [ ] Teste de relatórios
- [ ] Teste de auditoria

---

## Suporte

Para problemas com deployment:

1. Verifique os logs: `docker logs <container-id>`
2. Teste a conexão com o banco
3. Verifique as variáveis de ambiente
4. Consulte a documentação do Manus

---

**Última atualização:** 2026-05-08
