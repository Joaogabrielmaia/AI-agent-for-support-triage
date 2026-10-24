# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Versões seguem [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Corrigido
- E2E: o teste da fila abria o chat com `localhost:3000` escrito no código e falava com outro servidor quando a porta 3000 estava ocupada. A porta agora vem da variável `PORT` (padrão 3000) no `playwright.config.ts` e no teste.

## [1.1.0] — 2026-10-23

### Adicionado
- **Sugestões de novos artigos a partir das lacunas** (RF-13). Quando a mesma pergunta sem resposta aparece 2 ou mais vezes, o Admin pode criar um rascunho de artigo, aceitar ou descartar (`/lacunas` e `/sugestoes`).
- Método `draftArticle` na interface `LlmProvider`. O `MockProvider` devolve um esqueleto só com as perguntas reais e campos `[PREENCHER]`; o provedor Claude recebe a instrução de não inventar fatos e o aviso é obrigatório.
- Tabela `ArticleSuggestion` (migração `add_article_suggestions`).
- Regra de negócio RN-12 (mínimo de 2 ocorrências, sem duplicar sugestão pendente).
- 4 testes unitários e 2 testes E2E novos; print `13-sugestao-de-artigo-v1.1.png`.

### Alterado
- O agrupamento de lacunas passou a usar radicais de 5 letras e coeficiente de sobreposição (antes, só perguntas com as mesmas palavras agrupavam).
- `db:demo` agora reinicia todas as conversas e limpa as sugestões.

### Corrigido
- Regra de escalonamento de perda de dados não pegava “agendamentos sumiram” (ordem invertida).

## [1.0.0] — 2026-10-23

### Adicionado
- MVP: base de conhecimento (31 artigos), chat com fontes, recusa honesta, escalonamento com resumo/categoria/prioridade/motivo, fila do atendente, avaliação “correta/incorreta”, painel, lacunas, guardrails, harness de avaliação (50 + 20 perguntas), login com papéis Admin/Atendente.
