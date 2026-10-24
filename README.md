# Prumo

Agente de IA de triagem de suporte: responde com fontes a partir de uma base de 31 artigos, recusa quando a confiança é baixa e escala o que envolve dinheiro, identidade ou dados.

## Em 30 segundos
- **Problema:** uma empresa fictícia de agendamento para salões (8 pessoas, 3 no suporte) responde as mesmas perguntas o dia todo e teme que um robô dê informação errada.
- **Solução:** o agente responde só o que está na base, cita a fonte, diz "não tenho essa informação" quando não sabe e passa o caso a uma pessoa, com resumo e motivo.
- **Prova:** avaliação em 3 rodadas, de 66% a 86% no conjunto de desenvolvimento e de 70% a 80% na validação, com o sobreajuste declarado ([comparativo](docs/04-avaliacao/comparativo-rodadas.md)).
- **Comece por aqui:** [a recusa honesta](docs/screenshots/02-recusa-honesta.png) · [a análise de erros](docs/04-avaliacao/analise-de-erros.md) · [o comparativo das rodadas](docs/04-avaliacao/comparativo-rodadas.md)

<table>
<tr>
<td><img src="docs/screenshots/01-chat-resposta-com-fontes.png" alt="Chat do cliente com a resposta sobre o preço do plano Profissional e duas fontes numeradas"></td>
<td><img src="docs/screenshots/02-recusa-honesta.png" alt="Chat em que o agente diz que não tem a informação sobre WhatsApp e oferece falar com uma pessoa"></td>
</tr>
<tr>
<td><img src="docs/screenshots/05-detalhe-do-chamado-com-resumo.png" alt="Detalhe de um chamado com resumo, motivo do encaminhamento e conversa com a confiança de cada resposta"></td>
<td><img src="docs/screenshots/07-painel.png" alt="Painel com conversas, taxa de resolução pelo agente, taxa de escalonamento e volume por categoria"></td>
</tr>
</table>

## Ficha técnica
| | |
|---|---|
| Natureza | Caso fictício; empresa, pessoas e dados inventados |
| Discovery | Reuniões simuladas, marcadas nas atas |
| Stack | Next.js (App Router), TypeScript, Tailwind, Prisma, PostgreSQL com pgvector, Zod, Docker Compose |
| Modelo na avaliação | Provedor simulado (MockProvider) e Groq `gpt-oss-120b`; rodada com o Claude não executada |
| Base de conhecimento | 31 artigos, 93 trechos |
| Testes | Vitest 83 de 83 (9 arquivos), E2E 13 de 14, tipos e lint sem erros; commit `2cb000d`, 2026-10-24 ([detalhes](docs/05-qualidade/plano-e-resultados.md)). Registro anterior, commit `1640e4a`: 78 de 78 e 14 de 14 |
| Execução | Local; não hospedado |

## Duas entradas
**Pelo lado do negócio:** [Ep. 1 Discovery](docs/01-discovery/README.md) (reuniões simuladas e 40 chamados fictícios), [Ep. 2 Definição](docs/02-definicao/README.md) (requisitos e regras de negócio) e [Ep. 6 Pós-lançamento](docs/06-pos-lancamento/README.md) (v1.1 e roadmap).

**Pelo lado técnico:** [Ep. 3 Arquitetura](docs/03-arquitetura/README.md) (10 decisões), [Ep. 4 Avaliação (central)](docs/04-avaliacao/README.md) (erro medido, decisão, nova medição) e [Ep. 5 Qualidade](docs/05-qualidade/README.md) (testes por commit).

Siglas e termos técnicos estão no [glossário](docs/GLOSSARIO.md).

## O problema
Um SaaS pequeno de agendamento para salões e clínicas de estética recebe, todo dia, perguntas repetidas sobre preço, cancelamento e senha. Parte dos chamados envolve reembolso, cobrança ou dados de clientes, e ali um erro custa caro. A empresa, a Agenda Bela, é fictícia.

## O que faz
- Responde com base em artigos e **cita as fontes**, que o cliente abre no próprio chat.
- **Recusa** quando a confiança é baixa, sem mostrar fontes, e oferece falar com uma pessoa.
- **Escala** reembolso, cobrança contestada, exclusão de dados e acesso, com resumo, categoria, prioridade e motivo.
- Aplica **guardrails** (regras de proteção no código): mascara dados pessoais, bloqueia injeção de prompt e filtra promessas na saída.
- Dá à equipe fila, avaliação "correta/incorreta" de cada resposta, painel, lacunas da base e rascunhos de artigo.

## O que este projeto mostra
- Avaliação com conjunto de desenvolvimento (50 perguntas) e de validação (20) separados, com cada rodada gravando commit, data, perfil e provedor.
- Detecção de sobreajuste: o ganho foi de +20 pontos onde ajustei e de +10 onde não ajustei.
- Recusa honesta e escalonamento com guardrails, testados com injeção de prompt e pedidos de dados de terceiros.

