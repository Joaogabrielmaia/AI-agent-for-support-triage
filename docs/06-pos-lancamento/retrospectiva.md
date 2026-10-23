# Retrospectiva

## 1. Reunião simulada de retrospectiva

> Simulação: o Claude interpretou o cliente nesta conversa.

**Participantes:** João (eu), Renata (líder), Carlos (atendente), Marina (cliente-tipo), interpretados pelo Claude. Base da conversa: os resultados reais de [`../04-avaliacao/`](../04-avaliacao/comparativo-rodadas.md) e [`../05-qualidade/`](../05-qualidade/plano-e-resultados.md).

### O que funcionou
- **Renata:** "A recusa honesta e o motivo no chamado. Foi o que me deixou confortável."
- **Carlos:** "Receber o chamado já resumido e poder marcar 'incorreta'."
- **Marina:** "Ver de onde veio a resposta."

### O que não funcionou
- **Renata:** "Os 2 casos fora da base que ainda são respondidos. Para mim, um já basta para eu não confiar."
- **Carlos:** "A marcação 'incorreta' não faz nada além de mudar um percentual."
- **Marina:** "Respostas que começam pela frase errada."

### As 3 melhorias escolhidas
| # | Melhoria | Por quê | Estado |
|---|---|---|---|
| 1 | **Transformar lacunas em artigos novos** | A lista de lacunas existe, mas fechar o ciclo é manual e é fácil esquecer. Mais cobertura da base é o que sobe a resolução. | **Implementada na v1.1** ([PR](pr-v1.1.md)) |
| 2 | **Medir com o Claude real e trocar a busca por embeddings semânticos**, mais um segundo sinal de confiança ("a fonte responde de fato?") | Os erros que sobram são de vocabulário e os dois falsos positivos (F01, F03) não se separam por limiar. | Roadmap, item 1 |
| 3 | **Fechar o ciclo de feedback:** respostas marcadas "incorretas" viram perguntas do conjunto de avaliação | Carlos quer que a marcação sirva para algo, e a avaliação ganha casos reais. | Roadmap, item 2 |

### Risco organizacional (sem solução de software)
Carlos disse, no discovery, que temia perder o emprego. Desenhei o produto para que ele fique no controle da qualidade, mas **isso não resolve a questão** se a empresa decidir reduzir pessoal. Registro como risco R-09 e decisão que não é minha.

## 2. Minha retrospectiva final

### O que fiz bem
- **Tratei a avaliação como o produto.** O harness existiu antes de o app existir, e cada ajuste nasceu de um erro medido.
- **Separei um conjunto de validação antes de ajustar.** Ele mostrou que o ganho real (+10 pontos) era a metade do aparente (+20).
- **Registrei os resultados ruins:** a rodada 3 não mudou o total, dois falsos positivos continuam, e o Mock não prova nada sobre o Claude.
- **Projetei para falhar bem:** o cliente nunca fica sem resposta, e o escalonamento nunca depende do modelo.

### O que não fiz bem
- **Mudei cinco coisas de uma vez na rodada 2.** Não sei o que cada uma contribuiu. Uma ablação teria me dado isso.
- **Escrevi as regras de segurança conhecendo os ataques que testei.** O 100% de adversariais é um piso, não uma garantia.
- **Um commit grande para o app** em vez de commits por sprint. O histórico não conta a história que a [revisão de sprint](../05-qualidade/sprint-2-review.md) precisou reconstruir.
- **Sem chave de API, o centro do projeto (o Claude) ficou sem medição.** Foi uma limitação do ambiente, mas é uma lacuna real.
- Dois erros meus de implementação (um `\d` virando `/d/` em um patch; um IDF ajustado com o tokenizador errado) só foram pegos porque os números pareciam estranhos. **Faltou teste unitário do tokenizador com prefixo desde o início.**

### O que eu faria diferente
1. Começaria o harness com **cinco perguntas e crescendo**, e não com 50, para ver o ciclo mais cedo.
2. Pediria a **outra pessoa** para escrever as perguntas de validação sem ver a base.
3. Faria **uma mudança por rodada**, mesmo que isso custasse mais rodadas.
4. Teria feito a seleção de frases do Mock mais fiel a uma resposta de verdade, porque um Mock fraco contamina a leitura dos números.

### O que levo
Um agente de suporte não é difícil por causa do modelo, é difícil por causa do **limite entre responder e encaminhar**, e esse limite só se acha medindo.
