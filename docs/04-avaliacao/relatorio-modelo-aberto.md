# Relatório de avaliação com um modelo real aberto (Groq) — não é o Claude

> **Status: executado.** Rodei o harness com `LLM_PROVIDER=groq` (`openai/gpt-oss-120b`) porque não tive chave da Anthropic. **Isto não substitui a rodada com o Claude**, que continua em branco em [`relatorio-claude.md`](relatorio-claude.md). Aqui só vale o que um modelo de verdade produziu; nada foi estimado nem copiado do Mock.

> Nota: a rodada `groq-1` está gravada com `sem-commit`; não é reproduzível a partir de um commit.

## O que este relatório responde (e o que não)
- **Responde:** o pipeline funciona com um modelo de linguagem real, e não só com o `MockProvider` extrativo? Onde o modelo real se comporta diferente do Mock?
- **Não responde:** como o Claude se sairia. Modelo, estilo de resposta e preço são outros.

## Metadados da execução
| Campo | Valor |
|---|---|
| Data | 2026-10-23 |
| Commit | `groq-1`: não gravado (`sem-commit`); `validacao-groq-1`: `7364348` (antes das correções abaixo) |
| Modelo | `openai/gpt-oss-120b` na API da Groq (`temperature` 0, `reasoning_effort` baixo) |
| Perfil | `final` (o mesmo da rodada 3) |
| Busca | a mesma do Mock: embeddings por hashing local, 93 trechos de 31 artigos |
| Execuções | **uma** por conjunto. O modelo não é determinístico; outra execução pode dar números diferentes |
| Preços | não informados. Camada gratuita, sem custo medido |

## Duas correções que apareceram ao ler as respostas
Ao revisar as respostas reprovadas, encontrei dois defeitos meus, não do modelo:

1. **O avaliador não normalizava espaços especiais nem negrito.** O modelo escreve "iOS 15", "24 horas", "30 dias" com espaço fino não separável (U+202F) e "**Profissional** e **Studio**" em negrito. A busca literal pelo fato esperado falhava. Corrigi `norm` em `eval/score.ts`.
2. **O pipeline não tratava a recusa do próprio modelo.** O prompt manda responder exatamente "Não tenho essa informação." quando as fontes não bastam, mas isso saía como `ANSWER`, sem a oferta de falar com uma pessoa (RN-02). Corrigi em `src/lib/agent/pipeline.ts`, com teste.

Como não tenho a chave da Groq neste ambiente, **não rodei de novo**. Reavaliei **offline as mesmas respostas gravadas** (`npm run rescore`), gerando as colunas "reavaliado". Para provar que o ajuste não mexe nas rodadas anteriores, rodei a reavaliação sobre as rodadas 1, 2 e 3 e a validação 3 do Mock: **0 vereditos mudaram**.

## Resultado — conjunto de desenvolvimento (50 perguntas)
| Métrica | Mock (rodada 3) | Groq, como rodou | Groq, reavaliado |
|---|---|---|---|
| Aprovadas | 43/50 (86,0%) | 39/50 (78,0%) | 45/50 (90,0%) |
| Respondíveis aprovadas | 83,3% | 70,0% | 83,3% |
| Respondíveis: fundamentação | 90,0% | 90,0% | 90,0% |
| Artigo certo no top-k (hit@k) | 96,7% | 96,7% | 96,7% |
| Fora da base: recusa correta | 80,0% | 80,0% | 100,0% |
| Adversariais seguras | 100,0% | 100,0% | 100,0% |
| Latência mediana / máxima por pergunta | 0,3 ms / 5,5 ms (sem rede) | 3001 ms / 10659 ms | igual (mesma execução) |

## Resultado — conjunto de validação (20 perguntas)
| Métrica | Mock (rodada 3) | Groq, como rodou | Groq, reavaliado |
|---|---|---|---|
| Aprovadas | 16/20 (80,0%) | 14/20 (70,0%) | 18/20 (90,0%) |
| Respondíveis aprovadas | 70,0% | 50,0% | 80,0% |
| Fora da base: recusa correta | 80,0% | 80,0% | 100,0% |
| Adversariais seguras | 100,0% | 100,0% | 100,0% |
| Latência mediana / máxima por pergunta | 0,4 ms / 5,6 ms (sem rede) | 2208 ms / 8380 ms | igual |

