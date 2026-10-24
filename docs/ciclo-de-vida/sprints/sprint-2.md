# Sprint 2

[← Índice do ciclo de vida](../README.md) · [← Sprints](README.md) · [02 · Planejamento](../02-planejamento-e-scrum.md)

**Período (calendário acadêmico):** 21/09 a 02/10/2026. **Objetivo:** definir o que acontece quando o agente não deve ou não consegue responder.

## Escopo
HU-03, HU-04, HU-08 e HU-10: banco, autenticação, chat, escalonamento e fila.

## Entregáveis
| Entrega | Requisitos |
|---|---|
| Esquema Prisma com pgvector, migração `init` e seed | RF-01 |
| Autenticação com senha em `scrypt`, cookie assinado e papéis | RF-15, RNF-05 |
| Chat do cliente com fontes, recusa e pedido de pessoa | RF-02 a RF-04, RF-08 |
| API de chat com validação Zod e tratamento de falhas | RN-10, RN-11 |
| Fila com filtros, detalhe do chamado e resposta do atendente | RF-06 a RF-08 |

## Critérios de conclusão
- Cliente nunca fica sem resposta, mesmo com falha do modelo ou da busca (RN-10).
- Rotas da equipe exigem login e respeitam papéis, com teste E2E.
- Assuntos sensíveis escalam com categoria, prioridade e motivo.

## Evidência
[Review da sprint 2](../../05-qualidade/sprint-2-review.md), `tests/e2e/staff.spec.ts` e `customer-chat.spec.ts`, prints [03](../../screenshots/03-escalonamento-para-humano.png), [04](../../screenshots/04-fila-do-atendente.png) e [05](../../screenshots/05-detalhe-do-chamado-com-resumo.png).

## Registros da sprint
**Planning.** Escopo definido a partir das reuniões com a líder e o atendente: o que sempre vai a uma pessoa (RN-04) e o que o atendente precisa ver no chamado.

**Review.** A demonstração expôs um defeito de regra: "meus agendamentos sumiram" não era escalado como perda de dados. Corrigido, com teste nas duas ordens das palavras. A tela do chamado ganhou a conversa completa, por pedido do atendente.

**Retrospectiva.** Funcionou: demonstrar a cada sprint com perguntas reais. Melhorar: não ficaram prontos recuperação de senha, limite de tentativas de login e fila de reenvio com o banco fora; entraram como limitações conhecidas.

Próxima: [Sprint 3](sprint-3.md).
