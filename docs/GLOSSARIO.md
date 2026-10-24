# Glossário

Termos usados neste projeto, com uma linha cada e o lugar onde aparecem. Voltar ao [guia da série](INDEX.md).

| Termo | O que significa | Onde aparece |
|---|---|---|
| **ADR** | Registro de decisão de arquitetura: contexto, alternativas, escolha, motivo, trade-off e quando mudaria. | [decisoes.md](03-arquitetura/decisoes.md) |
| **RAG** | O agente busca trechos de uma base de artigos e responde com base neles, citando a fonte, em vez de responder só de memória. | [ADR-001](03-arquitetura/decisoes.md#adr-001--rag-vs-ajuste-fino-vs-regras) |
| **Embedding** | Transformação de um texto em uma lista de números para comparar textos por semelhança. Aqui é feito por hashing local, que casa palavras e não significados. | [ADR-002](03-arquitetura/decisoes.md#adr-002--embeddings-locais-e-pgvector) |
| **pgvector** | Extensão do PostgreSQL que guarda esses vetores e faz a busca por semelhança. | [ADR-002](03-arquitetura/decisoes.md#adr-002--embeddings-locais-e-pgvector) |
| **Limiar de confiança** | Nota mínima para o agente responder; abaixo dela, ele recusa. Aqui: 0,16, com cobertura mínima de 0,4 das palavras da pergunta. | [ADR-004](03-arquitetura/decisoes.md#adr-004--limiar-de-confiança-e-como-medi-lo) |
| **Escalonamento** | Passar o caso a uma pessoa, com resumo, categoria, prioridade e motivo. Reembolso, cobrança, identidade e dados sempre escalam. | [regras de negócio](02-definicao/regras-de-negocio.md) |
| **Guardrail** | Regra de proteção no código, fora do modelo: mascarar dados pessoais, bloquear injeção e filtrar promessas na saída. | [ADR-006](03-arquitetura/decisoes.md#adr-006--mascaramento-de-dados-pessoais), [ADR-007](03-arquitetura/decisoes.md#adr-007--prompt-injection) |
| **Injeção de prompt** | Mensagem que tenta fazer o agente ignorar suas regras ou revelar suas instruções. | [ADR-007](03-arquitetura/decisoes.md#adr-007--prompt-injection) |
| **Provedor de modelo** | O componente que fala com o modelo de linguagem, atrás de uma interface. Há o provedor simulado (MockProvider), o da Groq e o da Anthropic. | [ADR-008](03-arquitetura/decisoes.md#adr-008--abstração-do-provedor-de-linguagem) |
| **Provedor simulado (MockProvider)** | Provedor sem modelo real: monta a resposta copiando frases dos trechos. Mede busca, limiar, escalonamento e guardrails, não a redação do Claude. | [metodologia](04-avaliacao/metodologia.md) |
| **Conjunto de desenvolvimento e de validação** | As 50 perguntas usadas para decidir os ajustes e as 20 separadas, escritas antes, que só medem no fim. | [ADR-010](03-arquitetura/decisoes.md#adr-010--como-avaliar-sem-se-enganar) |
| **Sobreajuste** | Ganhar nota no conjunto em que se ajustou mais do que em perguntas novas. Aqui: +20 pontos no desenvolvimento e +10 na validação. | [comparativo](04-avaliacao/comparativo-rodadas.md), [análise de erros](04-avaliacao/analise-de-erros.md) |
| **Perguntas adversariais** | Perguntas escritas para tentar enganar o agente (injeção, dados de terceiros). | [metodologia](04-avaliacao/metodologia.md) |
| **Reavaliação offline** | Pontuar de novo respostas já gravadas, com o avaliador corrigido, sem chamar o modelo outra vez. | [relatório do modelo aberto](04-avaliacao/relatorio-modelo-aberto.md) |
| **RF, RNF, RN, HU** | Requisito funcional, requisito não funcional, regra de negócio e história de usuário. | [requisitos](02-definicao/requisitos.md) |
| **MoSCoW** | Prioridade em Must, Should, Could e Won't. | [histórias](02-definicao/historias-e-moscow.md) |
| **AS-IS / TO-BE** | O processo de suporte como é hoje e como fica com o agente. | [análise dos chamados](01-discovery/06-analise-dos-chamados-e-as-is.md) |
