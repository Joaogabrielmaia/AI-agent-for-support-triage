# Guia da série

Série **"Como medir, limitar e melhorar um agente de IA de suporte"**, sobre o Prumo, um agente de triagem de suporte da Agenda Bela (empresa fictícia). Voltar à [capa](../README.md). Termos técnicos: [glossário](GLOSSARIO.md).

## Episódios
| Episódio | O que acontece | Página |
|---|---|---|
| 0 · Sobre este caso | O produto, a empresa fictícia e o que é real ou simulado | [docs/00](00-sobre-este-caso/README.md) |
| 1 · Discovery | Matriz de ideias, negócio, três reuniões simuladas, 40 chamados fictícios | [docs/01](01-discovery/README.md) |
| 2 · Definição | 15 RF, 9 RNF, 12 RN, 11 histórias, backlog, riscos, rastreabilidade | [docs/02](02-definicao/README.md) |
| 3 · Arquitetura | 10 decisões (ADR), modelo de dados, sequência e falhas | [docs/03](03-arquitetura/README.md) |
| 4 · Avaliação (central) | Erro medido → decisão → nova medição, com regressões e limites | [docs/04](04-avaliacao/README.md) |
| 5 · Qualidade | Resultados dos testes por commit, aceitação simulada, reviews | [docs/05](05-qualidade/README.md) |
| 6 · Pós-lançamento | v1.1, retrospectiva simulada, roadmap | [docs/06](06-pos-lancamento/README.md) |
| Galeria | 13 prints do sistema, na ordem do fluxo | [screenshots](screenshots/README.md) |

## Trilhas de leitura
**Em 2 minutos**
1. [README](../README.md)
2. [Chat com resposta e fontes](screenshots/01-chat-resposta-com-fontes.png)
3. [Recusa honesta](screenshots/02-recusa-honesta.png)
4. [Tabela das rodadas](../README.md#evidências)

**Em 10 minutos** (os de 2 minutos, mais)
1. [Análise de erros](04-avaliacao/analise-de-erros.md)
2. [ADR-004: limiar de confiança](03-arquitetura/decisoes.md#adr-004--limiar-de-confiança-e-como-medi-lo)
3. [ADR-007: prompt injection](03-arquitetura/decisoes.md#adr-007--prompt-injection)
4. [Relatório do modelo aberto (Groq)](04-avaliacao/relatorio-modelo-aberto.md)
5. [Painel](screenshots/07-painel.png)

**Em 30 minutos** (os de 10 minutos, mais)
1. [Metodologia da avaliação](04-avaliacao/metodologia.md)
2. [Regras de negócio](02-definicao/regras-de-negocio.md) e [rastreabilidade](02-definicao/rastreabilidade.md)
3. [Sequência e modos de falha](03-arquitetura/sequencia-e-falhas.md)
4. [Varredura de limiar](04-avaliacao/varredura-limiar.txt)
5. [Reunião de aceitação (simulada)](05-qualidade/reuniao-de-aceitacao.md)

## Ordem de leitura
A numeração das pastas é a ordem de leitura, não a ordem em que o trabalho foi feito: o histórico do Git mostra o núcleo do agente e o harness antes dos documentos de discovery.

## Todos os documentos
- **00** · [Sobre este caso](00-sobre-este-caso/README.md)
- **01** · [Brainstorm e matriz](01-discovery/01-brainstorm-e-matriz.md) · [Agenda Bela](01-discovery/02-agenda-bela.md) · [Reunião 1](01-discovery/03-reuniao-1-lider-de-suporte.md) · [Reunião 2](01-discovery/04-reuniao-2-atendente.md) · [Reunião 3](01-discovery/05-reuniao-3-cliente-dona-de-salao.md) · [Chamados e AS-IS](01-discovery/06-analise-dos-chamados-e-as-is.md)
- **02** · [Requisitos](02-definicao/requisitos.md) · [Regras de negócio](02-definicao/regras-de-negocio.md) · [Histórias e MoSCoW](02-definicao/historias-e-moscow.md) · [Backlog](02-definicao/backlog-e-sprints.md) · [Riscos](02-definicao/riscos.md) · [Rastreabilidade](02-definicao/rastreabilidade.md)
- **03** · [Decisões](03-arquitetura/decisoes.md) · [Modelo de dados](03-arquitetura/modelo-de-dados.md) · [Sequência e falhas](03-arquitetura/sequencia-e-falhas.md)
- **04** · [Metodologia](04-avaliacao/metodologia.md) · [Comparativo](04-avaliacao/comparativo-rodadas.md) · [Análise de erros](04-avaliacao/analise-de-erros.md) · [Varredura](04-avaliacao/varredura-limiar.txt) · [Modelo aberto](04-avaliacao/relatorio-modelo-aberto.md) · [Claude (não executada)](04-avaliacao/relatorio-claude.md)
- **05** · [Plano e resultados](05-qualidade/plano-e-resultados.md) · [Aceitação](05-qualidade/reuniao-de-aceitacao.md) · [Sprint 1](05-qualidade/sprint-1-review.md) · [Sprint 2](05-qualidade/sprint-2-review.md) · [Sprint 3](05-qualidade/sprint-3-review.md)
- **06** · [PR da v1.1](06-pos-lancamento/pr-v1.1.md) · [Retrospectiva](06-pos-lancamento/retrospectiva.md) · [Roadmap](06-pos-lancamento/roadmap.md) · [Changelog](../CHANGELOG.md)
