# Sobre este caso

## Quem eu sou e o que é este projeto
Sou o João Gabriel Maia da Costa, graduando em Engenharia de Software na PUC Minas e desenvolvedor full stack (JavaScript/TypeScript, React, Next.js, Node.js, PostgreSQL, Prisma). Tenho experiência em suporte de TI, automações e agentes de IA. Este repositório é a minha vitrine para vagas de Consultor de Automação com IA, Analista de Automação, Customer Success e Implantação.

O produto se chama **Prumo**: um agente de IA que faz a **triagem do suporte** de uma pequena empresa de software. Ele responde dúvidas frequentes com base numa base de conhecimento, cita a fonte, admite quando não sabe, encaminha para uma pessoa com o contexto organizado e registra o chamado com categoria e prioridade.

O diferencial não é o chat. É a **avaliação**: um conjunto de perguntas de teste, métricas que saem de execuções reais, análise dos erros e decisões baseadas nisso.

## A empresa do estudo: Agenda Bela
A **Agenda Bela** é um SaaS pequeno de agendamento para salões e clínicas de estética. Tem 8 pessoas, 3 delas no suporte. Ela é **fictícia**. As pessoas, os clientes, os preços e os dados foram criados para o estudo, com nomes brasileiros comuns, sem marcas ou pessoas reais.

## Regras de integridade que segui
| Regra | Como aparece no repositório |
|---|---|
| Nada de cliente real, operação real ou produção | Todo documento trata a Agenda Bela como caso fictício. Não existe hospedagem, link de demonstração nem deploy. |
| Reuniões e entrevistas são simuladas | O Claude interpretou o cliente e as demais pessoas. Todo registro simulado começa com a linha `> Simulação: o Claude interpretou o cliente nesta conversa.` |
| Ganhos esperados são hipóteses | Metas de qualidade, custo e tempo estão marcadas como hipótese. Nenhum tempo de resposta, economia ou satisfação foi medido. |
| Nenhum número de avaliação inventado | Os números vêm de execuções reais do harness (`eval/`). Cada relatório registra commit, data, perfil e provedor. |
| Sem segredos | A chave da API vem de variável de ambiente. `.env.example` traz só campos vazios. |
| Tudo roda local | Docker Compose + Next.js. As provas são prints e documentos. |

## O que é real e o que é simulado
- **Real:** o código, os testes, as rodadas de avaliação, os logs de execução em `docs/05-qualidade/`, os prints gerados pelo Playwright e o histórico do Git.
- **Simulado:** as três reuniões de discovery, a reunião de aceitação, a retrospectiva e as perguntas dos "clientes" do estudo. O volume de chamados e o percentual de repetição da Agenda Bela são **premissas do caso**, não medições.
- **Dados de demonstração:** as conversas que aparecem na fila e no painel vêm de `npm run db:demo`, que passa perguntas escritas por mim pelo agente de verdade. São demonstração, não uso real.

## Uma limitação que precisa ficar clara desde já
Não havia chave de API da Anthropic no ambiente em que construí isto. Por isso:
1. As rodadas 1 a 3 usam o **`MockProvider`** (extrativo e determinístico) e uma busca local por hashing. Elas medem **recuperação, limiar de confiança, escalonamento e guardrails**. **Não medem a qualidade de redação do Claude.**
2. Rodei também uma vez um modelo aberto real (Groq), em [`../04-avaliacao/relatorio-modelo-aberto.md`](../04-avaliacao/relatorio-modelo-aberto.md); **não é o Claude**. A rodada com o Claude real está **em branco**, com o passo a passo para eu rodar e preencher em [`../04-avaliacao/relatorio-claude.md`](../04-avaliacao/relatorio-claude.md).
3. O `AnthropicProvider` está implementado atrás da mesma interface, mas **não foi exercitado** neste repositório.

## Se eu tiver notas de uma conversa real
Se eu obtiver, com autorização, anotações de uma conversa real com alguém de suporte, elas entram no lugar das simulações em `docs/01-discovery/` e o README é ajustado.

Voltar ao [índice](../INDEX.md).
