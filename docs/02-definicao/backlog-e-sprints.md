# Backlog em 3 sprints

> **Aviso de honestidade:** isto é um estudo individual. As "sprints" são **agrupamentos lógicos** do backlog, não duas semanas de calendário. Construí em sequência e não tenho medição de esforço por sprint. A coluna "Evidência" aponta commits e testes reais.

## Sprint 1 — Fundação e avaliação
**Objetivo:** ter um agente que busca, responde com fonte e recusa, **e uma régua para medi-lo**.

| Item | Requisitos | Evidência |
|---|---|---|
| Base com 31 artigos, chunker, embedder local, busca | RF-01 | `kb/`, `src/lib/agent/{kb,embedder,store}.ts` |
| Pipeline: confiança, fontes, recusa | RF-02, RF-03, RF-04, RN-01..03 | `pipeline.ts`, testes de confiança |
| Interface `LlmProvider` + `MockProvider` | RF-14 | `providers.ts` |
| Harness: 50 perguntas, script, relatório | RF-12 | `eval/`, `docs/04-avaliacao/` |
| Rodadas 1 e 2 + conjunto de validação | RF-12 | `relatorio-rodada-1.md`, `-2.md` |

## Sprint 2 — Humano no circuito
**Objetivo:** o que acontece quando o agente não deve ou não consegue responder.

| Item | Requisitos | Evidência |
|---|---|---|
| Guardrails de entrada e saída, mascaramento | RN-06..09 | `guardrails.ts`, testes de segurança |
| Escalonamento com categoria e prioridade | RF-05, RN-04, RN-05, RN-10, RN-11 | `escalation.ts`, `pipeline.ts` |
| Banco, migração com pgvector, seed | RF-01 | `prisma/` |
| Autenticação e papéis | RF-15, RNF-05 | `crypto.ts`, `auth.ts` |
| Chat do cliente, fluxo "falar com pessoa" | RF-02..04, RF-08 | `src/app/chat/`, `api/chat` |
| Fila e detalhe do chamado, resposta ao cliente | RF-06, RF-07, RF-08 | `src/app/(staff)/tickets` |

## Sprint 3 — Medir e fechar
**Objetivo:** tornar a qualidade visível e provar que funciona.

| Item | Requisitos | Evidência |
|---|---|---|
| Avaliação das respostas pelo atendente, tela de conversas | RF-09 | `conversas/`, `transcript.tsx` |
| Painel e lacunas | RF-10, RF-11 | `painel/`, `lacunas/`, `metrics.ts` |
| Tela do relatório de avaliação | RF-12 | `avaliacao/` |
| Testes unitários, integração, segurança, paridade pgvector | RN-02..09 | `tests/`, `docs/05-qualidade/` |
| E2E e 13 prints | todos | `tests/e2e/`, `docs/screenshots/` |
| Rodada 3 de avaliação | RF-12 | `relatorio-rodada-3.md` |

## Pós-release
| Item | Requisitos | Evidência |
|---|---|---|
| v1.1: sugestão de artigos a partir de lacunas | RF-13, RN-12 | branch `feat/sugestoes-de-artigos`, tag `v1.1.0`, [PR](../06-pos-lancamento/pr-v1.1.md) |

## Reviews por sprint
- [Sprint 1](../05-qualidade/sprint-1-review.md)
- [Sprint 2](../05-qualidade/sprint-2-review.md)
- [Sprint 3](../05-qualidade/sprint-3-review.md)
