# Reunião de aceitação (simulada) com resultado real

> Simulação: o Claude interpretou o cliente nesta conversa.

**Participantes:** João (eu), Renata Alves (líder de suporte), Carlos Nogueira (atendente) e Marina Lopes (cliente-tipo), todos interpretados pelo Claude.
**Como foi conduzida:** passei por cada história de [`historias-e-moscow.md`](../02-definicao/historias-e-moscow.md) e mostrei a **evidência real** (teste, print ou relatório). As falas são simuladas. **O que está na coluna "Evidência" é real.**

## Resultado por história
| História | Veredito | Evidência real | Ressalva |
|---|---|---|---|
| HU-01 Resposta com fonte | **Atende** | E2E "resposta com fontes"; print 01 | O texto do Mock é extrativo e às vezes começa pela frase menos relevante (print 01: a primeira frase é do preço do profissional adicional). Com o Claude, a redação seria outra, **não medido**. |
| HU-02 Recusa honesta | **Atende parcialmente** | E2E "recusa honesta"; print 02; avaliação: 8 de 10 fora da base recusadas (rodada 3) | **2 de 10 ainda são respondidas sem base** (F01 WhatsApp, F03 CNPJ). Na validação, 1 de 5 (H12). |
| HU-03 Encaminhamento com contexto | **Atende** | E2E "pedido sensível"; `pipeline.test.ts`; prints 03 e 05 | — |
| HU-04 Fila | **Atende** | E2E "fila: filtros…"; print 04 | — |
| HU-05 Avaliar a resposta | **Atende** | E2E "avaliada como incorreta"; print 06 | A avaliação existe, mas ninguém a usa de verdade ainda: a taxa do painel vem de dados de demonstração. |
| HU-06 Painel | **Atende com ressalva** | E2E "admin vê painel"; print 07 | "Resolvida pelo agente" significa "teve resposta e não gerou chamado". O cliente **não confirma**. Custo só aparece com preços configurados. |
| HU-07 Lacunas | **Atende** | `kb-and-metrics.test.ts` (agrupamento), print 08 | O agrupamento é lexical: perguntas parecidas com palavras muito diferentes não juntam. |
| HU-08 Proteção | **Atende** para o que está coberto | `guardrails.test.ts`, `security.test.ts` | Nomes e endereços não são mascarados. Regras de injeção só cobrem padrões conhecidos. |
| HU-09 Avaliar o agente | **Atende parcialmente** | `docs/04-avaliacao/` | A rodada com o **Claude real está em branco**. |
| HU-10 Papéis | **Atende** | E2E (3 testes) | Sem limite de tentativas de login. |
| HU-11 Sugestão de artigos (v1.1) | **Atende** | E2E v1.1; print 13 | O rascunho é só esqueleto, de propósito. |

## O que cada pessoa disse (simulado)
- **Renata (líder):** "Aceito o protótipo com duas condições. A primeira: eu quero ver o resultado com o modelo de verdade antes de qualquer decisão, porque tudo que você me mostrou é o Mock. A segunda: não chamem de 'resolução' o que é só 'não virou chamado'. Gostei que o número aparece com essa ressalva na tela." — **Ação:** a ressalva já aparece no painel; a rodada com o Claude virou item nº 1 do roadmap.
- **Carlos (atendente):** "O resumo e o motivo no chamado me poupam a pergunta de sempre. Gostei de poder marcar 'incorreta'. Eu quero que a marcação **volte** para melhorar a base, e hoje ela só alimenta um percentual." — **Ação:** registrado no roadmap (ciclo de feedback).
- **Marina (cliente):** "A recusa honesta me convenceu. O botão de falar com uma pessoa ajudou. Mas se ele recusa uma coisa que está no manual e me responde errado outra, eu perco a confiança igual." — **Ação:** reconhece a limitação dos erros de F01/F03; está documentada.

## Decisão da reunião (simulada)
Aceite **condicional** do protótipo. Condições: (1) rodar a avaliação com o Claude real, (2) manter o rótulo "sem chamado" na taxa de resolução, (3) tratar os 2 falsos positivos fora da base (F01, F03) com uma verificação de "a fonte responde de fato?" antes de qualquer uso por clientes de verdade.

> Lembrete: não existe cliente real nem uso real. Isto é um estudo, e o "aceite" é um exercício de avaliação de critérios.