| O que o projeto exercita | Onde está a prova |
|---|---|
| Definir quando o agente responde, recusa ou escala | [Regras de negócio](docs/02-definicao/regras-de-negocio.md) e prints [02](docs/screenshots/02-recusa-honesta.png) e [03](docs/screenshots/03-escalonamento-para-humano.png) |
| Avaliar um sistema de IA sem se enganar | [ADR-010](docs/03-arquitetura/decisoes.md#adr-010--como-avaliar-sem-se-enganar) e [metodologia](docs/04-avaliacao/metodologia.md) (50 + 20 perguntas, conjuntos separados) |
| Transformar erro medido em decisão | [Análise de erros](docs/04-avaliacao/analise-de-erros.md) (17 erros, decisões, rodadas 2 e 3) |
| Admitir regressão e sobreajuste | [Comparativo](docs/04-avaliacao/comparativo-rodadas.md) e [análise de erros](docs/04-avaliacao/analise-de-erros.md) |
| Proteger dados e resistir a injeção de prompt | [ADR-006](docs/03-arquitetura/decisoes.md#adr-006--mascaramento-de-dados-pessoais), [ADR-007](docs/03-arquitetura/decisoes.md#adr-007--prompt-injection) e [print 09](docs/screenshots/09-injecao-de-prompt-bloqueada.png) |
| Testar com modelo real e achar defeitos próprios | [Relatório do modelo aberto](docs/04-avaliacao/relatorio-modelo-aberto.md) |
| Devolver ao humano com contexto | Prints [04](docs/screenshots/04-fila-do-atendente.png), [05](docs/screenshots/05-detalhe-do-chamado-com-resumo.png), [08](docs/screenshots/08-lacunas-da-base.png) e [13](docs/screenshots/13-sugestao-de-artigo-v1.1.png) |

## Episódios
| Episódio | Conteúdo |
|---|---|
| [0 · Sobre este caso](docs/00-sobre-este-caso/README.md) | Produto, empresa fictícia, real × simulado |
| [1 · Discovery](docs/01-discovery/README.md) | Matriz de ideias, três reuniões simuladas, 40 chamados fictícios |
| [2 · Definição](docs/02-definicao/README.md) | 15 RF, 9 RNF, 12 RN, 11 histórias, riscos, rastreabilidade |
| [3 · Arquitetura](docs/03-arquitetura/README.md) | 10 ADRs, modelo de dados, sequência e falhas |
| [4 · Avaliação](docs/04-avaliacao/README.md) | Rodadas, erros, decisões, modelo aberto (central) |
| [5 · Qualidade](docs/05-qualidade/README.md) | Testes por commit, aceitação simulada, reviews |
| [6 · Pós-lançamento](docs/06-pos-lancamento/README.md) | v1.1, retrospectiva simulada, roadmap |
| [Galeria](docs/screenshots/README.md) | 13 prints na ordem do fluxo |

Guia completo, com trilhas de 2, 10 e 30 minutos: [docs/INDEX.md](docs/INDEX.md). ADR é um registro de decisão de arquitetura; RF, RNF e RN são requisitos funcionais, não funcionais e regras de negócio.

## Decisões que contam
[ADR-001](docs/03-arquitetura/decisoes.md#adr-001--rag-vs-ajuste-fino-vs-regras) (RAG em vez de ajuste fino), [ADR-004](docs/03-arquitetura/decisoes.md#adr-004--limiar-de-confiança-e-como-medi-lo) (limiar de confiança), [ADR-007](docs/03-arquitetura/decisoes.md#adr-007--prompt-injection) (quatro camadas contra injeção de prompt) e [ADR-010](docs/03-arquitetura/decisoes.md#adr-010--como-avaliar-sem-se-enganar) (como avaliar sem se enganar).

**A mais difícil: o limiar de confiança** ([ADR-004](docs/03-arquitetura/decisoes.md#adr-004--limiar-de-confiança-e-como-medi-lo) e [varredura](docs/04-avaliacao/varredura-limiar.txt))

| | |
|---|---|
| Contexto | Abaixo de um limiar o agente recusa. Na rodada 1, as confianças das perguntas respondíveis (0,12 a 0,54) e das fora da base (0,07 a 0,29) se sobrepunham. |
| Alternativas | Limiar fixo na similaridade (0,15); limiar mais cobertura mínima das palavras da pergunta; pedir ao modelo que diga o quanto está seguro. |
| Escolha | Similaridade com cobertura: limiar 0,16 e cobertura mínima 0,4. Recusa correta de 20% para 80% no desenvolvimento e de 60% para 80% na validação. |
| Custo aceito | O cliente fica sem resposta em alguns casos válidos, porque errei para o lado de recusar. F01 e F03 seguem respondidas sem base (confiança 0,33); nenhum limiar as separa. |
| A varredura | A melhor combinação foi 0,22 com cobertura 0,4, com 88%. Não adotei: seria ajustar de novo no mesmo conjunto, e a diferença é de uma pergunta. |
| Quando mudaria | Com o Claude real, medindo também a taxa de "o modelo disse que não sabe" como segundo sinal; com embeddings neurais, a calibragem seria refeita. |

## Evidências
Fonte: [comparativo-rodadas.md](docs/04-avaliacao/comparativo-rodadas.md), gerado dos JSONs de cada rodada.

| | Rodada 1 | Rodada 2 | Rodada 3 | Groq, como rodou | Groq, reavaliado offline |
|---|---|---|---|---|---|
| Desenvolvimento (50) | 66% | 86% | 86% | 78% | 90% |
| Validação (20) | 70% | 80% | 80% | 70% | 90% |
| Fora da base: recusa correta (desenvolvimento) | 20% | 80% | 80% | 80% | 100% |
| Adversariais seguras | 100% | 100% | 100% | 100% | 100% |

As rodadas 1 a 3 usam o provedor simulado, que mede busca, limiar, escalonamento e guardrails. A coluna "reavaliado" da Groq usa um avaliador que corrigi depois de ver os resultados, e a rodada `groq-1` está gravada com `sem-commit`. A rodada 3 não mudou o total e trocou erros de lugar (corrigiu R01, R23 e H01; criou R12, R17 e H07). Uma execução com a Groq (`gpt-oss-120b`) achou dois defeitos meus: o avaliador não normalizava espaço especial nem negrito, e o pipeline não tratava a recusa do próprio modelo ([relatório](docs/04-avaliacao/relatorio-modelo-aberto.md)).

Testes: [plano e resultados](docs/05-qualidade/plano-e-resultados.md). O E2E rodou 13 de 14 porque um teste usa a porta 3000, que estava ocupada por outro projeto na máquina.

## Rodar localmente
Requisitos: Node 20+ e Docker.
```bash
npm install
cp .env.example .env            # ajuste SESSION_SECRET (qualquer string longa)
docker compose up -d            # PostgreSQL com pgvector na porta 5440
npx prisma migrate deploy
npm run db:seed                 # usuários, 31 artigos e vetores
npm run db:demo                 # conversas de demonstração (apaga todas as conversas)
npm run build && npm run start  # http://localhost:3000
```
Contas de demonstração (fictícias, só locais): `admin@agendabela.test` e `atendente@agendabela.test`, senha `prumo-demo-123`. O cliente usa [`/chat`](http://localhost:3000/chat) sem login, com `LLM_PROVIDER=mock` por padrão.

```bash
npm test && npm run test:e2e && npm run lint && npm run typecheck
npm run eval -- --profile final --label minha-rodada      # 50 perguntas, sem banco e sem rede
npm run eval -- --profile final --label minha-validacao --dataset holdout
npm run sweep -- --profile final                           # varredura de limiar
npm run screenshots                                        # regenera docs/screenshots
```
No Windows, uma vez: `npx playwright install chromium`.

**Rodada com o Claude: não executada.** Sem chave de API, nenhum número deste repositório fala do Claude. Para executar:
```bash
export ANTHROPIC_API_KEY=...  LLM_PROVIDER=anthropic
export PRICE_INPUT_PER_MTOK=...  PRICE_OUTPUT_PER_MTOK=...
npm run eval -- --profile final --label claude-1
```
Detalhes em [relatorio-claude.md](docs/04-avaliacao/relatorio-claude.md). A chave só vem do ambiente.

## O que falta para sair do estudo
- Rodar a avaliação com o Claude real: [relatório](docs/04-avaliacao/relatorio-claude.md) e [roadmap](docs/06-pos-lancamento/roadmap.md).
- Trocar o embedding por hashing, que não é semântico, por um modelo semântico: [ADR-002](docs/03-arquitetura/decisoes.md#adr-002--embeddings-locais-e-pgvector).
- Ampliar a avaliação, hoje com 70 perguntas escritas pelo autor: [metodologia](docs/04-avaliacao/metodologia.md).
- Medir custo e latência com o Claude: [requisitos](docs/02-definicao/requisitos.md) (RNF-01 e RNF-02, metas não medidas).
- Cobertura de código, auditoria de acessibilidade, teste de carga e limite de tentativas de login: [plano e resultados](docs/05-qualidade/plano-e-resultados.md).
- Hospedagem: o projeto roda só localmente.

## Limites
- A busca é lexical: nenhum limiar separa F01 e F03, e os erros que sobraram são quase todos de vocabulário.
- Os adversariais foram escritos pelo autor, junto com as regras de entrada; 100% é um piso.
- "Resolvida pelo agente" significa que não virou chamado; o cliente não confirma.
- Fila e painel usam dados de demonstração, não uso real.
- A rodada 2 mudou cinco coisas juntas, sem ablação.

Licença [MIT](LICENSE).