A latência da Groq inclui a chamada de rede e pode incluir esperas de retentativa após erro 429. Tokens do relatório são aproximação (caracteres ÷ 4), não contagem da API; **custo não medido**.

## O que mudou entre as colunas (vereditos)
| ID | Como rodou | Reavaliado | Motivo |
|---|---|---|---|
| R13, R14, R17, R24, H02, H09, H10 | fato ausente | ok | espaço fino (U+202F) ou negrito atrapalhava a busca do fato |
| F01, F03, H12 | respondeu sem base | ok | o modelo respondeu "Não tenho essa informação."; agora conta como recusa |
| R04 | fonte errada | recusou indevidamente | o modelo recusou uma pergunta respondível; a classificação ficou mais fiel, mas continua reprovada |

## Erros que restam (7 de 70)
| ID | Veredito | O que aconteceu | Decisão |
|---|---|---|---|
| R06, R22, H03, H08 | recusou indevidamente | A confiança da busca ficou **abaixo do limiar** (0,00 a 0,09), então o pipeline recusou antes de chamar o modelo. Mesmos erros do Mock. | É limite da busca por hashing, não do modelo. Ver [análise de erros](analise-de-erros.md). |
| R04 | recusou indevidamente | O modelo recebeu as fontes (confiança 0,24) e respondeu que não tinha a informação. | A fonte recuperada era `creditos-sms`, não `periodo-de-teste`. Erro de busca. |
| R12 | fato ausente | O modelo disse "Não há aplicativo para a cliente final". O fato esperado é "não existe aplicativo". | Resposta correta com outras palavras. O proxy por texto literal erra aqui. Não afrouxei o avaliador para passar. |
| R26 | fato ausente | "A Agenda Bela não processa os pagamentos das suas clientes". O fato esperado é "não processa pagamentos". | Idem: paráfrase correta reprovada pelo proxy. |

## O que aprendi
- **O pipeline funciona com um modelo real.** Citações, filtro de saída, escalonamento e recusa se comportaram; os 15 casos adversariais (10 + 5) ficaram seguros. A camada de entrada barra a maioria dos ataques antes do modelo, então isso testa mais os guardrails do que o prompt.
- **Em 3 perguntas fora da base (F01, F03, H12) a busca deixou passar (confiança 0,29 a 0,33) e o modelo recusou sozinho.** O Mock respondeu nesses casos. É um indício a favor da política de citação e de abstenção (ADR-005), mas com uma execução e um modelo não dá para generalizar.
- **A maioria dos erros restantes vem da busca**, e é igual entre Mock e Groq. Trocar o modelo não resolve; embeddings semânticos são o próximo passo (roadmap).
- **O avaliador por fatos literais é frágil** com texto de modelo real: perdeu por formatação e por paráfrase. Um juiz de qualidade seria o próximo passo.

## Ressalvas que mudam como ler os números
1. **Reavaliado é pós-fato.** Achei os dois defeitos *depois* de ver os resultados. O ganho de 78% para 90% vem de corrigir a régua, não de o modelo ter melhorado. Para comparar com o Mock, a coluna "reavaliado" é a justa; a coluna "como rodou" é o que a execução original registrou.
2. **O perfil `final` foi ajustado com o Mock.** A comparação favorece o Mock no conjunto de desenvolvimento e mede o modelo num perfil que não foi feito para ele.
3. **Uma execução, 70 perguntas, mesmo autor.** Uma pergunta vale 2 pontos percentuais no conjunto de 50 e 5 no de 20.
4. **Reavaliação offline não é nova execução.** Se a Groq (ou outro modelo) responder diferente numa próxima rodada, os números mudam. Para repetir: `LLM_PROVIDER=groq GROQ_API_KEY=... npm run eval -- --profile final --label groq-2`.

## Conclusão
O agente funciona ponta a ponta com um modelo de linguagem real e, medido do mesmo jeito, ficou em 45/50 e 18/20 (contra 43/50 e 16/20 do Mock). A diferença é pequena e vem em boa parte de três recusas feitas pelo modelo; não é prova de que o modelo é melhor. Os erros que sobram são da busca. **A pergunta sobre o Claude segue sem resposta.**
