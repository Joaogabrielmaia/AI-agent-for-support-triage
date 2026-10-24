# Sprint 1

[← Índice do ciclo de vida](../README.md) · [← Sprints](README.md) · [02 · Planejamento](../02-planejamento-e-scrum.md)

**Período (calendário acadêmico):** 07/09 a 18/09/2026. **Objetivo:** um agente que busca, responde com fonte e recusa, e uma régua para medi-lo.

## Escopo
HU-01, HU-02 e HU-09. A avaliação entra antes das telas porque, sem ela, cada ajuste do agente seria opinião.

## Entregáveis
| Entrega | Requisitos |
|---|---|
| Base com 31 artigos, chunker por artigo e por seção, embedder local e busca | RF-01 |
| Pipeline com confiança, fontes, recusa, escalonamento e guardrails | RF-02 a RF-05, RN-01 a RN-09 |
| Interface `LlmProvider`, `MockProvider` e `AnthropicProvider` | RF-14 |
| Harness com 50 perguntas, pontuação e relatório; conjunto de validação com 20 | RF-12 |
| Rodadas 1 e 2, varredura de limiar e análise de erros | RF-12, RN-02 |

## Critérios de conclusão
- O agente responde com fonte e recusa o que não sabe, com teste para os dois casos.
- Existe relatório de cada rodada com commit, data, perfil e provedor.
- A análise de erros liga cada ajuste a um erro medido.

## Evidência
Commits `9642275`, `9bb6e4d`, `402ff74` e `df23b60`. [Review da sprint 1](../../05-qualidade/sprint-1-review.md), [relatório da rodada 1](../../04-avaliacao/relatorio-rodada-1.md) (33 de 50), [rodada 2](../../04-avaliacao/relatorio-rodada-2.md) (43 de 50; validação de 14 para 16 de 20).

## Registros da sprint
**Planning.** Escopo fechado em torno da pergunta "o agente erra menos depois de cada mudança?". Decisão de planejamento: escrever o conjunto de validação antes de ajustar o agente.

**Review.** Entregou o núcleo e a régua. Ficaram de fora as execuções com o Claude real, por falta de chave de API, e a ablação da rodada 2, que mudou várias coisas juntas.

**Retrospectiva.** Funcionou: separar o conjunto de validação antes do ajuste, que mostrou +20 pontos no desenvolvimento contra +10 na validação. Melhorar: dois erros de implementação foram pegos pelo harness (um `\d` virado `/d/` e o `fit` do IDF com tokenizador antigo); incluir esses casos nos testes unitários.

Próxima: [Sprint 2](sprint-2.md).
