# 09 · Evolução e roadmap

[← Índice do ciclo de vida](README.md) · [← 08 Implantação](08-implantacao-e-operacao.md) · [Segurança](seguranca-e-confiabilidade.md)

## Histórico de versões
| Versão | Conteúdo | Registro |
|---|---|---|
| v1.0.0 | Base de 31 artigos, chat com fontes, recusa, escalonamento, fila, avaliação, painel, lacunas, guardrails, harness com 50 + 20 perguntas, login com papéis | [CHANGELOG](../../CHANGELOG.md), tag `v1.0.0` |
| v1.1.0 | Sugestão de artigos a partir de lacunas (RF-13, RN-12) | [PR da v1.1](../06-pos-lancamento/pr-v1.1.md), tag `v1.1.0` |
| Pós-v1.1 | Provedor Groq, correções do avaliador e do tratamento de recusa, porta configurável no E2E | [relatório do modelo aberto](../04-avaliacao/relatorio-modelo-aberto.md), [CHANGELOG](../../CHANGELOG.md) |

## Mudanças e seus impactos
| Mudança | Motivo | Impacto |
|---|---|---|
| Confiança com cobertura | Faixas de confiança sobrepostas na rodada 1 | Recusa correta de 20% a 80% |
| 2 trechos por artigo | Preço errado na pergunta do plano Profissional | Corrigiu 3 erros e criou 3; total inalterado |
| Sugestões de artigo | Retrospectiva | Nova tabela e nova tela |
| Tratamento da recusa do modelo no pipeline | Defeito achado na rodada com a Groq | A resposta passa a oferecer uma pessoa (RN-02) |

## Problemas e ações corretivas
Os defeitos com causa raiz estão em [07](07-testes-e-qualidade.md#defeitos-e-causa-raiz). Problemas abertos: F01 e F03 respondidas sem base, R04, R06, R22, H03 e H08 reprovadas em todas as rodadas, e a regressão H12 ([análise de erros](../04-avaliacao/analise-de-erros.md)).

## Roadmap
Ordenado pelo que mais reduz incerteza ([roadmap original](../06-pos-lancamento/roadmap.md)).

| # | Item | Necessidade ou risco que endereça |
|---|---|---|
| 1 | Rodar a avaliação com o Claude real, medindo custo e latência | R-07, RNF-01, RNF-02 |
| 2 | Transformar respostas marcadas como incorretas em perguntas de avaliação | Amostra pequena e do mesmo autor |
| 3 | Embeddings semânticos no lugar do hashing | Erros de vocabulário, F01 e F03 |
| 4 | Segundo sinal de confiança | Falsos positivos que nenhum limiar separa |
| 5 | Ablação da rodada 2 | Contribuição de cada mudança é desconhecida |
| 6 | Limite de tentativas de login, recuperação de senha e CI | R-10 e dívida técnica |

## Lições aprendidas
- Separar o conjunto de validação antes do ajuste revelou que parte do ganho era sobreajuste.
- Um avaliador por texto literal erra com respostas de modelo real; um juiz de qualidade é o passo seguinte.
- A rodada que não melhora o total também precisa ser registrada, porque mostra o que o ajuste custou.
- O provedor simulado mede a parte do sistema que não depende da redação; confundir isso com a qualidade do modelo é o principal risco de leitura (R-07).
- Evidência técnica reexecutada vale mais do que registro antigo: os logs de `1640e4a` foram complementados com os do HEAD.
