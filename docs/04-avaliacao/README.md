# Episódio 4 — Avaliação

Este é o episódio central. O conjunto de desenvolvimento tem 50 perguntas e o de validação, 20, escritas antes do ajuste. A rodada 1 acertou 66% no desenvolvimento e 70% na validação. Os 17 erros da rodada 1 foram agrupados por causa e viraram decisões (confiança com cobertura, trechos por seção, sinônimos). 

A rodada 2 chegou a 86% e 80%, com duas regressões admitidas (R01 e R23); a rodada 3 não mudou o total.

O ganho foi de +20 pontos onde ajustei e de +10 onde não ajustei: é sobreajuste, e só apareceu porque separei os conjuntos. Uma execução com a Groq (`openai/gpt-oss-120b`) achou dois defeitos meus, no avaliador e no pipeline, e a reavaliação offline subiu o resultado para 90% e 90%, com ressalvas. A rodada com o Claude não foi executada.

Nota: a rodada `groq-1` está gravada com `sem-commit`; não é reproduzível a partir de um commit.

| Documento | O que contém | Itens |
|---|---|---|
| [Metodologia](metodologia.md) | O que se mede, critérios e o que o resultado não significa | 50 + 20 perguntas |
| [Comparativo entre rodadas](comparativo-rodadas.md) | Tabelas geradas dos JSONs, com os vereditos que mudaram | 5 colunas por conjunto |
| [Análise de erros](analise-de-erros.md) | Erros da rodada 1, causa e decisão; o que ainda falha | 17 erros |
| [Varredura de limiar](varredura-limiar.txt) | Limiar × cobertura mínima no conjunto de desenvolvimento | 15 melhores pontos |
| [Relatório do modelo aberto (Groq)](relatorio-modelo-aberto.md) | Como rodou, reavaliado offline e ressalvas | 78% / 70% → 90% / 90% |
| [Rodada com o Claude](relatorio-claude.md) | Não executada; comando para executar | — |
| Relatórios gerados | [rodada 1](relatorio-rodada-1.md) · [2](relatorio-rodada-2.md) · [3](relatorio-rodada-3.md) · [validação 1](relatorio-validacao-rodada-1.md) · [2](relatorio-validacao-rodada-2.md) · [3](relatorio-validacao-rodada-3.md) · [groq-1](relatorio-groq-1.md) · [validação groq-1](relatorio-validacao-groq-1.md) | 8 relatórios |

[← Anterior](../03-arquitetura/README.md) · [Índice](../INDEX.md) · [Próximo →](../05-qualidade/README.md)

---

