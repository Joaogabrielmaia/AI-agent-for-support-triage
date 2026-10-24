# Episódio 3 — Arquitetura

Dez decisões de arquitetura (ADR-001 a ADR-010), cada uma com contexto, alternativas, escolha, motivo, trade-off e quando eu mudaria. Três pesam mais: o ADR-004 (limiar de confiança 0,16 e cobertura mínima 0,4, medidos no harness), o ADR-007 (quatro camadas contra prompt injection, com o limite declarado) e o ADR-010 (como avaliar sem se enganar, com conjunto de validação separado).
O ADR-002 registra a maior limitação: o embedding por hashing casa palavras, não significados. O modelo de dados e os diagramas de sequência cobrem a pergunta respondível e o pedido sensível, além dos modos de falha.

| Documento | O que contém | Itens |
|---|---|---|
| [Decisões (ADR-001 a 010)](decisoes.md) | Contexto, alternativas, escolha, trade-off e quando mudaria | 10 ADRs |
| [Modelo de dados](modelo-de-dados.md) | Tabelas, relações e decisões de modelagem | — |
| [Sequência e modos de falha](sequencia-e-falhas.md) | Componentes, duas sequências e o que acontece quando algo falha | 2 sequências |

[← Anterior](../02-definicao/README.md) · [Índice](../INDEX.md) · [Próximo →](../04-avaliacao/README.md)

---

