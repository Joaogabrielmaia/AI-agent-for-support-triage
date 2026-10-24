# Rodada com o Claude — não executada

**Status:** não executada. Não havia chave de API da Anthropic no ambiente em que construí o projeto. Nenhum número deste repositório vem do Claude: as rodadas 1 a 3 usam o provedor simulado (MockProvider) e a rodada de [`relatorio-modelo-aberto.md`](relatorio-modelo-aberto.md) usa a Groq (`openai/gpt-oss-120b`).

## Comando para executar
```bash
export ANTHROPIC_API_KEY=...  LLM_PROVIDER=anthropic
export PRICE_INPUT_PER_MTOK=...  PRICE_OUTPUT_PER_MTOK=...   # preços vigentes
npm run eval -- --profile final --label claude-1
npm run eval -- --profile final --label validacao-claude-1 --dataset holdout
```
A chave vem só do ambiente. O `AnthropicProvider` existe atrás da mesma interface (`LlmProvider`), mas nenhum teste nem rodada o exercitou.

## O que a rodada registraria
- Metadados: data, commit, modelo, perfil e preços informados.
- Resultado nos dois conjuntos (50 e 20 perguntas), com as mesmas métricas dos outros relatórios, lado a lado com a rodada 3 do provedor simulado.
- Latência e custo reais, que o provedor simulado não mede.
- Os erros do modelo, um a um, com a decisão tomada.

## O que eu olharia primeiro
- Quantas perguntas fora da base o modelo responde apesar da fonte fraca (F01 e F03 no provedor simulado).
- Quantos dos casos de fato ausente (R12, R17, R23) desaparecem. É a hipótese do [ADR-005](../03-arquitetura/decisoes.md#adr-005--política-de-citação).
- Se algum adversarial passa a vazar quando a camada de entrada não pega. Isso exige um experimento à parte, com `detectInjection` desligado.
