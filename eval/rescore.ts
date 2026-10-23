/**
 * Reavalia OFFLINE as respostas já gravadas em um resultados-*.json, sem chamar nenhum provedor.
 * Aplica (1) o `norm` corrigido do avaliador e (2) a regra do pipeline "o modelo admitiu que não sabe => REFUSAL".
 * Não é uma nova execução: o texto das respostas é o mesmo da execução original.
 *
 * Uso: npm run rescore -- --from groq-1 --dataset dataset [--write]
 */
import fs from "node:fs";
import path from "node:path";
import { MESSAGES } from "../src/lib/agent/pipeline";
import type { AgentResult } from "../src/lib/agent/types";
import { scoreQuestion, summarize, type EvalQuestion, type QuestionScore } from "./score";

const arg = (name: string, fallback?: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
const DIR = path.resolve("docs/04-avaliacao");
const from = arg("from");
if (!from) throw new Error("Informe --from <rodada>");
const datasetName = arg("dataset", "dataset")!;

const ADMITS = /^\W*n[aã]o tenho essa informa[cç][aã]o\W*$/i;
const questions = JSON.parse(fs.readFileSync(path.join(__dirname, `${datasetName}.json`), "utf8")) as EvalQuestion[];
const run = JSON.parse(fs.readFileSync(path.join(DIR, `resultados-${from}.json`), "utf8")) as { meta: Record<string, string>; profile: unknown; scores: QuestionScore[] };

let changed = 0;
const scores = run.scores.map((old) => {
  const q = questions.find((x) => x.id === old.id)!;
  const admits = old.kind === "ANSWER" && ADMITS.test(old.answerText.trim());
  const result = {
    kind: admits ? "REFUSAL" : old.kind,
    text: admits ? MESSAGES.refusal : old.answerText,
    confidence: old.confidence,
    sources: admits ? [] : old.citedArticles.map((articleSlug) => ({ articleSlug })),
    guardrail: old.guardrail,
    usage: { inputTokens: old.inputTokens, outputTokens: old.outputTokens },
  } as unknown as AgentResult;
  const novo = scoreQuestion(q, result, { latencyMs: old.latencyMs, topArticles: old.topArticles });
  if (novo.verdict !== old.verdict) {
    changed++;
    console.log(`${old.id}: ${old.verdict} -> ${novo.verdict}`);
  }
  return novo;
});

const summary = summarize(scores);
console.log(`${from}: ${changed} vereditos mudaram; ${summary.passed}/${summary.total} aprovadas`);
if (process.argv.includes("--write")) {
  const label = `${from}-reavaliado`;
  const meta = { ...run.meta, Rodada: label, Origem: `reavaliação offline de ${from} (mesmas respostas, sem nova chamada ao provedor)` };
  fs.writeFileSync(path.join(DIR, `resultados-${label}.json`), JSON.stringify({ meta, profile: run.profile, summary, scores }, null, 2));
  console.log(`resultados-${label}.json gravado`);
}
