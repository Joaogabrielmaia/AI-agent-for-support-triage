# 01 · Visão e discovery

[← Índice do ciclo de vida](README.md) · Próximo: [02 · Planejamento e Scrum](02-planejamento-e-scrum.md)

## Contexto de negócio
A Agenda Bela (empresa fictícia) vende um sistema de agendamento para salões e clínicas de estética. Tem 8 pessoas, 3 no suporte. O suporte recebe perguntas repetidas de preço, cancelamento, senha, importação e lembretes, e também casos que envolvem dinheiro, identidade e dados de clientes. Detalhes em [02-agenda-bela.md](../01-discovery/02-agenda-bela.md).

## Problema central e proposta de valor
- **Problema:** responder a mesma pergunta repetidamente consome o suporte, e a automação ingênua cria o risco de informação errada, promessa indevida e exposição de dados.
- **Proposta de valor:** um agente que responde somente com base em artigos citados, recusa quando não tem base e entrega o restante a uma pessoa com resumo, categoria, prioridade e motivo.
- **Diferencial de engenharia:** a qualidade do agente é medida com um conjunto de perguntas de desenvolvimento e outro de validação, e cada ajuste nasce de um erro medido ([Episódio 4](../04-avaliacao/README.md)).

## Personas e partes interessadas (por papel)
| Papel | Interesse | Preocupação registrada nas reuniões |
|---|---|---|
| Líder de suporte | Reduzir o volume repetitivo | Resposta errada e promessa de reembolso; só o financeiro decide reembolso |
| Atendente | Receber o chamado já organizado | Ser substituído; vigilância de produtividade |
| Cliente-tipo (dona de salão) | Resposta rápida e confiável | Dados de saúde de clientes finais; para onde vão os dados |
| Financeiro | Controle sobre reembolso e cobrança | Decisões financeiras fora do agente |
| Administrador da base | Manter os artigos atualizados | Lacunas e artigos desatualizados |

## Escopo e fora de escopo
| Dentro (v1.0 e v1.1) | Fora desta versão (MoSCoW "Won't") |
|---|---|
| Chat do cliente com fontes, recusa e pedido de pessoa | WhatsApp e voz |
| Escalonamento com resumo, categoria, prioridade e motivo | Treinamento de modelo |
| Fila do atendente, avaliação das respostas, painel, lacunas | Multiempresa |
| Guardrails de dados e de prompt, avaliação em 2 conjuntos | Sugestão de resposta ao atendente (ideia D da matriz) |
| Sugestão de artigos a partir de lacunas (v1.1) | Mascaramento de nomes e endereços |

Fonte: [histórias e MoSCoW](../02-definicao/historias-e-moscow.md) e [brainstorm](../01-discovery/01-brainstorm-e-matriz.md).

## Restrições, premissas e dependências
- **Negócio:** reembolso, cobrança contestada, exclusão de dados e acesso sempre vão a uma pessoa (RN-04).
- **Técnica:** o provedor de linguagem fica atrás de uma interface; o sistema precisa ser testável sem rede e sem chave de API ([ADR-008](../03-arquitetura/decisoes.md#adr-008--abstração-do-provedor-de-linguagem)).
- **Financeira e operacional:** custo por conversa é hipótese (RNF-02), sem medição; sem hospedagem no escopo.
- **Premissas do caso:** o volume de chamados e o percentual de repetição são entradas do cenário, e os 40 chamados da análise são fictícios ([análise](../01-discovery/06-analise-dos-chamados-e-as-is.md)).
- **Dependências:** PostgreSQL com pgvector; modelo de linguagem externo apenas nas rodadas com Groq e, no futuro, com o Claude.

## Riscos iniciais
Alucinação, vazamento de dados, injeção de prompt, promessa indevida e resistência do time. A lista completa, com mitigação e risco residual, está em [riscos](../02-definicao/riscos.md).

## Critérios de sucesso
| Critério | Indicador | Situação |
|---|---|---|
| O agente só responde com fonte | Fundamentação das respondíveis | 90,0% na rodada 3 ([comparativo](../04-avaliacao/comparativo-rodadas.md)) |
| O agente recusa o que não sabe | Recusa correta fora da base | 80,0% na rodada 3 (era 20,0%) |
| Ataques conhecidos não passam | Adversariais seguras | 100,0% nas 3 rodadas (piso, não prova de robustez) |
| O humano controla a qualidade | Respostas avaliáveis pelo atendente | Implementado (RF-09) |
| Custo e tempo de resposta | Meta p95 ≤ 5 s e ≤ US$ 0,02 por conversa | Não medidos (hipóteses) |

## Reuniões e análise
- [Reuniões e atas](reunioes/README.md)
- [Análise dos 40 chamados e processo AS-IS/TO-BE](../01-discovery/06-analise-dos-chamados-e-as-is.md)
