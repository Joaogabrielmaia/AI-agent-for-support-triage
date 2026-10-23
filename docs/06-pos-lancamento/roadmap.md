# Roadmap

Ordenado por **o que mais reduz a incerteza**, e não por o que é mais legal. Tudo aqui é plano, não promessa.

## Próximos passos
| # | Item | Por quê | Como saberei que funcionou |
|---|---|---|---|
| 1 | **Rodar a avaliação com o Claude real** ([instruções](../04-avaliacao/relatorio-claude.md)) | É a maior lacuna: nenhum número fala do Claude (só do Mock e de uma execução da Groq). | Relatório preenchido; ADR-005 confirmada ou revertida. |
| 2 | **Fechar o ciclo de feedback:** respostas "incorretas" viram perguntas de avaliação | Dá uso à marcação do atendente e traz casos reais. | O conjunto de avaliação cresce sem eu escrever. |
| 3 | **Embeddings semânticos** no lugar do hashing (mantendo pgvector) | Os erros restantes são de vocabulário (ADR-002). | Mesma avaliação, comparando rodadas. |
| 4 | **Segundo sinal de confiança:** "a fonte responde mesmo à pergunta?" | F01 e F03 não se separam por limiar (ADR-004). | Os dois fora da base passam a ser recusados sem derrubar respondíveis. |
| 5 | **Ablação** dos ajustes da rodada 2 | Saber o que cada mudança contribuiu. | Tabela com uma mudança por vez. |
| 6 | **Limite de tentativas de login** e recuperação de senha | Lacuna de segurança conhecida (ADR-009). | Teste E2E de bloqueio. |
| 7 | **Checagem de versão do embedder** nos vetores | Evita busca com lixo se o embedder mudar. | Falha clara ao subir, com teste. |
| 8 | **Perguntas de validação escritas por outra pessoa** | Reduz o viés de eu ser autor de tudo. | Conjunto externo, congelado. |

## Ideias que ficaram de fora de propósito
- **Sugestão de resposta ao atendente** (o Carlos pediu). Adia por risco: primeiro a qualidade do agente precisa estar medida com o Claude.
- **WhatsApp, voz, treinamento de modelo, multiempresa:** fora do escopo definido.
- **Confirmação do cliente ("isso resolveu?")** para uma taxa de resolução de verdade.

## Versões
| Versão | Conteúdo |
|---|---|
| [1.0.0](../../CHANGELOG.md) | MVP |
| [1.1.0](../../CHANGELOG.md) | Sugestões de novos artigos a partir das lacunas |
