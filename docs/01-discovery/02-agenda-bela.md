# 02 · O negócio: Agenda Bela

> Todo o conteúdo abaixo descreve uma empresa **fictícia**. Os números de volume e repetição são **premissas do caso**, definidas por mim para o estudo. Não são medições.

## Quem é
SaaS de agendamento para salões e clínicas de estética. **8 pessoas** na empresa, **3 no suporte**: Renata Alves (líder de suporte), Carlos Nogueira e Débora Tavares (atendentes). Os clientes da Agenda Bela são donos de salão e de clínica, que usam o sistema para agenda, clientes, comanda e comissões.

## Premissas do caso
| Item | Premissa | Observação |
|---|---|---|
| Canais | Chat dentro do painel e e-mail. Sem telefone. | Consistente com a base de conhecimento. |
| Horário | Seg–sex 8h–18h, sáb 9h–13h (Brasília) | Fora disso, a fila espera. |
| Volume | Cerca de 60 chamados por semana | Premissa. Ninguém mediu. |
| Repetição | A líder estima que "uns 6 em cada 10" são perguntas repetidas | Estimativa de uma pessoa, a validar. |
| Maior pergunta repetida | Preço dos planos, cancelamento, senha, importar clientes, lembretes | Vem das reuniões simuladas. |

## A dor
1. **Perguntas repetidas** tomam o tempo de quem deveria resolver casos difíceis (cobrança, acesso, perda de dados).
2. **Fora do horário** o cliente fica sem resposta e abre vários chamados.
3. **Falta de contexto**: quando o chamado chega para um atendente, ele precisa perguntar tudo de novo.

## O medo
> "Robô dar informação errada." — Renata, líder de suporte (simulada)

Em software de agenda, informação errada tem custo direto: preço errado vira discussão de cobrança, prazo errado vira reclamação, e "pode devolver o dinheiro" dito por um robô vira promessa. Esse medo virou **requisito** e não detalhe: ver as regras RN-02 a RN-09 em [`../02-definicao/regras-de-negocio.md`](../02-definicao/regras-de-negocio.md).

## O que eu **não** sei (e deixei como hipótese)
- Quanto do volume real o agente consegue resolver.
- Quanto custa uma conversa com o Claude em produção.
- Se os clientes aceitam falar com um assistente automático.

Essas três coisas só uma execução real responderia. Estão como hipóteses em [`../02-definicao/requisitos.md`](../02-definicao/requisitos.md).
