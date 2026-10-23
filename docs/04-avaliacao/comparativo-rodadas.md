# Comparativo entre rodadas

> Gerado por `npm run eval:compare` a partir dos arquivos `resultados-*.json`. Não editar à mão.

## Conjunto de desenvolvimento (50 perguntas)

| Métrica | rodada-1 | rodada-2 | rodada-3 |
|---|---|---|---|
| Perfil | baseline | tuned | final |
| Aprovadas | 33/50 (66.0%) | 43/50 (86.0%) | 43/50 (86.0%) |
| Respondíveis aprovadas | 70.0% | 83.3% | 83.3% |
| Respondíveis: correção | 70.0% | 83.3% | 83.3% |
| Respondíveis: fundamentação | 73.3% | 90.0% | 90.0% |
| Respondíveis: artigo certo no top-k | 90.0% | 96.7% | 96.7% |
| Fora da base: recusa correta | 20.0% | 80.0% | 80.0% |
| Adversariais: seguras | 100.0% | 100.0% | 100.0% |
| Confiança respondíveis (mín / mediana / máx) | 0.12 / 0.29 / 0.54 | 0.04 / 0.42 / 0.68 | 0.04 / 0.42 / 0.68 |
| Confiança fora da base (mín / mediana / máx) | 0.07 / 0.19 / 0.29 | 0.00 / 0.06 / 0.33 | 0.00 / 0.06 / 0.33 |

### Perguntas cujo veredito mudou entre as rodadas (16)

| ID | rodada-1 | rodada-2 | rodada-3 | Pergunta |
|---|---|---|---|---|
| R01 | ✅ ok | ❌ fato_ausente | ✅ ok | Quanto custa o plano Profissional? |
| R10 | ❌ recusou_indevidamente | ✅ ok | ✅ ok | Como eu importo meus clientes de uma planilha do Excel? |
| R11 | ❌ fonte_errada | ✅ ok | ✅ ok | Qual o limite de clientes por arquivo na importação? |
| R12 | ✅ ok | ✅ ok | ❌ fato_ausente | A Agenda Bela tem aplicativo para as minhas clientes baixarem? |
| R17 | ❌ fato_ausente | ✅ ok | ❌ fato_ausente | Os créditos de SMS vencem? |
| R22 | ❌ fonte_errada | ❌ recusou_indevidamente | ❌ recusou_indevidamente | Até quanto tempo antes a cliente consegue cancelar sozinha? |
| R23 | ✅ ok | ❌ fato_ausente | ✅ ok | A sincronização com o Google Agenda funciona nos dois sentidos? |
| R25 | ❌ recusou_indevidamente | ✅ ok | ✅ ok | Como configuro a comissão dos profissionais? |
| R29 | ❌ fonte_errada | ✅ ok | ✅ ok | Vocês atendem por telefone? |
| R30 | ❌ fonte_errada | ✅ ok | ✅ ok | Se eu atrasar a fatura, quando eu perco o acesso? |
| F02 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | A Agenda Bela integra com o iFood? |
| F05 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | Posso usar o sistema em inglês ou espanhol? |
| F06 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | Como configuro a minha impressora fiscal? |
| F08 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | Dá para a cliente agendar direto pelo direct do Instagram? |
| F09 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | Quantos salões usam a Agenda Bela hoje? |
| F10 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | Vocês têm programa de afiliados ou indicação com comissão? |

Reprovadas em todas as rodadas: R04, R06, R22, F01, F03.

## Conjunto de validação separado (20 perguntas)

| Métrica | validacao-rodada-1 | validacao-rodada-2 | validacao-rodada-3 |
|---|---|---|---|
| Perfil | baseline | tuned | final |
| Aprovadas | 14/20 (70.0%) | 16/20 (80.0%) | 16/20 (80.0%) |
| Respondíveis aprovadas | 60.0% | 70.0% | 70.0% |
| Respondíveis: correção | 60.0% | 70.0% | 70.0% |
| Respondíveis: fundamentação | 70.0% | 80.0% | 80.0% |
| Respondíveis: artigo certo no top-k | 80.0% | 90.0% | 90.0% |
| Fora da base: recusa correta | 60.0% | 80.0% | 80.0% |
| Adversariais: seguras | 100.0% | 100.0% | 100.0% |
| Confiança respondíveis (mín / mediana / máx) | 0.10 / 0.29 / 0.60 | 0.00 / 0.32 / 0.62 | 0.00 / 0.32 / 0.62 |
| Confiança fora da base (mín / mediana / máx) | 0.11 / 0.15 / 0.22 | 0.00 / 0.05 / 0.29 | 0.00 / 0.05 / 0.29 |

### Perguntas cujo veredito mudou entre as rodadas (7)

| ID | validacao-rodada-1 | validacao-rodada-2 | validacao-rodada-3 | Pergunta |
|---|---|---|---|---|
| H01 | ✅ ok | ❌ fato_ausente | ✅ ok | Qual o valor do plano Studio? |
| H03 | ❌ fonte_errada | ❌ recusou_indevidamente | ❌ recusou_indevidamente | Como convido a recepcionista para usar o sistema? |
| H05 | ❌ fonte_errada | ✅ ok | ✅ ok | Como junto duas fichas da mesma cliente que ficou duplicada? |
| H07 | ❌ fato_ausente | ✅ ok | ❌ fato_ausente | O sistema avisa quando o estoque de um produto está acabando? |
| H11 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | Vocês vendem a maquininha de cartão para o meu salão? |
| H12 | ✅ ok | ❌ respondeu_sem_base | ❌ respondeu_sem_base | Qual o endereço da sede da Agenda Bela? |
| H15 | ❌ respondeu_sem_base | ✅ ok | ✅ ok | O sistema tem modo escuro? |

Reprovadas em todas as rodadas: H03, H08.
