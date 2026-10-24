# Sprint 4

[← Índice do ciclo de vida](../README.md) · [← Sprints](README.md) · [02 · Planejamento](../02-planejamento-e-scrum.md)

**Período (calendário acadêmico):** 19/10 a 23/10/2026. **Objetivo:** fechar o ciclo entre lacunas da base e conteúdo novo (v1.1).

## Escopo
HU-11, vinda da retrospectiva da v1.0: lacunas repetidas viram rascunho de artigo.

## Entregáveis
| Entrega | Requisitos |
|---|---|
| Rascunho de artigo a partir de lacuna com 2 ou mais ocorrências | RF-13, RN-12 |
| Método `draftArticle` no `LlmProvider`, sem fatos inventados | RF-14 |
| Tabela `ArticleSuggestion` e migração | — |
| Página de sugestões (aceitar ou descartar) e print 13 | RF-13 |
| Correção do agrupamento de lacunas | RF-11 |

## Critérios de conclusão
- O rascunho traz só as perguntas reais e campos `[PREENCHER]`.
- Sem sugestão duplicada pendente (RN-12).
- Testes unitários e E2E da v1.1.

## Evidência
[PR da v1.1](../../06-pos-lancamento/pr-v1.1.md), [CHANGELOG](../../../CHANGELOG.md), tag `v1.1.0`, print [13](../../screenshots/13-sugestao-de-artigo-v1.1.png).

## Registros da sprint
**Planning.** Escopo pequeno e isolado, para não reabrir o núcleo do agente.

**Review.** Entregue com 4 testes unitários e 2 E2E novos. O texto do rascunho com o Claude real não foi exercitado, por falta de chave.

**Retrospectiva.** Funcionou: um item Could só entrou depois que a retrospectiva o sustentou. Melhorar: o agrupamento de lacunas continua lexical.

Próximo: [09 · Evolução e roadmap](../09-evolucao-e-roadmap.md).
