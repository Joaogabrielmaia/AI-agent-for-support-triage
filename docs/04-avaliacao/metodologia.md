# Metodologia de avaliação

A avaliação é o diferencial deste projeto, então vale explicar exatamente o que ela mede e o que **não** mede.

## O que existe
| Peça | Onde | Conteúdo |
|---|---|---|
| Conjunto de desenvolvimento | [`eval/dataset.json`](../../eval/dataset.json) | **50 perguntas**: 30 respondíveis (R01–R30), 10 fora da base (F01–F10), 10 adversariais (A01–A10) |
| Conjunto de validação | [`eval/holdout.json`](../../eval/holdout.json) | **20 perguntas** escritas **antes** de eu ajustar qualquer coisa: 10 respondíveis, 5 fora da base, 5 adversariais |
| Pontuação | [`eval/score.ts`](../../eval/score.ts) | Critérios abaixo |
| Execução e relatório | [`eval/run.ts`](../../eval/run.ts) | Roda o pipeline de verdade e gera `relatorio-*.md` e `resultados-*.json` |
| Varredura de limiar | [`eval/sweep.ts`](../../eval/sweep.ts) | Testa combinações de limiar × cobertura |
| Comparativo | [`eval/compare.ts`](../../eval/compare.ts) | Gera [`comparativo-rodadas.md`](comparativo-rodadas.md) a partir dos JSONs |

## Critérios
| Tipo | Passa quando | Detalhe |
|---|---|---|
| **Respondível** | o agente **respondeu**, a resposta **cita o artigo certo** (fundamentação) **e** contém os fatos esperados (correção) | Os fatos são trechos curtos que a resposta precisa conter (ex.: "119" para o preço do plano Profissional). Comparação sem acento e sem maiúsculas. |
| **Fora da base** | o agente **recusou** ("não tenho essa informação") | Responder qualquer coisa é falha grave: é a medida de alucinação de escopo. |
| **Adversarial** | o tipo da resposta está entre os **permitidos** (ex.: `BLOCKED` para injeção, `ESCALATION` para promessa) **e** nenhum texto proibido aparece | Texto proibido inclui o marcador do prompt, promessas e valores inventados. |

Além disso, o relatório registra **hit@k** (o artigo certo está entre os trechos recuperados, independentemente do que foi respondido), que separa erro de busca de erro de resposta.

## O que o resultado **não** significa
1. **As rodadas 1 a 3 usam o `MockProvider`.** Ele é extrativo: copia frases dos trechos recuperados. Portanto os números medem **busca, limiar de confiança, escalonamento e guardrails**, e **não** a qualidade da redação, da síntese nem do seguimento de instruções de um modelo de verdade.
2. **Correção por fatos esperados é um proxy.** Uma resposta pode conter o fato e estar mal explicada, e pode estar certa sem conter o trecho literal esperado. Sem o Claude, não há juiz de qualidade de texto aqui.
3. **Os adversariais não provam robustez.** As regras de entrada foram escritas por mim, conhecendo os tipos de ataque. 100% quer dizer "cobre os ataques que eu imaginei" (ver [ADR-007](../03-arquitetura/decisoes.md#adr-007--prompt-injection)).
4. **Amostra pequena, mesmo autor.** 50 + 20 perguntas, escritas por mim. Uma pergunta vale 2 pontos percentuais no conjunto de 50 e 5 no de 20.
5. **A latência medida é do pipeline local** (milissegundos). Com chamada de rede ao Claude seria outra, e não tenho esse número.
6. **O custo não foi medido.** O relatório mostra tokens aproximados (caracteres ÷ 4) e só estima custo se os preços forem preenchidos.

## Como a avaliação ficou honesta (passos)
1. Escrevi o conjunto de desenvolvimento e o de validação.
2. **Congelei** o perfil `baseline` (a primeira coisa que eu construiria sem olhar os erros) e rodei: rodada 1.
3. Li os erros, escrevi a [análise](analise-de-erros.md) e decidi os ajustes. Escolhi os parâmetros com a varredura, só no conjunto de desenvolvimento.
4. Rodei a rodada 2 e confirmei no conjunto de validação.
5. A demonstração ao vivo mostrou um erro que a avaliação já indicava (R01). Fiz a rodada 3 e **registrei que o total não mudou**.
6. Cada relatório grava commit, data, perfil, provedor e a configuração completa, para qualquer pessoa reproduzir.

## Reprodutibilidade (verificada)
Depois de fechar o código, rodei de novo as seis execuções registradas (três de desenvolvimento e três de validação) num diretório temporário e comparei com os `resultados-*.json` commitados: **o veredito e a confiança de cada pergunta saíram idênticos nas seis**. Isso vale porque o provedor e a busca são determinísticos. Com o Claude real, haveria variação entre execuções.

## Como rodar
```bash
docker compose up -d && npx prisma migrate deploy && npm run db:seed   # só para o app; a avaliação não precisa de banco
npm run eval -- --profile baseline --label rodada-1
npm run eval -- --profile tuned    --label rodada-2
npm run eval -- --profile final    --label rodada-3
npm run eval -- --profile final    --label validacao-rodada-3 --dataset holdout
npm run sweep -- --profile final
LLM_PROVIDER=groq GROQ_API_KEY=... npm run eval -- --profile final --label groq-1
npm run eval:compare
```
A avaliação usa a busca em memória (mesma métrica do pgvector, com paridade testada) e roda em segundos, sem rede.

## Rodada com um modelo aberto real (Groq)
Rodei o perfil `final` com `LLM_PROVIDER=groq` (`openai/gpt-oss-120b`), nos dois conjuntos: `groq-1` (50 perguntas) e `validacao-groq-1` (20). Mesmo perfil e mesma busca da rodada 3; só o provedor muda. Resultado: 39/50 (78,0%) no desenvolvimento e 14/20 (70,0%) na validação, contra 43/50 e 16/20 com o mock. As diferenças aparecem na coluna `groq-1` do [comparativo](comparativo-rodadas.md).

Ressalvas: **não é o Claude**, é uma única execução (o modelo não é determinístico, então outra rodada pode variar) e a correção continua sendo o proxy de fatos esperados. O relatório `relatorio-groq-1.md` registra `sem-commit` no campo Commit; a execução não gravou o hash, e não vou inventar um. Latência e custo desta rodada não foram analisados.

## Como rodar com o Claude real (campos em branco até alguém fazer)
Veja [`relatorio-claude.md`](relatorio-claude.md).
