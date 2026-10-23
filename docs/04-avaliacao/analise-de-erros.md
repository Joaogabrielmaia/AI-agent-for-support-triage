# Análise de erros e decisões de ajuste

Todos os números vêm de [`comparativo-rodadas.md`](comparativo-rodadas.md) (gerado dos JSONs) e dos relatórios de cada rodada. Provedor em todas as rodadas: **`MockProvider`** (ver as ressalvas em [`metodologia.md`](metodologia.md)).

## Rodada 1 — baseline (33 de 50, 66%)
Perfil: um trecho por artigo, sem bigramas nem sinônimos, confiança = similaridade do melhor trecho, limiar 0,15.

| Grupo | Resultado |
|---|---|
| Respondíveis aprovadas | 70,0% (fundamentação 73,3%) |
| Fora da base: recusa correta | **20,0%** |
| Adversariais seguras | 100,0% |

### Os 17 erros, agrupados por causa
| Tipo de erro | Perguntas | Causa que identifiquei | Decisão que saiu daqui |
|---|---|---|---|
| **Respondeu sem base** (8 de 10 fora da base) | F01, F02, F03, F05, F06, F08, F09, F10 | O limiar 0,15 está abaixo do teto das fora da base (0,29). As faixas de confiança das duas classes se **sobrepõem** (respondíveis 0,12–0,54; fora da base 0,07–0,29), então subir o limiar só na similaridade não separa. | Confiança com **cobertura** das palavras da pergunta no trecho (ADR-004) |
| **Fonte errada** (respondeu, mas citando o artigo errado) | R04, R11, R22, R29, R30 | Artigo inteiro num vetor dilui o assunto; vocabulário diferente entre pergunta e artigo ("atendem" × "atendemos"; "grátis" × "gratuito"). Ex.: R29 ("atendem por telefone?") trouxe `privacidade-lgpd`. | **Trechos por seção** (ADR-003), **bigramas**, **raiz por prefixo de 5 letras** |
| **Recusou indevidamente** | R06, R10, R25 | R25: diluição. R10: "Excel" não aparece no artigo (que diz XLSX). R06: "até quando consigo usar" × "o acesso continua até o fim do período". | Trechos por seção; **pequeno léxico de sinônimos** (ex.: excel → xlsx) |
| **Fato ausente** | R17 | Acertou o artigo, mas o `MockProvider` escolheu a frase errada dentro dele. | Nenhuma: é limite do Mock extrativo. Não ajustei o Mock para a nota. |

**Observação:** os adversariais deram 100% já na rodada 1. Isso **não** veio de ajuste: as regras de entrada foram escritas antes da avaliação, por mim, conhecendo os ataques.

## Rodada 2 — perfil ajustado (43 de 50, 86%)
Mudanças (todas juntas, **não isoladas**): trechos por seção (93 trechos), bigramas, léxico de sinônimos na consulta, prefixo de 5 letras, confiança `top1+coverage`, limiar **0,16**, cobertura mínima **0,4** (escolhidos com `npm run sweep` no conjunto de desenvolvimento).

| Grupo | Rodada 1 | Rodada 2 |
|---|---|---|
| Respondíveis aprovadas | 70,0% | 83,3% |
| Fora da base: recusa correta | 20,0% | **80,0%** |
| Adversariais seguras | 100% | 100% |
| **Validação (20 perguntas)** | 70,0% (14/20) | **80,0% (16/20)** |

- **Corrigiu 12** (R10, R11, R17, R25, R29, R30, F02, F05, F06, F08, F09, F10).
- **Piorou 2** (R01 e R23): o trecho da seção que **respondia** ficava de fora, porque só 1 trecho por artigo chegava ao modelo. Também piorou H01 na validação.
- **O ganho é menor na validação** (+10 pontos contra +20 no desenvolvimento): é o sobreajuste que eu esperava. Se eu só tivesse o conjunto de desenvolvimento, teria superestimado o resultado.

## Rodada 3 — 2 trechos por artigo (43 de 50, 86%)
O erro de R01 apareceu **ao vivo** ("Quanto custa o plano Profissional?" respondia o preço do profissional adicional) e coincidiu com a avaliação. Mudança: até **2 trechos do mesmo artigo** chegam ao modelo (ADR-005).

- **Corrigiu 2 no desenvolvimento** (R01, R23) e **1 na validação** (H01).
- **Piorou 2** (R12, R17) e **1** (H07): com mais texto, o `MockProvider` escolhe frases piores.
- **Total: sem mudança** (43/50 e 16/20). Troquei um tipo de erro por outro. Mantive porque corrige o caso mais visível, e **registro que o benefício com o Claude real é uma hipótese**.

## O que ainda falha (rodada 3)
| Pergunta | Tipo | O que acho que acontece | Tem solução neste desenho? |
|---|---|---|---|
| **F01** WhatsApp para lembretes · **F03** CNPJ da empresa | Respondeu sem base (confiança 0,33 e 0,33) | Compartilham palavras com artigos reais (lembretes; Agenda Bela/empresa). Estão **acima** de 7 respondíveis, então nenhum limiar separa. | **Não** com busca lexical. Precisa de embeddings semânticos (ADR-002) ou de um julgamento do modelo sobre "a fonte responde de fato?". |
| **R04** "cartão de crédito para testar" | Fonte errada (falha desde a rodada 1) | A palavra "crédito" aparece tanto em "cartão de crédito" quanto em "créditos de SMS", e a busca lexical não distingue os sentidos. Os ajustes não resolveram nem pioraram. | Só com busca semântica, ou com um peso maior para o termo "teste", que só existe no artigo certo. |
| **R06**, **R22** | Recusou indevidamente (confiança 0,05 e 0,04) | A pergunta usa palavras que o artigo não usa ("consigo usar o sistema"; "sozinha"). | Só com busca semântica. |
| **R12**, **R17** | Fato ausente | Limite do `MockProvider` (seleção de frases). | Com o Claude real, **a verificar**. |
| **H03**, **H08** (validação) | Recusou indevidamente | H08: "faltou" × "falta" têm prefixos de 5 letras diferentes (**hipótese**, não verifiquei). | Idem R06/R22. |
| **H12** endereço da sede | Respondeu sem base | Passou na baseline e falha desde a rodada 2: a cobertura passou a aceitar o trecho. É **regressão** do ajuste. | Precisa de um segundo sinal de confiança. |

## O que eu concluo
1. **A decisão que mais valeu foi a confiança com cobertura.** Recusa correta foi de 20% a 80% e se manteve no conjunto de validação (60% → 80%).
2. **O limite do desenho é a busca lexical.** Os erros que sobraram são quase todos de vocabulário. Mais regras e sinônimos só ajustariam as 50 perguntas que eu já vi.
3. **Eu não sei como o Claude real se sairia.** A próxima medição que importa é rodar o mesmo harness com `LLM_PROVIDER=anthropic` ([instruções](relatorio-claude.md)).
4. **A métrica "adversariais 100%" não é um troféu.** É um piso, dado que as regras foram escritas para esses ataques.
