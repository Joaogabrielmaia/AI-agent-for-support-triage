# 05 · Reunião 3 — Cliente-tipo (Marina Lopes, dona de salão)

> Reunião simulada; pessoas e empresa fictícias.

**Participantes:** João (eu) e Marina Lopes (dona de um salão com 4 profissionais, cliente da Agenda Bela, personagem fictícia).
**Objetivo:** ver o suporte pelo lado de quem pergunta.

## Resumo da conversa
Marina é prática e sem paciência para suporte. Quando precisa de ajuda é no meio do atendimento, com cliente na cadeira. "Eu não quero ler artigo. Quero a resposta e quero saber se posso confiar." Disse que já desistiu de chatbots que respondem uma coisa que não tem a ver e não deixam falar com ninguém.

## O que ela quer
1. Resposta **curta e direta**, com um jeito de conferir (a fonte).
2. Que o robô **diga quando não sabe**, em vez de enrolar.
3. Que dê para **chegar numa pessoa** sem repetir a história.

## Pedidos vagos que eu refinei
| O que ela disse | Refinamento | Requisito |
|---|---|---|
| "Quero confiar" | "Confiar como?" Ela: "Saber de onde veio." | Citar a fonte de cada resposta e deixar abrir o trecho → RF-03. |
| "Não quero repetir tudo" | O chat guarda a conversa e o resumo vai junto para o atendente. | RF-05, RF-08. |
| "Tem que funcionar no celular" | Ela atende em pé, com o celular na mão. | RNF-07 (layout a partir de 375 px). |

## A restrição que mudou o escopo
Ela tem uma clínica de estética no mesmo prédio e guarda **fichas com alergias e observações de saúde** dos clientes. Quando soube que o assistente usa um modelo de linguagem, perguntou: "Isso vai pra internet? Meus clientes não assinaram nada pra isso."

- **Efeito:** transformei em requisito que **dados pessoais são mascarados antes de serem guardados ou enviados ao modelo** (CPF, e-mail, telefone, cartão, CNPJ → RN-06), e que o agente **não consulta fichas de clientes finais** nem dados de outras contas (RN-07). O chat responde sobre o produto, não sobre as pessoas atendidas no salão.
- **Custo:** o agente não consegue personalizar a resposta com dados da conta da Marina. Ele responde igual para todo mundo.

## Contradição
Marina quer ser atendida **rápido** pelo robô, mas também quer **falar com uma pessoa** quando não resolve. Conciliei assim: o robô recusa com honestidade e oferece um botão **"Falar com uma pessoa da equipe"** logo abaixo da recusa, em vez de esconder a opção.

## O que aprendi
Pelo lado do cliente, a recusa honesta **é um recurso**, não um defeito. Isso mudou o texto da recusa (agora ele diz "prefiro não arriscar um palpite") e a posição do botão.
