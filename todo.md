# CRM Bancário SaaS - TODO

## Fase 1: Arquitetura Base e Schema
- [x] Schema Prisma com todas as entidades (usuários, cargos, clientes, propostas, bancos, workflows, logs)
- [x] Migrations do banco de dados
- [ ] Seed de dados mockados (usuários, bancos, clientes)

## Fase 2: Autenticação e RBAC
- [x] Sistema de cargos (Admin, Gerente, Consultor, Operador)
- [x] Controle de acesso baseado em papéis (RBAC)
- [x] Proteção de rotas por role
- [ ] Página de login e gerenciamento de usuários (Admin)

## Fase 3: Dashboard Principal
- [x] KPIs (total de propostas, taxa de conversão, receita, propostas pendentes)
- [x] Gráficos de desempenho (propostas por status, conversão por banco, receita mensal)
- [x] Resumo de atividades recentes
- [ ] Widgets de operadores ativos

## Fase 4: Gestão de Clientes
- [x] Cadastro completo de clientes (nome, CPF/CNPJ, telefone, email, endereço, etc.)
- [x] Timeline de interações
- [x] Upload de documentos
- [x] Filtros avançados e busca
- [x] Status e tags de clientes

## Fase 5: Gestão de Bancos
- [x] Cadastro de bancos parceiros (nome, logo, status, SLA, taxa de aprovação)
- [x] Listagem e filtros
- [x] Integração com propostas

## Fase 6: Gestão de Propostas - Kanban
- [x] Board Kanban com 5 etapas (Rascunho, Em Análise, Aprovado, Reprovado, Contratado)
- [x] Criação e edição de propostas
- [ ] Drag-and-drop entre colunas
- [x] Histórico de movimentações
- [x] Filtros por status, cliente, banco, consultor

## Fase 7: Sistema de Workflow
- [x] Motor de automação com regras de transição
- [x] Notificações disparadas por mudança de status
- [ ] Escalação automática
- [x] Validações de transição entre etapas

## Fase 8: Links de Autorização Digital
- [x] Geração de token único por proposta
- [x] Link temporário com expiração configurável
- [ ] Página de assinatura digital
- [x] Registro de IP, data/hora e hash de segurança
- [x] Validação de tentativas inválidas

## Fase 9: Comunicação Automatizada
- [x] Notificações internas em tempo real
- [ ] Envio de e-mails por eventos
- [ ] Templates de mensagens
- [x] Central de notificações

## Fase 10: Logs e Auditoria
- [x] Registro de todas as ações (login, alterações, aprovações, exclusões)
- [x] Rastreamento por usuário, data/hora e entidade
- [x] Filtros e busca em logs
- [ ] Exportação de auditoria (LGPD)

## Fase 11: Relatórios
- [x] Relatórios financeiros
- [x] Performance operacional
- [x] Conversão por banco
- [x] Ranking de consultores
- [x] Filtros por período, banco, consultor
- [ ] Exportação em PDF, XLSX, CSV

## Fase 12: Interface Visual (Swiss Style)
- [x] Design system com tipografia sans-serif preta
- [x] Acentos em vermelho vivo em formas quadradas
- [x] Layout limpo e assimétrico com grid rigoroso
- [x] Espaço negativo e linhas divisórias finas
- [x] Responsividade completa
- [ ] Dark mode opcional

## Fase 13: Testes e Validação
- [x] Testes unitários (Vitest)
- [ ] Testes de integração
- [x] Validação de RBAC
- [ ] Performance e segurança

## Fase 14: Admin e Configurações
- [x] Página de Configurações (Admin)
- [x] Gerenciamento de Usuários
- [x] Configurações de Segurança
- [x] Configurações de Notificações
- [ ] Página de Detalhe do Cliente

## Fase 15: Entrega Final
- [x] README detalhado
- [ ] Documentação de API
- [ ] Instruções de deployment
- [x] Dados mockados completos
