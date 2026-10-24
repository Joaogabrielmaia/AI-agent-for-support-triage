# Sprint 3

[← Índice do ciclo de vida](../README.md) · [← Sprints](README.md) · [02 · Planejamento](../02-planejamento-e-scrum.md)

**Período (calendário acadêmico):** 05/10 a 16/10/2026. **Objetivo:** tornar a qualidade visível e provar que funciona.

## Escopo
HU-05, HU-06, HU-07 e a bateria de testes e evidências. Fecha a v1.0.0.

## Entregáveis
| Entrega | Requisitos |
|---|---|
| Avaliação "correta/incorreta" em chamados e em conversas resolvidas pelo agente | RF-09 |
| Painel, lacunas e tela do relatório de avaliação | RF-10 a RF-12 |
| Testes unitários, de integração, de segurança, de paridade com o pgvector e E2E | RN-02 a RN-09 |
| 13 prints gerados por script | — |
| Rodada 3 de avaliação (2 trechos por artigo) | RF-12 |

## Critérios de conclusão
- Testes passando e logs gravados com data e commit.
- A rodada 3 registrada, inclusive o que piorou.
- Reunião de aceitação com veredito por história.

## Evidência
[Review da sprint 3](../../05-qualidade/sprint-3-review.md), [plano e resultados](../../05-qualidade/plano-e-resultados.md), [relatório da rodada 3](../../04-avaliacao/relatorio-rodada-3.md), [reunião de aceitação](../../05-qualidade/reuniao-de-aceitacao.md), tag `v1.0.0`.

## Registros da sprint
**Planning.** Objetivo de qualidade: toda afirmação do README precisa apontar para um teste, um print ou um relatório.

**Review.** A rodada 3 não mudou o total (43 de 50 e 16 de 20): trocou erros de lugar. A avaliação das conversas sem chamado foi um achado de produto, porque são as que mais precisam de revisão. v1.0.0 aceita com ressalvas registradas.

**Retrospectiva.** Funcionou: rodar o E2E contra o build de produção, que eliminou uma falha intermitente em modo de desenvolvimento. Melhorar: os falsos positivos F01 e F03 pedem segundo sinal de confiança; entraram no roadmap.

Próxima: [Sprint 4](sprint-4.md).
