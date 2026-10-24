# Episódio 0 — Sobre este caso

Este episódio explica o que é o Prumo e em que condições foi feito. A Agenda Bela, a empresa do estudo, é fictícia, e a tabela "Real × simulado" separa o que saiu de execução (código, testes, rodadas, logs, prints) do que é premissa ou simulação (reuniões, volume de chamados).

A limitação que pesa em todo o resto também está aqui: sem chave de API da Anthropic, as rodadas medem o provedor simulado e uma execução com a Groq, e a rodada com o Claude não foi executada.

| Documento | O que contém | Itens |
|---|---|---|
| Esta página (abaixo) | Produto, empresa fictícia, real × simulado, limitação sem chave de API | 1 tabela de 5 linhas |

← Anterior · [Índice](../INDEX.md) · [Próximo →](../01-discovery/README.md)

---


## O que é este projeto
O **Prumo** é um agente de IA que faz a **triagem do suporte** de uma pequena empresa de software. Ele responde dúvidas frequentes com base numa base de conhecimento, cita a fonte, admite quando não sabe, encaminha para uma pessoa com o contexto organizado e registra o chamado com categoria e prioridade.

O diferencial não é o chat. É a **avaliação**: um conjunto de perguntas de teste, métricas que saem de execuções reais, análise dos erros e decisões baseadas nisso.

## A empresa do estudo: Agenda Bela
A **Agenda Bela** é um SaaS pequeno de agendamento para salões e clínicas de estética. Tem 8 pessoas, 3 delas no suporte. Ela é **fictícia**. As pessoas, os clientes, os preços e os dados foram criados para o estudo, com nomes brasileiros comuns, sem marcas ou pessoas reais.

## Real × simulado
| O quê | Situação |
|---|---|
| Código, testes, rodadas de avaliação, logs de `docs/05-qualidade/`, prints e histórico do Git | Real: saem de execuções locais. |
| Três reuniões de discovery, reunião de aceitação e retrospectiva | Simuladas; pessoas e empresa fictícias. |
| Volume de chamados e percentual de repetição da Agenda Bela | Premissas do caso, não medições. |
| Conversas na fila e no painel | Dados de demonstração: perguntas escritas por mim, passadas pelo agente de verdade por um script de demonstração. |
| Metas de qualidade, custo e tempo | Hipóteses. Nenhum tempo de resposta, economia ou satisfação foi medido. |

## Uma limitação desde já
Não havia chave de API da Anthropic no ambiente em que construí o projeto. Por isso:
1. As rodadas 1 a 3 usam o provedor simulado (MockProvider, extrativo e determinístico) e uma busca local por hashing. Medem **recuperação, limiar de confiança, escalonamento e guardrails**, não a qualidade de redação do Claude.
2. Rodei uma vez um modelo aberto real (Groq), em [`relatorio-modelo-aberto.md`](../04-avaliacao/relatorio-modelo-aberto.md). Não é o Claude.
3. A rodada com o Claude está **não executada**, com o comando em [`relatorio-claude.md`](../04-avaliacao/relatorio-claude.md). O `AnthropicProvider` existe atrás da mesma interface, mas não foi exercitado.

Voltar ao [índice](../INDEX.md).
