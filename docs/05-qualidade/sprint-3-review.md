# Sprint 3 — Review: medir e fechar

> Nota: "sprint" é um agrupamento lógico, não calendário. Os commits desta sprint são `137349c` (junto com a sprint 2), `08596d8`, `2c2cb95` e `f0240fe`.

**Objetivo:** tornar a qualidade visível e provar que funciona.

## O que entregou
| Entrega | Requisitos | Onde |
|---|---|---|
| Avaliação "correta/incorreta" em tickets **e** em conversas resolvidas pelo agente | RF-09 | `transcript.tsx`, `conversas/` |
| Painel (categoria, resolução, escalonamento, qualidade, custo com ressalvas), lacunas com agrupamento, base, tela do relatório de avaliação | RF-10, RF-11, RF-12 | `painel/`, `lacunas/`, `base/`, `avaliacao/` |
| 78 testes unitários/integração no registro do commit `1640e4a` (83 no HEAD, ver [plano e resultados](plano-e-resultados.md)), incluindo segurança e paridade pgvector | RN-02..09 | `tests/` |
| 14 testes E2E contra o build de produção | todos | `tests/e2e/` |
| 13 prints reais gerados por script | — | `docs/screenshots/`, `scripts/screenshots.ts` |
| Rodada 3 de avaliação | RF-12 | `relatorio-rodada-3.md` |

## O que o trabalho de qualidade pegou
1. **Falha de produto:** o atendente só podia avaliar respostas dentro de chamados, mas as conversas resolvidas pelo agente (sem chamado) são justamente as que mais precisam de revisão. Criei a tela de **Conversas**.
2. **Erro visto ao vivo:** "Quanto custa o plano Profissional?" respondeu o preço do profissional adicional. Virou a rodada 3 (ADR-005).
3. **Limitação de agrupamento:** a mesma pergunta com palavras diferentes não agrupava como lacuna. Reescrevi o agrupamento (radicais + coeficiente de sobreposição) e criei teste.
4. **Lint de build:** `<a href="/">` no chat quebrou `next build`. Troquei por `Link`.
5. **E2E em `next dev`:** falha intermitente de `cookies()` na primeira requisição após compilação a frio. Passei o E2E a rodar contra o build de produção.

## O que **não** melhorou (honestidade)
- A **rodada 3 não mudou o total** (43/50 e 16/20): trocou erros de lugar.
- Os falsos positivos F01 e F03 continuam.

## Evidência
[`plano-e-resultados.md`](plano-e-resultados.md) e os três logs de execução.
