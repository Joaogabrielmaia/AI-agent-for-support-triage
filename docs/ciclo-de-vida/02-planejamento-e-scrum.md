# 02 · Planejamento e Scrum

[← Índice do ciclo de vida](README.md) · [← 01 Visão](01-visao-e-discovery.md) · Próximo: [03 · Requisitos](03-requisitos-e-rastreabilidade.md)

As datas deste documento são o calendário acadêmico do estudo de caso. O repositório não traz story points, velocity nem burndown, e este documento não os apresenta: o acompanhamento é qualitativo, pelos entregáveis de cada sprint. Os backlogs originais estão em [backlog-e-sprints.md](../02-definicao/backlog-e-sprints.md).

## Product Goal
Entregar um agente de triagem que responde apenas com base em artigos citados, recusa o que não sabe, encaminha o restante a uma pessoa com contexto e prova o próprio comportamento com uma avaliação que separa desenvolvimento de validação.

## Product Backlog priorizado
| Ordem | História | MoSCoW | Justificativa da prioridade | Sprint |
|---|---|---|---|---|
| 1 | HU-01 Resposta com fonte | Must | Sem fonte não há produto (RN-01) | 1 |
| 2 | HU-02 Recusa honesta | Must | O medo declarado é a resposta errada | 1 |
| 3 | HU-09 Avaliar com perguntas de teste | Must | Sem régua, cada ajuste é opinião | 1 |
| 4 | HU-08 Proteger dados e regras | Must | Dado de saúde e promessa indevida são riscos de impacto alto | 2 |
| 5 | HU-03 Encaminhar a uma pessoa com contexto | Must | Restrição do financeiro (RN-04) | 2 |
| 6 | HU-10 Entrar com papéis | Must | A fila e o painel exigem acesso por papel | 2 |
| 7 | HU-04 Atender pela fila | Must | Sem fila, o escalonamento não chega ao atendente | 2 |
| 8 | HU-05 Avaliar a resposta do agente | Must | Resposta à preocupação do atendente | 3 |
| 9 | HU-07 Ver lacunas da base | Must | Fecha o ciclo entre recusa e conteúdo | 3 |
| 10 | HU-06 Ver o desempenho (painel) | Should | Útil, mas não bloqueia o atendimento | 3 |
| 11 | HU-11 Transformar lacunas em artigos | Could | Nasce da retrospectiva | 4 (v1.1) |

## Release plan
| Release | Conteúdo | Evidência |
|---|---|---|
| v1.0.0 | HU-01 a HU-10: agente, escalonamento, guardrails, fila, painel, lacunas, avaliação | tag `v1.0.0`, [CHANGELOG](../../CHANGELOG.md) |
| v1.1.0 | HU-11: sugestão de artigos a partir de lacunas | tag `v1.1.0`, [PR](../06-pos-lancamento/pr-v1.1.md) |

## Sprints
| Sprint | Objetivo | Página |
|---|---|---|
| 1 | Um agente que busca, responde com fonte e recusa, e uma régua para medi-lo | [Sprint 1](sprints/sprint-1.md) |
| 2 | O que acontece quando o agente não deve ou não consegue responder | [Sprint 2](sprints/sprint-2.md) |
| 3 | Tornar a qualidade visível e provar que funciona | [Sprint 3](sprints/sprint-3.md) |
| 4 | Fechar o ciclo entre lacunas e conteúdo (v1.1) | [Sprint 4](sprints/sprint-4.md) |

## Definition of Ready
Uma história entra na sprint quando tem: requisito com ID, critério de aceite verificável, regra de negócio associada (quando houver), forma de teste prevista e nenhuma dependência aberta.

## Definition of Done
Uma história está pronta quando: o código passa em tipos e lint; há teste (unitário, integração ou E2E) para o critério de aceite; a regra de negócio está rastreada até o código; o documento afetado está atualizado; e, quando o comportamento do agente muda, a avaliação foi rodada de novo e o resultado registrado, inclusive se piorar.

## Riscos, impedimentos e mudanças
Os 10 riscos estão em [riscos.md](../02-definicao/riscos.md). Impedimentos que afetaram o plano e como foram tratados:

| Impedimento | Efeito | Tratamento |
|---|---|---|
| Sem chave de API do modelo comercial | Nenhuma rodada mede a redação do Claude | Provedor simulado declarado em todo relatório; rodada com o Claude registrada como não executada; rodada extra com modelo aberto real |
| API de embeddings indisponível na plataforma escolhida | Busca semântica fora do escopo | Embedding local por hashing, com limitação declarada ([ADR-002](../03-arquitetura/decisoes.md#adr-002--embeddings-locais-e-pgvector)) |

## Critérios para repriorizar o backlog
1. Um erro medido na avaliação passa à frente de uma funcionalidade nova.
2. Um risco com impacto alto e mitigação ausente passa à frente de um item Should ou Could.
3. Um item Could só entra quando a retrospectiva ou a lista de lacunas o sustenta.

## Indicadores de fluxo e entrega
Não há dados de tempo por item. Os indicadores observáveis são os entregáveis por sprint, o histórico de commits ([06](06-desenvolvimento-e-configuracao.md)) e os resultados de teste e de avaliação ([07](07-testes-e-qualidade.md)).
