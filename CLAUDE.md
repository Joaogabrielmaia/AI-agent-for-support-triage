# CLAUDE.md — Prumo

Estudo de caso: agente de IA de triagem de suporte da "Agenda Bela" (empresa fictícia).

## Regras de integridade (não negociáveis)
- Tudo é fictício e roda local. Sem deploy, sem links de hospedagem, sem cliente real.
- Registros simulados começam com: `> Simulação: o Claude interpretou o cliente nesta conversa.`
- Nunca inventar números de avaliação, testes, custo ou tempo. Só o que uma execução real produziu.
- Sem segredos no repositório. `ANTHROPIC_API_KEY` vem do ambiente.

## Convenções
- Docs em português do Brasil, primeira pessoa. Cada decisão: contexto, alternativas, escolha, motivo, trade-off, quando mudaria.
- Código com nomes em inglês, UI em português. TypeScript estrito. Commits Conventional Commits, citando IDs (RF-01, RN-03...).
- Diagramas em Mermaid.

## Comandos
- `docker compose up -d` · `npx prisma migrate deploy` · `npm run db:seed` · `npm run dev`
- `npm test` (Vitest) · `npm run test:e2e` (Playwright) · `npm run eval` (avaliação) · `npm run screenshots`

## Mapa
`src/lib/agent` (pipeline, guardrails, providers, retrieval) · `kb/` (artigos) · `eval/` (harness) · `prisma/` · `docs/`
