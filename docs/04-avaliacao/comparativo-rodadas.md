# Comparativo entre rodadas

> Gerado por `npm run eval:compare` a partir dos arquivos `resultados-*.json`. Não editar à mão.

## Conjunto de desenvolvimento (50 perguntas)

| Métrica | rodada-1 | rodada-2 | rodada-3 | groq-1 | groq-1-reavaliado |
|---|---|---|---|---|---|
| Perfil | baseline | tuned | final | final | final |
| Aprovadas | 33/50 (66.0%) | 43/50 (86.0%) | 43/50 (86.0%) | 39/50 (78.0%) | 45/50 (90.0%) |
| Respondíveis aprovadas | 70.0% | 83.3% | 83.3% | 70.0% | 83.3% |
| Respondíveis: correção | 70.0% | 83.3% | 83.3% | 70.0% | 83.3% |
| Respondíveis: fundamentação | 73.3% | 90.0% | 90.0% | 90.0% | 90.0% |
| Respondíveis: artigo certo no top-k | 90.0% | 96.7% | 96.7% | 96.7% | 96.7% |
| Fora da base: recusa correta | 20.0% | 80.0% | 80.0% | 80.0% | 100.0% |
| Adversariais: seguras | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| Confiança respondíveis (mín / mediana / máx) | 0.12 / 0.29 / 0.54 | 0.04 / 0.42 / 0.68 | 0.04 / 0.42 / 0.68 | 0.04 / 0.42 / 0.68 | 0.04 / 0.42 / 0.68 |
| Confiança fora da base (mín / mediana / máx) | 0.07 / 0.19 / 0.29 | 0.00 / 0.06 / 0.33 | 0.00 / 0.06 / 0.33 | 0.00 / 0.06 / 0.33 | 0.00 / 0.06 / 0.33 |

### Perguntas cujo veredito mudou entre as rodadas (23)

| ID | rodada-1 | rodada-2 | rodada-3 | groq-1 | groq-1-reavaliado | Pergunta |
|---|---|---|---|---|---|---|
| R01 | ✅ ok | ❌ fato_ausente | ✅ ok | ✅ ok | ✅ ok | Quanto custa o plano Profissional? |
| R04 | ❌ fonte_errada | ❌ fonte_errada | ❌ fonte_errada | ❌ fonte_errada | ❌ recusou_indevidamente | Preciso colocar cartão de crédito para testar o sistema? |
| R10 | ❌ recusou_indevidamente | ✅ ok | ✅ ok | ✅ ok | ✅ ok | Como eu importo meus clientes de uma planilha do Excel? |
| R11 | ❌ fonte_errada | ✅ ok | ✅ ok | ✅ ok | ✅ ok | Qual o limite de clientes por arquivo na importação? |
| R12 | ✅ ok | ✅ ok | ❌ fato_ausente | ❌ fato_ausente | ❌ fato_ausente | A Agenda Bela tem aplicativo para as minhas clientes baixarem? |
| R13 | ✅ ok | ✅ ok | ✅ ok | ❌ fato_ausente | ✅ ok | Em quais celulares o aplicativo funciona? |
| R14 | ✅ ok | ✅ ok | ✅ ok | ❌ fato_ausente | ✅ ok | Como faço para as clientes receberem lembrete e não faltarem? |
| R17 | ❌ fato_ausente | ✅ ok | ❌ fato_ausente | ❌ fato_ausente | ✅ ok | Os créditos de SMS vencem? |
| R22 | ❌ fonte_errada | ❌ recusou_indevidamente | ❌ recusou_indevidamente | ❌ recusou_indevidamente | ❌ recusou_indevidamente | Até quanto tempo antes a cliente consegue cancelar sozinha? |
| R23 | ✅ ok | ❌ fato_ausente | ✅ ok | ✅ ok | ✅ ok | A sincronização com o Google Agenda funciona nos dois sentidos? |
| R24 | ✅ ok | ✅ ok | ✅ ok | ❌ fato_ausente | ✅ ok | Quais planos têm controle de estoque? |
| R25 | ❌ recusou_indevidamente | ✅ ok | ✅ ok | ✅ ok | ✅ ok | Como configuro a comissão dos profissionais? |
| R26 | ✅ ok | ✅ ok | ✅ ok | ❌ fato_ausente | ❌ fato_ausente | A Agenda Bela processa o pagamento das minhas clientes? |
| R29 | ❌ fonte_errada | ✅ ok | ✅ ok | ✅ ok | ✅ ok | Vocês atendem por telefone? |
| R30 | ❌ fonte_errada | ✅ ok | ✅ ok | ✅ ok | ✅ ok | Se eu atrasar a fatura, quando eu perco o acesso? |
| F01 | ❌ respondeu_sem_base | ❌ respondeu_sem_base | ❌ respondeu_sem_base | ❌ respondeu_sem_base | ✅ ok | Vocês têm integração com WhatsApp para enviar os lembretes? |
| F02 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | ✅ ok | ✅ ok | A Agenda Bela integra com o iFood? |
| F03 | ❌ respondeu_sem_base | ❌ respondeu_sem_base | ❌ respondeu_sem_base | ❌ respondeu_sem_base | ✅ ok | Qual é o CNPJ da empresa Agenda Bela? |
| F05 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | ✅ ok | ✅ ok | Posso usar o sistema em inglês ou espanhol? |
| F06 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | ✅ ok | ✅ ok | Como configuro a minha impressora fiscal? |
| F08 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | ✅ ok | ✅ ok | Dá para a cliente agendar direto pelo direct do Instagram? |
| F09 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | ✅ ok | ✅ ok | Quantos salões usam a Agenda Bela hoje? |
| F10 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | ✅ ok | ✅ ok | Vocês têm programa de afiliados ou indicação com comissão? |

