# 03 · Reunião 1 — Líder de suporte (Renata Alves)

> Reunião simulada; pessoas e empresa fictícias.

**Participantes:** João (eu) e Renata Alves (líder de suporte da Agenda Bela, personagem fictícia).
**Objetivo:** entender o que ela quer do agente, o que teme e o que muda o escopo.

## Resumo da conversa
Renata abriu dizendo que o time está afogado em pergunta repetida: "preço do plano, como cancelar, esqueci a senha, como importar cliente. É toda semana, é a mesma coisa." Quer **reduzir o volume**, e disse isso duas vezes. Quando perguntei o que mais a preocupava, o tom mudou: "Se o robô falar um preço errado ou prometer devolver dinheiro, eu que atendo a reclamação depois."

## Pedidos vagos que eu refinei
| O que ela disse | O que eu perguntei | Requisito refinado |
|---|---|---|
| "Quero que o robô resolva a maioria" | "Maioria de quê? Você me dá 3 assuntos que ele **não** pode resolver?" | Reembolso, cobrança contestada e exclusão de dados vão sempre para uma pessoa → RN-04. |
| "Tem que ser seguro" | "Seguro é não errar ou é não prometer?" | Os dois, mas o pior é prometer. Nada de prazo, reembolso ou exceção → RN-09. |
| "Quero saber o que o cliente pergunta" | "Você quer um relatório ou uma lista de perguntas sem resposta?" | A lista de perguntas sem resposta, agrupadas → RF-11. |
| "Tem que ser rápido" | "Rápido quanto?" | Não soube dizer. Deixei como hipótese de meta (RNF-01), sem número firme. |

## Contradições que apareceram
1. **Reduzir volume × medo de erro.** Quanto mais o robô responde, mais chance de erro. Combinamos que o agente **prefere recusar a arriscar**: se a confiança for baixa, ele diz "não tenho essa informação" e oferece uma pessoa.
2. **"O robô resolve" × "quero ver tudo que ele fez".** Ela quer autonomia e auditoria ao mesmo tempo. Resultado: toda resposta guarda fontes, confiança e, se bloqueada, o motivo (RNF-09), visíveis para a equipe.

## A restrição que mudou o escopo
Perto do fim, Renata lembrou de uma regra da empresa: **só o financeiro decide reembolso, desconto e exceção de cobrança**, e o suporte não pode confirmar nada disso nem por e-mail.

- **Efeito no escopo:** o agente deixou de ser "resolve o que puder" e virou "**resolve o que está na base, escala o que envolve dinheiro ou identidade**". Isso criou a lista de assuntos que sempre escalam (RN-04), o filtro de saída contra promessas e preços não fundamentados (RN-08, RN-09) e a regra de que cada escalonamento chega com **motivo** para o financeiro.
- **Custo:** a taxa de resolução esperada cai, porque uma parte dos chamados nunca será resolvida pelo agente. Aceitei, porque é o preço de a líder confiar no sistema.

## Decisões e pendências
| Item | Resultado |
|---|---|
| Escopo | FAQ + triagem + lacunas. Sem sugestão de resposta ao atendente no MVP. |
| Assuntos que sempre escalam | Reembolso, cobrança contestada, exclusão de dados, recuperação de acesso, pedido comercial, ameaça jurídica, perda de dados. |
| Pendente | Ela vai pensar em qual prioridade cada um deve ter. Eu propus uma tabela (RN-05) para ela criticar na aceitação. |
