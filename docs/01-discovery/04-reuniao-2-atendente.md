# 04 · Reunião 2 — Atendente (Carlos Nogueira)

> Simulação: o Claude interpretou o cliente nesta conversa.

**Participantes:** João (eu) e Carlos Nogueira (atendente da Agenda Bela, interpretado pelo Claude).
**Objetivo:** ver o dia a dia de quem atende, entender o que ajudaria e o que assusta.

## Resumo da conversa
Carlos começou educado e meio na defensiva. Quando perguntei como era o dia, falou do que mais cansa: "Eu respondo a mesma pergunta de plano umas vinte vezes por semana e, quando chega o caso difícil, eu já estou cansado e ainda tenho que perguntar tudo de novo pro cliente." Depois, mais baixo: "Isso aí vai me substituir?"

## O medo dele e como eu tratei
> "Se o robô responde tudo, pra que vão precisar de mim?"

Não tentei convencer. Perguntei o que ele **faria** se o repetitivo sumisse. Ele respondeu que gostaria de cuidar de cobrança e de cliente com problema grave, "que é onde eu faço diferença". Isso virou o **desenho do produto**: o agente fica com o repetitivo, e o atendente recebe o difícil, com contexto.

Registrei duas decisões a partir disso:
1. O atendente **avalia** as respostas do agente (correta/incorreta) e isso alimenta o painel. Ele fica no controle da qualidade, e não é substituído por ela (RF-09).
2. O painel **não** mostra produtividade individual de ninguém. Mostra categorias, lacunas e qualidade do agente. Isso é uma escolha de design para não virar ferramenta de vigilância.

## Pedidos vagos que eu refinei
| O que ele disse | Refinamento | Requisito |
|---|---|---|
| "Quero o contexto na hora" | O que exatamente? Ele listou: o que o cliente pediu, o que o robô já respondeu, por que escalou. | Resumo + motivo no chamado → RF-05, RF-07. |
| "Tem que ser fácil de achar o urgente" | Ordenar por prioridade e filtrar por categoria. | RF-06. |
| "Quero poder corrigir o robô" | Marcar "incorreta" e ver isso depois. | RF-09, e o painel mostra a taxa de respostas corretas. |

## Contradições
- Ele quer **menos repetitivo** (concorda com a líder) e, ao mesmo tempo, **teme perder o emprego**. Não resolvi isso com argumento: resolvi no produto (acima). Deixei registrado na retrospectiva como risco organizacional que o software sozinho não resolve.
- Pediu "sugestão de resposta" porque "ajuda na hora do cansaço". Eu expliquei que isso ficou fora do MVP (ver [01](01-brainstorm-e-matriz.md)) e anotei como candidato a roadmap.

## O que mudou no desenho por causa dele
A tela do chamado ganhou o **resumo na lateral e a conversa completa ao lado**, com fontes e confiança em cada resposta do agente. Antes, eu só mostrava o resumo.
