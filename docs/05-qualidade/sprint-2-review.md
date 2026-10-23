# Sprint 2 — Review: humano no circuito

> Nota: "sprint" é um agrupamento lógico, não calendário. **Os commits não foram fracionados por sprint:** o app inteiro (sprints 2 e 3) entrou em um commit grande, `137349c`. O histórico não mostra a divisão, e esta página reconstrói a ordem lógica.

**Objetivo:** o que acontece quando o agente não deve ou não consegue responder.

## O que entregou
| Entrega | Requisitos | Onde |
|---|---|---|
| Esquema Prisma com pgvector, migração `init`, seed de usuários, artigos e vetores | RF-01 | `prisma/` |
| Autenticação: senha com `scrypt`, cookie assinado `httpOnly`, papéis, guarda no servidor | RF-15, RNF-05 | `crypto.ts`, `auth.ts` |
| Chat do cliente: fontes recolhíveis, recusa com botão "falar com uma pessoa", estado de erro, polling da resposta humana | RF-02..04, RF-08 | `src/app/chat/` |
| API de chat com validação Zod, `PgVectorStore`, serviço de conversa | RF-02, RN-10, RN-11 | `api/chat`, `conversation.ts` |
| Fila com filtros e ordenação por prioridade, detalhe do chamado, resposta do atendente, mudança de status | RF-06, RF-07, RF-08 | `(staff)/tickets` |

## Decisões e problemas
- **Demo expôs um bug de regra:** "meus agendamentos **sumiram**" (ordem invertida) não era escalado como perda de dados. Corrigi a regex e criei teste com as duas ordens.
- **A guarda de acesso é por página e por ação**, não por middleware, para não depender do runtime de borda para verificar a sessão.
- **A tela do chamado ganhou a conversa completa** ao lado do resumo, por pedido do atendente (reunião 2).

## O que ficou de fora
- Recuperação de senha, limite de tentativas de login, 2FA (ver ADR-009).
- Fila de reenvio quando o banco está fora.

## Evidência
E2E `staff.spec.ts` e `customer-chat.spec.ts`; prints 03, 04 e 05.
