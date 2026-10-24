# Prumo

Agente de IA de triagem de suporte: responde com fontes a partir de uma base de 31 artigos, recusa quando a confiança é baixa e escala o que envolve dinheiro, identidade ou dados.

## O problema
Cenário: a Agenda Bela, empresa fictícia de agendamento para salões, tem 8 pessoas e 3 delas no suporte.
Elas respondem as mesmas perguntas de preço, cancelamento e senha, e temem que um robô erre.
Reembolso, cobrança e dados de clientes não podem ser decididos por ele.

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

![Gravação do chat: pergunta de preço com fontes, pergunta fora da base com recusa, pedido de reembolso escalado e o chamado novo na fila do atendente](docs/screenshots/demo-agente.gif)

## Ficha técnica
| | |
|---|---|
| Natureza | Estudo de caso fictício |
| Stack | Next.js (App Router), TypeScript, Tailwind, Prisma, PostgreSQL com pgvector, Zod, Vitest, Playwright |
| Testes | Vitest 83 de 83 (9 arquivos), 2026-10-24, commit `2cb000d`; E2E 14 de 14, 2026-10-24, commit `fb6b3bc` ([log](docs/05-qualidade/plano-e-resultados.md)) |

## O que construí
- Uma busca por similaridade sobre embeddings por hashing, guardados no pgvector (não é busca semântica, e declaro isso no [ADR-002](docs/03-arquitetura/decisoes.md#adr-002--embeddings-locais-e-pgvector)).
- Um limiar de confiança que combina similaridade e cobertura das palavras da pergunta: 0,16 e 0,4 ([ADR-004](docs/03-arquitetura/decisoes.md#adr-004--limiar-de-confiança-e-como-medi-lo)).
- Quatro camadas contra injeção de prompt: entrada, isolamento, marcador-canário e filtro de saída ([ADR-007](docs/03-arquitetura/decisoes.md#adr-007--prompt-injection)).
- Mascaramento de dados pessoais antes de guardar ou enviar ao modelo ([ADR-006](docs/03-arquitetura/decisoes.md#adr-006--mascaramento-de-dados-pessoais)).
- Escalonamento com resumo, categoria, prioridade e motivo, por regras explícitas ([regras de negócio](docs/02-definicao/regras-de-negocio.md)).
- Uma avaliação com 50 + 20 perguntas e 3 rodadas, que detectou sobreajuste, e dez decisões registradas em ADRs ([guia da série](docs/INDEX.md)).

## Competência → prova
| O que o projeto exercita | Onde está a prova |
|---|---|
| Definir quando o agente responde, recusa ou escala | [Regras de negócio](docs/02-definicao/regras-de-negocio.md) e prints [02](docs/screenshots/02-recusa-honesta.png) e [03](docs/screenshots/03-escalonamento-para-humano.png) |
| Avaliar um sistema de IA sem se enganar | [ADR-010](docs/03-arquitetura/decisoes.md#adr-010--como-avaliar-sem-se-enganar) e [metodologia](docs/04-avaliacao/metodologia.md) (50 + 20 perguntas, conjuntos separados) |
| Transformar erro medido em decisão | [Análise de erros](docs/04-avaliacao/analise-de-erros.md) (17 erros, decisões, rodadas 2 e 3) |
| Admitir regressão e sobreajuste | [Comparativo](docs/04-avaliacao/comparativo-rodadas.md) e [análise de erros](docs/04-avaliacao/analise-de-erros.md) |
| Proteger dados e resistir a injeção de prompt | [ADR-006](docs/03-arquitetura/decisoes.md#adr-006--mascaramento-de-dados-pessoais), [ADR-007](docs/03-arquitetura/decisoes.md#adr-007--prompt-injection) e [print 09](docs/screenshots/09-injecao-de-prompt-bloqueada.png) |
| Testar com modelo real e achar defeitos próprios | [Relatório do modelo aberto](docs/04-avaliacao/relatorio-modelo-aberto.md) |
| Devolver ao humano com contexto | Prints [04](docs/screenshots/04-fila-do-atendente.png), [05](docs/screenshots/05-detalhe-do-chamado-com-resumo.png), [08](docs/screenshots/08-lacunas-da-base.png) e [13](docs/screenshots/13-sugestao-de-artigo-v1.1.png) |

## Decisão difícil: o limiar de confiança
| | |
|---|---|
| Contexto | Abaixo de um limiar o agente recusa. Na rodada 1, a confiança das perguntas respondíveis (0,12 a 0,54) e a das fora da base (0,07 a 0,29) se sobrepunham. |
| Alternativas | Limiar fixo na similaridade (0,15); limiar mais cobertura mínima das palavras da pergunta; pedir ao modelo que diga o quanto está seguro. |
| Escolha | Similaridade com cobertura: limiar 0,16 e cobertura mínima 0,4. A recusa correta foi de 20% a 80% no desenvolvimento e de 60% a 80% na validação. |
| Custo aceito | O cliente fica sem resposta em alguns casos válidos, porque errei para o lado de recusar. F01 e F03 seguem respondidas sem base (confiança 0,33); nenhum limiar as separa. |
| A varredura | A melhor combinação foi 0,22 com cobertura 0,4, com 88% ([varredura](docs/04-avaliacao/varredura-limiar.txt)). Não adotei: seria ajustar de novo no mesmo conjunto, e a diferença é de uma pergunta. |
| Quando mudaria | Com o modelo real, medindo também a taxa de "o modelo disse que não sabe" como segundo sinal; com embeddings neurais, a calibragem seria refeita. |

## Evidências
- **Desenvolvimento (50 perguntas):** 66% na rodada 1 (commit `9642275`), 86% na rodada 2 e 86% na rodada 3 (commit `df23b60`), em 2026-10-23. A recusa correta foi de 20% a 80% e os adversariais ficaram em 100%. [Comparativo](docs/04-avaliacao/comparativo-rodadas.md).
- **Validação (20 perguntas):** 70% na rodada 1 (commit `402ff74`), 80% na 2 e 80% na 3 (commit `df23b60`), em 2026-10-23, o que mostra sobreajuste: +20 pontos onde ajustei e +10 onde não ajustei. [Análise de erros](docs/04-avaliacao/analise-de-erros.md).
- **Modelo aberto real (Groq, `gpt-oss-120b`), 2026-10-23:** 78% (desenvolvimento, gravado com `sem-commit`) e 70% (validação, commit `7364348`) como rodou; 90% e 90% na reavaliação offline, depois de eu corrigir dois defeitos meus (o avaliador e o tratamento da recusa do modelo). [Relatório](docs/04-avaliacao/relatorio-modelo-aberto.md).
- **Testes, 2026-10-24:** 83 de 83 no Vitest (commit `2cb000d`) e 14 de 14 no E2E (commit `fb6b3bc`). [Plano e resultados](docs/05-qualidade/plano-e-resultados.md).
- **Documentação, 2026-10-24 (commit `9e46e9f`):** 10 ADRs ([decisões](docs/03-arquitetura/decisoes.md)), 22 linhas de [rastreabilidade](docs/02-definicao/rastreabilidade.md), 31 artigos em 93 trechos e 13 prints na [galeria](docs/screenshots/README.md), mais o GIF `demo-agente.gif` (24 s, 3,6 MB).

## Limites
- O embedding por hashing não é semântico; os erros que sobraram são quase todos de vocabulário.
- A avaliação tem 70 perguntas, escritas por mim, e os adversariais são piso: eu escrevi as regras de entrada.
- A rodada com o Claude real não foi executada; custo e latência com ele não foram medidos ([relatório](docs/04-avaliacao/relatorio-claude.md)).
- Não medi cobertura de código nem acessibilidade, não fiz teste de carga e o login não limita tentativas. Não há CI configurada.
- A rodada `groq-1` está gravada com `sem-commit`: não é reproduzível a partir de um commit.

## Evolução prevista
- Rodar a avaliação com o Claude real e medir custo e latência.
- Trocar o hashing por embeddings semânticos e repetir a avaliação.
- Fechar o ciclo de feedback: respostas marcadas como incorretas viram perguntas de avaliação ([roadmap](docs/06-pos-lancamento/roadmap.md)).

## Licença
[MIT](LICENSE). O código roda localmente; as instruções estão em [CONTRIBUTING.md](CONTRIBUTING.md).
