import fs from "node:fs";
import path from "node:path";
import { handleMessage } from "../src/lib/agent/pipeline";
import { MockProvider } from "../src/lib/agent/providers";
import { PROFILES, buildIndex, inMemoryStore } from "../src/lib/agent/setup";
import { scoreQuestion, rate, type EvalQuestion } from "./score";

/**
 * Varredura de limiar e cobertura mínima sobre o conjunto de desenvolvimento (eval/dataset.json).
 * Uso: npm run sweep -- --profile tuned
 * Os melhores pontos são só uma sugestão: o valor final precisa ser confirmado no conjunto de validação.
 */
async function main() {
  const i = process.argv.indexOf("--profile");
  const profile = PROFILES[i >= 0 ? process.argv[i + 1] : "tuned"];
  const questions = JSON.parse(fs.readFileSync(path.join(__dirname, "dataset.json"), "utf8")) as EvalQuestion[];
  const index = buildIndex(profile);
  const store = inMemoryStore(index);
  const cat = new Map(index.articles.map((a) => [a.slug, a.category]));
  const rows: { threshold: number; minCoverage: number; answerable: number; oob: number; adv: number; total: number }[] = [];

  for (let t = 0.1; t <= 0.6001; t += 0.02) {
    for (const minCoverage of [0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]) {
      const config = { ...profile.agent, threshold: Number(t.toFixed(2)), minCoverage };
      const deps = { embedder: index.embedder, store, provider: new MockProvider(), config, articleCategory: (s: string) => cat.get(s) };
      const sc = [];
      for (const q of questions) {
        const hits = await store.search(index.embedder.embed(q.question, true), config.topK);
        sc.push(scoreQuestion(q, await handleMessage(deps, { question: q.question }), { latencyMs: 0, topArticles: hits.map((h) => h.chunk.articleSlug) }));
      }
      rows.push({
        threshold: config.threshold,
        minCoverage,
        answerable: rate(sc.filter((s) => s.type === "answerable").map((s) => s.pass)),
        oob: rate(sc.filter((s) => s.type === "out_of_kb").map((s) => s.pass)),
        adv: rate(sc.filter((s) => s.type === "adversarial").map((s) => s.pass)),
        total: rate(sc.map((s) => s.pass)),
      });
    }
  }
  rows.sort((a, b) => b.total - a.total || b.oob - a.oob);
  console.log("threshold  cobertura  respondíveis  fora-da-base  adversariais  total");
  for (const r of rows.slice(0, 15)) {
    console.log(
      `${r.threshold.toFixed(2).padStart(9)}  ${r.minCoverage.toFixed(1).padStart(9)}  ${(r.answerable * 100).toFixed(0).padStart(11)}%  ${(r.oob * 100).toFixed(0).padStart(11)}%  ${(r.adv * 100).toFixed(0).padStart(11)}%  ${(r.total * 100).toFixed(0).padStart(4)}%`,
    );
  }
}
main();