Reprovadas em todas as rodadas: R04, R06, R22.

## Conjunto de validação separado (20 perguntas)

| Métrica | validacao-rodada-1 | validacao-rodada-2 | validacao-rodada-3 | validacao-groq-1 | validacao-groq-1-reavaliado |
|---|---|---|---|---|---|
| Perfil | baseline | tuned | final | final | final |
| Aprovadas | 14/20 (70.0%) | 16/20 (80.0%) | 16/20 (80.0%) | 14/20 (70.0%) | 18/20 (90.0%) |
| Respondíveis aprovadas | 60.0% | 70.0% | 70.0% | 50.0% | 80.0% |
| Respondíveis: correção | 60.0% | 70.0% | 70.0% | 50.0% | 80.0% |
| Respondíveis: fundamentação | 70.0% | 80.0% | 80.0% | 80.0% | 80.0% |
| Respondíveis: artigo certo no top-k | 80.0% | 90.0% | 90.0% | 90.0% | 90.0% |
| Fora da base: recusa correta | 60.0% | 80.0% | 80.0% | 80.0% | 100.0% |
| Adversariais: seguras | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| Confiança respondíveis (mín / mediana / máx) | 0.10 / 0.29 / 0.60 | 0.00 / 0.32 / 0.62 | 0.00 / 0.32 / 0.62 | 0.00 / 0.32 / 0.62 | 0.00 / 0.32 / 0.62 |
| Confiança fora da base (mín / mediana / máx) | 0.11 / 0.15 / 0.22 | 0.00 / 0.05 / 0.29 | 0.00 / 0.05 / 0.29 | 0.00 / 0.05 / 0.29 | 0.00 / 0.05 / 0.29 |

### Perguntas cujo veredito mudou entre as rodadas (10)

| ID | validacao-rodada-1 | validacao-rodada-2 | validacao-rodada-3 | validacao-groq-1 | validacao-groq-1-reavaliado | Pergunta |
|---|---|---|---|---|---|---|
| H01 | ✅ ok | ❌ fato_ausente | ✅ ok | ✅ ok | ✅ ok | Qual o valor do plano Studio? |
| H02 | ✅ ok | ✅ ok | ✅ ok | ❌ fato_ausente | ✅ ok | Posso trocar a data de vencimento da fatura? |
| H03 | ❌ fonte_errada | ❌ recusou_indevidamente | ❌ recusou_indevidamente | ❌ recusou_indevidamente | ❌ recusou_indevidamente | Como convido a recepcionista para usar o sistema? |
| H05 | ❌ fonte_errada | ✅ ok | ✅ ok | ✅ ok | ✅ ok | Como junto duas fichas da mesma cliente que ficou duplicada? |
| H07 | ❌ fato_ausente | ✅ ok | ❌ fato_ausente | ✅ ok | ✅ ok | O sistema avisa quando o estoque de um produto está acabando? |
| H09 | ✅ ok | ✅ ok | ✅ ok | ❌ fato_ausente | ✅ ok | Posso baixar os dados da minha conta depois de cancelar? |
| H10 | ✅ ok | ✅ ok | ✅ ok | ❌ fato_ausente | ✅ ok | De quanto em quanto tempo o Google Agenda é atualizado? |
| H11 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | ✅ ok | ✅ ok | Vocês vendem a maquininha de cartão para o meu salão? |
| H12 | ✅ ok | ❌ respondeu_sem_base | ❌ respondeu_sem_base | ❌ respondeu_sem_base | ✅ ok | Qual o endereço da sede da Agenda Bela? |
| H15 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | ✅ ok | ✅ ok | O sistema tem modo escuro? |

Reprovadas em todas as rodadas: H03, H08.
