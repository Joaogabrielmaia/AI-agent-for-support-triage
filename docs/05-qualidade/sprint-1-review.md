# Sprint 1 — Review: fundação e avaliação

> Nota: "sprint" aqui é um agrupamento lógico do backlog ([ver](../02-definicao/backlog-e-sprints.md)), não duas semanas de calendário. Não medi esforço, então não há velocidade nem horas.

**Objetivo:** ter um agente que busca, responde com fonte e recusa, **e uma régua para medi-lo**.

## O que entregou
| Entrega | Requisitos | Commit |
|---|---|---|
| Base com 31 artigos (a meta era ≥ 25), chunker por artigo e por seção, embedder local, busca | RF-01 | `9642275` |
| Pipeline: confiança, fontes, recusa, escalonamento, guardrails (a primeira versão já os incluía) | RF-02..05, RN-01..09 | `9642275` |
| `LlmProvider` + `MockProvider` + `AnthropicProvider` | RF-14 | `9642275` |
| Harness: 50 perguntas, pontuação, relatório | RF-12 | `9642275` |
| Rodada 1 (baseline) e conjunto de validação com 20 perguntas | RF-12 | `9bb6e4d` |
| Perfil ajustado, varredura, rodada 2 | RN-02 | `402ff74`, `df23b60` |

## Evidência
- [`relatorio-rodada-1.md`](../04-avaliacao/relatorio-rodada-1.md): **33/50 (66%)**.
- [`relatorio-rodada-2.md`](../04-avaliacao/relatorio-rodada-2.md): **43/50 (86%)**; validação **14/20 → 16/20**.
- [`analise-de-erros.md`](../04-avaliacao/analise-de-erros.md).

## O que não foi entregue / ficou diferente do plano
- Tudo o que dependia de **chave de API** ficou de fora: nenhuma execução com o Claude real.
- A rodada 2 mudou **cinco coisas juntas**. Não fiz ablação, então não sei a contribuição de cada uma.

## O que aprendi
1. Subir o limiar não bastava: as faixas de confiança se sobrepunham. Só ver a distribuição mostrou isso.
2. Um conjunto de validação escrito **antes** do ajuste mostrou que o ganho no desenvolvimento (+20) era maior que na validação (+10).
3. Dois erros meus de implementação foram pegos pelo próprio harness: o `\d` que virou `/d/` num patch de linha de comando (tokens com a letra "d" não eram truncados) e o `fit` do IDF que ainda usava o tokenizador sem prefixo. Os dois foram corrigidos antes das rodadas registradas.

## Próxima sprint
Ligar o agente a banco, autenticação e telas.
