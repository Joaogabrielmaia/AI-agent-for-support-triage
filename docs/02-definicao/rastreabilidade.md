# Matriz de rastreabilidade

Requisito → história → código → teste. Os nomes de arquivo são reais.

> Itens sem linha nesta matriz: RN-01, RN-03, RN-11, RN-12; RNF-01, RNF-02, RNF-03, RNF-04, RNF-06, RNF-08, RNF-09.

| Requisito | História | Código principal | Testes |
|---|---|---|---|
| RF-01 | HU-01 | `kb/`, `src/lib/agent/kb.ts`, `embedder.ts`, `prisma/seed.ts` | `unit/kb-and-metrics.test.ts`, `integration/pgvector-parity.test.ts` |
| RF-02 | HU-01 | `pipeline.ts`, `app/api/chat/route.ts` | `integration/pipeline.test.ts`, E2E `customer-chat` |
| RF-03 | HU-01 | `pickSources`, `app/chat/chat.tsx` | `unit/confidence.test.ts`, E2E "resposta com fontes" |
| RF-04 | HU-02 | `scoreConfidence`, `MESSAGES.refusal` | `integration/pipeline.test.ts`, E2E "recusa honesta" |
| RF-05 | HU-03 | `escalation.ts`, `buildHandoff` | `unit/escalation.test.ts`, `integration/pipeline.test.ts` |
| RF-06 | HU-04 | `app/(staff)/tickets/page.tsx` | E2E "fila: filtros..." |
| RF-07 | HU-04 | `tickets/[id]/page.tsx`, `components/transcript.tsx` | E2E "fila: filtros..." |
| RF-08 | HU-03 | `conversation.ts` (`escalateConversation`), `actions.ts` (`replyAction`) | E2E "pergunta fora da base", "fila..." |
| RF-09 | HU-05 | `rateAction`, `transcript.tsx` | E2E "avaliada como incorreta" |
| RF-10 | HU-06 | `metrics.ts`, `painel/page.tsx` | `unit/kb-and-metrics.test.ts`, E2E "admin vê painel" |
| RF-11 | HU-07 | `gaps.ts`, `lacunas/page.tsx` | `unit/kb-and-metrics.test.ts` (clusterQuestions), E2E |
| RF-12 | HU-09 | `eval/run.ts`, `eval/score.ts`, `eval/dataset.json`, `eval/holdout.json` | execução registrada em `docs/04-avaliacao/` |
| RF-13 | HU-11 | `suggestions.ts`, `actions.ts`, `sugestoes/page.tsx` | `unit/suggestions.test.ts`, E2E v1.1 |
| RF-14 | — | `providers.ts` | `integration/pipeline.test.ts` (provedores falsos) |
| RF-15 | HU-10 | `crypto.ts`, `auth.ts`, `login/page.tsx` | `unit/kb-and-metrics.test.ts` (sessão), E2E "rotas exigem login", "atendente não acessa o painel" |
| RN-02 | HU-02 | `scoreConfidence`, `setup.ts` | `unit/confidence.test.ts`, harness |
| RN-04, RN-05 | HU-03 | `ESCALATION_RULES` | `unit/escalation.test.ts` |
| RN-06 | HU-08 | `maskPii` | `unit/guardrails.test.ts`, `integration/pipeline.test.ts` |
| RN-07 | HU-08 | `detectInjection`, `detectThirdPartyData` | `unit/guardrails.test.ts`, `integration/security.test.ts`, E2E "prompt injection" |
| RN-08, RN-09 | HU-08 | `checkOutput` | `unit/guardrails.test.ts`, `integration/pipeline.test.ts` |
| RN-10 | HU-03 | `handleMessage` (try/catch) | `integration/pipeline.test.ts` (provedor fora, busca fora) |
| RNF-05 | HU-10 | `requireUser` | E2E (3 testes) |
| RNF-07 | HU-01 | Tailwind, `chat.tsx` | E2E "mobile", print 11 |
