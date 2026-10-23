# PR: feat: sugestões de novos artigos a partir das lacunas (v1.1.0)

Branch: `feat/sugestoes-de-artigos` → `main`

## O que muda
Hoje a tela de lacunas mostra as perguntas que o agente não soube responder, mas transformar isso em artigo é trabalho manual e fácil de esquecer. Esta PR adiciona o passo seguinte: para uma lacuna repetida, o Admin cria um **rascunho de artigo** com um clique, e depois aceita ou descarta.

## Por que
Veio da retrospectiva (melhoria 1, veja `retrospectiva.md`). A taxa de resolução do agente só sobe se a base cobrir o que os clientes perguntam, e as lacunas são o sinal mais direto disso.

## Decisões
- **O rascunho não inventa fatos.** Contexto: um modelo pode escrever um artigo bonito e errado, e esse artigo viraria fonte do próprio agente. Alternativas: (a) deixar o modelo escrever o artigo inteiro; (b) gerar só o esqueleto. Escolhi (b): o rascunho traz as perguntas reais e campos `[PREENCHER]`. Trade-off: dá mais trabalho para a equipe. Eu mudaria de ideia se houvesse um passo de revisão obrigatória por uma pessoa antes de entrar em `kb/`, e aí valeria deixar o modelo propor o texto.
- **Mínimo de 2 ocorrências (RN-12).** Uma pergunta isolada pode ser ruído. O valor 2 é uma hipótese, e `MIN_OCCURRENCES` está numa constante para ser ajustado.
- **Aceitar não publica nada.** Aceitar só marca a decisão; o artigo continua sendo escrito em `kb/` e revisado como qualquer arquivo do repositório.

## Mudanças técnicas
- Prisma: modelo `ArticleSuggestion` + enum `SuggestionStatus` (migração `add_article_suggestions`).
- `LlmProvider.draftArticle` (Mock e Anthropic).
- `src/lib/agent/suggestions.ts` (regras puras), actions `createSuggestionAction` e `decideSuggestionAction` (somente Admin), página `/sugestoes`, coluna nova em `/lacunas`.
- Agrupamento de lacunas melhorado (radicais de 5 letras + coeficiente de sobreposição), com teste.

## Como testei
- `npm test`: 78 testes passando (4 novos de sugestões, 1 novo de agrupamento).
- `npm run test:e2e`: 14 testes passando (2 novos: Admin cria/decide sugestão; Atendente não vê a coluna nem a página).
- `npm run lint` e `npm run build` sem erros.
- Print `docs/screenshots/13-sugestao-de-artigo-v1.1.png`.

## Riscos
- O agrupamento por sobreposição de radicais é simples. Perguntas parecidas com palavras muito diferentes não agrupam (ver limitações no README).
- Com o provedor Claude real, o texto do rascunho não foi exercitado neste repositório (sem chave de API).
