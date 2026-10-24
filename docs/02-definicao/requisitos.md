# Requisitos

Os IDs abaixo são usados nos commits, nos testes e na [matriz de rastreabilidade](rastreabilidade.md).

## Requisitos funcionais
| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | Base de conhecimento com **ao menos 25 artigos** em Markdown, divididos em trechos, com busca por similaridade sobre embeddings por hashing (não é busca semântica; ver [ADR-002](../03-arquitetura/decisoes.md#adr-002--embeddings-locais-e-pgvector)). | Must |
| RF-02 | O chat do cliente responde com base nos artigos. | Must |
| RF-03 | Toda resposta **cita as fontes** usadas e deixa abrir o trecho. | Must |
| RF-04 | Quando a confiança é baixa, o agente diz **"não tenho essa informação"**. | Must |
| RF-05 | **Escalonamento** para humano com resumo da conversa, categoria, prioridade e motivo. | Must |
| RF-06 | **Fila do atendente** com lista de chamados e filtros por status, categoria e prioridade. | Must |
| RF-07 | Detalhe do chamado com a conversa completa, fontes e confiança de cada resposta. | Must |
| RF-08 | Fluxo humano: o cliente pode pedir uma pessoa após uma recusa, e o atendente responde **na mesma conversa**. | Must |
| RF-09 | O atendente marca a resposta do agente como **correta ou incorreta**. | Must |
| RF-10 | **Painel**: volume por categoria, taxa de resolução pelo agente, taxa de escalonamento, custo estimado por conversa. | Should |
| RF-11 | **Lacunas**: perguntas sem resposta, agrupadas por semelhança. | Must |
| RF-12 | **Harness de avaliação**: 50 perguntas (30 respondíveis, 10 fora da base, 10 adversariais) com script que gera relatório. | Must |
| RF-13 | **(v1.1)** Sugestão de novos artigos a partir das lacunas. | Could |
| RF-14 | O modelo de linguagem fica atrás da interface `LlmProvider`, com um `MockProvider` determinístico. | Must |
| RF-15 | Autenticação por e-mail e senha, com papéis **Admin** e **Atendente**. | Must |

## Requisitos não funcionais
| ID | Requisito | Verificação |
|---|---|---|
| RNF-01 | Resposta do agente rápida o bastante para chat. **Meta (hipótese):** p95 ≤ 5 s com o Claude real. | Não medida. O Mock responde em milissegundos e não vale como prova. |
| RNF-02 | Custo baixo por conversa. **Meta (hipótese):** ≤ US$ 0,02. | Estimativa a partir de tokens aproximados; precisa de preços e de execução real. |
| RNF-03 | Dados pessoais mascarados antes de armazenar ou enviar ao modelo. | Testes unitários e de integração. |
| RNF-04 | Testável sem rede e sem chave de API. | `MockProvider`, busca em memória, paridade com pgvector testada. |
| RNF-05 | Segurança de acesso: sessão assinada, cookie `httpOnly`, senha com `scrypt`, guarda **no servidor** em toda rota e ação da equipe. | Testes unitários e E2E (rota sem login, papel errado). |
| RNF-06 | Acessibilidade: rótulos em todos os campos, `aria-live` no chat, foco visível, contraste de texto. | Revisão manual; sem auditoria automatizada neste repositório. |
| RNF-07 | Responsivo a partir de 375 px, sem rolagem horizontal. | E2E mobile + print 11. |
| RNF-08 | Roda **local** com Docker Compose. Sem deploy. | `docker-compose.yml`, README. |
| RNF-09 | Observabilidade da decisão: cada mensagem guarda tipo de resposta, confiança, fontes e o guardrail que disparou. | Visível na tela do chamado. |

## Metas de qualidade (hipóteses, **não resultados**)
| Meta | Valor-alvo (hipótese) | Como seria verificada |
|---|---|---|
| Resolução pelo agente | ≥ 40% das conversas sem chamado | Painel, com uso real |
| Respostas avaliadas como corretas | ≥ 90% | Avaliação dos atendentes |
| Recusa correta fora da base | ≥ 90% | Harness de avaliação |
| Comportamento seguro nos adversariais | 100% | Harness de avaliação e testes de segurança |
| Custo por conversa | ≤ US$ 0,02 | Execução com o Claude real |

Os resultados reais obtidos até aqui estão em [`../04-avaliacao/comparativo-rodadas.md`](../04-avaliacao/comparativo-rodadas.md). Eles ficam **abaixo** de algumas metas, e isso está discutido lá.
