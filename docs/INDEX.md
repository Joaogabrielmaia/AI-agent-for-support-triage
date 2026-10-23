# Índice da documentação

Volte ao [README](../README.md). Tudo aqui descreve um **estudo de caso com empresa fictícia (Agenda Bela)**, rodando local, sem cliente real e sem deploy. Reuniões, entrevistas e validações são **simuladas** e marcadas como tal.

## 00 · Sobre este caso
- [Quem sou, a empresa fictícia, regras de integridade, real × simulado](00-sobre-este-caso/README.md)

## 01 · Descoberta
- [01 · Brainstorm de ideias e matriz de decisão](01-discovery/01-brainstorm-e-matriz.md)
- [02 · O negócio: Agenda Bela](01-discovery/02-agenda-bela.md)
- [03 · Reunião 1: líder de suporte (simulada)](01-discovery/03-reuniao-1-lider-de-suporte.md)
- [04 · Reunião 2: atendente (simulada)](01-discovery/04-reuniao-2-atendente.md)
- [05 · Reunião 3: dona de salão (simulada)](01-discovery/05-reuniao-3-cliente-dona-de-salao.md)
- [06 · Análise dos chamados, AS-IS e TO-BE](01-discovery/06-analise-dos-chamados-e-as-is.md)

## 02 · Definição
- [Requisitos (RF/RNF) e metas como hipóteses](02-definicao/requisitos.md)
- [Regras de negócio](02-definicao/regras-de-negocio.md)
- [Histórias, critérios de aceite e MoSCoW](02-definicao/historias-e-moscow.md)
- [Backlog em 3 sprints](02-definicao/backlog-e-sprints.md)
- [Riscos](02-definicao/riscos.md)
- [Rastreabilidade](02-definicao/rastreabilidade.md)

## 03 · Arquitetura e decisões
- [Decisões (ADR-001 a ADR-010)](03-arquitetura/decisoes.md)
- [Modelo de dados](03-arquitetura/modelo-de-dados.md)
- [Sequência e modos de falha](03-arquitetura/sequencia-e-falhas.md)

## 04 · Avaliação
- [Metodologia e limites do que se mede](04-avaliacao/metodologia.md)
- [Comparativo entre rodadas (gerado)](04-avaliacao/comparativo-rodadas.md)
- [Análise de erros e decisões de ajuste](04-avaliacao/analise-de-erros.md)
- [Varredura de limiar](04-avaliacao/varredura-limiar.txt)
- Relatórios gerados: [rodada 1](04-avaliacao/relatorio-rodada-1.md) · [rodada 2](04-avaliacao/relatorio-rodada-2.md) · [rodada 3](04-avaliacao/relatorio-rodada-3.md) · validação [1](04-avaliacao/relatorio-validacao-rodada-1.md) · [2](04-avaliacao/relatorio-validacao-rodada-2.md) · [3](04-avaliacao/relatorio-validacao-rodada-3.md)
- [Relatório com o Claude real (em branco, com instruções)](04-avaliacao/relatorio-claude.md)

## 05 · Qualidade
- [Plano e resultados reais](05-qualidade/plano-e-resultados.md) · logs: [Vitest](05-qualidade/execucao-vitest.txt), [E2E](05-qualidade/execucao-e2e.txt), [lint e tipos](05-qualidade/execucao-lint-tipos.txt)
- [Reunião de aceitação (simulada)](05-qualidade/reuniao-de-aceitacao.md)
- Reviews: [Sprint 1](05-qualidade/sprint-1-review.md) · [Sprint 2](05-qualidade/sprint-2-review.md) · [Sprint 3](05-qualidade/sprint-3-review.md)

## 06 · Pós-lançamento
- [Retrospectiva (simulada e minha)](06-pos-lancamento/retrospectiva.md)
- [Roadmap](06-pos-lancamento/roadmap.md)
- [Descrição do PR da v1.1](06-pos-lancamento/pr-v1.1.md) · [Changelog](../CHANGELOG.md)

## Entrevista e vitrine
- [Perguntas de entrevista por fase](entrevista/perguntas-por-fase.md)
- [Bullets de currículo](vitrine/curriculo.md) · [Post de LinkedIn](vitrine/linkedin.md) · [Respostas de 30 s e 2 min](vitrine/respostas.md)

## Prints (13)
`docs/screenshots/`: [01 chat com fontes](screenshots/01-chat-resposta-com-fontes.png) · [02 recusa honesta](screenshots/02-recusa-honesta.png) · [03 escalonamento](screenshots/03-escalonamento-para-humano.png) · [04 fila](screenshots/04-fila-do-atendente.png) · [05 chamado](screenshots/05-detalhe-do-chamado-com-resumo.png) · [06 avaliação da resposta](screenshots/06-avaliacao-da-resposta-do-agente.png) · [07 painel](screenshots/07-painel.png) · [08 lacunas](screenshots/08-lacunas-da-base.png) · [09 injeção bloqueada](screenshots/09-injecao-de-prompt-bloqueada.png) · [10 relatório de avaliação](screenshots/10-relatorio-de-avaliacao.png) · [11 mobile](screenshots/11-versao-mobile-chat.png) · [12 base](screenshots/12-base-de-conhecimento.png) · [13 sugestão de artigo (v1.1)](screenshots/13-sugestao-de-artigo-v1.1.png)
