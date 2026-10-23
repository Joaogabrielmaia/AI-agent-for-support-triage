# Relatório de avaliação com o Claude real — **A PREENCHER**

> **Status: não executado.** Não havia chave de API da Anthropic no ambiente em que construí este projeto, então **todos os campos abaixo estão vazios de propósito**. Não estimei, não copiei do Mock e não inventei nenhum número. Quem rodar preenche.

## Passo a passo para rodar
1. Tenha uma chave de API da Anthropic e confira o modelo e os preços vigentes na documentação da Anthropic.
2. Na raiz do repositório, **no terminal** (nunca em arquivo versionado):
   ```bash
   export ANTHROPIC_API_KEY="..."            # PowerShell: $env:ANTHROPIC_API_KEY="..."
   export LLM_PROVIDER=anthropic
   export ANTHROPIC_MODEL=claude-haiku-5-5    # ou o modelo que quiser comparar
   export PRICE_INPUT_PER_MTOK=...            # preço vigente por milhão de tokens de entrada (USD)
   export PRICE_OUTPUT_PER_MTOK=...           # idem, de saída
   ```
3. Rode o desenvolvimento e a validação com o perfil final:
   ```bash
   npm run eval -- --profile final --label claude-1
   npm run eval -- --profile final --label validacao-claude-1 --dataset holdout
   npm run eval:compare   # depois de ajustar eval/compare.ts para incluir os rótulos claude-1
   ```
4. O script grava `relatorio-claude-1.md` e `resultados-claude-1.json` aqui. Copie os números para as tabelas abaixo.
5. Os campos de latência e custo ficam **reais** (há chamada de rede e tokens contados pela API) se o provedor for o Claude.

## O que olhar primeiro
- Quantas **fora da base** o Claude responde apesar da fonte fraca? (No Mock, F01 e F03.)
- Quantas **fato ausente** do Mock (R12, R17, R23) desaparecem? Isso testa a hipótese do [ADR-005](../03-arquitetura/decisoes.md#adr-005--política-de-citação).
- Algum adversarial **passa a vazar** quando a camada de entrada não pega? Rode também desligando `detectInjection` num experimento à parte, para medir o prompt sozinho.

## Metadados da execução
| Campo | Valor |
|---|---|
| Data | |
| Commit | |
| Modelo | |
| Perfil | final |
| Preço de entrada (US$/Mtok) | |
| Preço de saída (US$/Mtok) | |

## Resultado — conjunto de desenvolvimento (50 perguntas)
| Métrica | Mock (rodada 3, real, já registrada) | Claude |
|---|---|---|
| Aprovadas | 43/50 (86,0%) | |
| Respondíveis aprovadas | 83,3% | |
| Respondíveis: correção | 83,3% | |
| Respondíveis: fundamentação | 90,0% | |
| Fora da base: recusa correta | 80,0% | |
| Adversariais seguras | 100,0% | |
| Latência mediana por pergunta | milissegundos (sem rede, não comparável) | |
| Latência máxima | idem | |
| Tokens por pergunta | aproximação caracteres ÷ 4 | |
| Custo total do conjunto (US$) | não aplicável | |
| Custo médio por pergunta (US$) | não aplicável | |

## Resultado — conjunto de validação (20 perguntas)
| Métrica | Mock (rodada 3) | Claude |
|---|---|---|
| Aprovadas | 16/20 (80,0%) | |
| Respondíveis aprovadas | 70,0% | |
| Fora da base: recusa correta | 80,0% | |
| Adversariais seguras | 100,0% | |

## Erros do Claude e análise
| ID | Veredito | O que aconteceu | Decisão |
|---|---|---|---|
| | | | |

## Conclusão (escrever só depois dos números)

