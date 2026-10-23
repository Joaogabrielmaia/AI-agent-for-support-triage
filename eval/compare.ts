import fs from "node:fs";
import path from "node:path";
import type { QuestionScore, Summary } from "./score";

/** Gera docs/04-avaliacao/comparativo-rodadas.md a partir dos resultados-*.json. Uso: npm run eval:compare */
const DIR = path.join(process.cwd(), "docs", "04-avaliacao");

interface Run {
  meta: Record<string, string>;
  profile: { name: string; chunking: unknown; embedder: unknown; agent: unknown };
  summary: Summary;
  scores: QuestionScore[];
}

const load = (label: string): Run => JSON.parse(fs.readFileSync(path.join(DIR, `resultados-${label}.json`), "utf8"));
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
const f2 = (x: number) => x.toFixed(2);

function table(labels: string[], title: string): string[] {
  const runs = labels.map(load);
  const L: string[] = [`## ${title}`, ""];
  L.push(`| Métrica | ${labels.join(" | ")} |`, `|---|${labels.map(() => "---").join("|")}|`);
  const row = (name: string, fn: (s: Summary) => string) => L.push(`| ${name} | ${runs.map((r) => fn(r.summary)).join(" | ")} |`);
  row("Perfil", () => "");
  L[L.length - 1] = `| Perfil | ${runs.map((r) => r.profile.name).join(" | ")} |`;
  row("Aprovadas", (s) => `${s.passed}/${s.total} (${pct(s.passRate)})`);
  row("Respondíveis aprovadas", (s) => pct(s.answerable.passRate));
  row("Respondíveis: correção", (s) => pct(s.answerable.correctness));
  row("Respondíveis: fundamentação", (s) => pct(s.answerable.grounding));
  row("Respondíveis: artigo certo no top-k", (s) => pct(s.answerable.retrievalHitRate));
  row("Fora da base: recusa correta", (s) => pct(s.outOfKb.correctRefusal));
  row("Adversariais: seguras", (s) => pct(s.adversarial.safe));
  row("Confiança respondíveis (mín / mediana / máx)", (s) => `${f2(s.confidence.answerable.min)} / ${f2(s.confidence.answerable.median)} / ${f2(s.confidence.answerable.max)}`);
  row("Confiança fora da base (mín / mediana / máx)", (s) => `${f2(s.confidence.outOfKb.min)} / ${f2(s.confidence.outOfKb.median)} / ${f2(s.confidence.outOfKb.max)}`);
  L.push("");
  const ids = runs[0].scores.map((s) => s.id);
  const changed = ids.filter((id) => new Set(runs.map((r) => r.scores.find((s) => s.id === id)!.verdict)).size > 1);
  L.push(`### Perguntas cujo veredito mudou entre as rodadas (${changed.length})`, "");
  L.push(`| ID | ${labels.join(" | ")} | Pergunta |`, `|---|${labels.map(() => "---").join("|")}|---|`);
  for (const id of changed) {
    const cells = runs.map((r) => {
      const s = r.scores.find((x) => x.id === id)!;
      return `${s.pass ? "✅" : "❌"} ${s.verdict}`;
    });
    L.push(`| ${id} | ${cells.join(" | ")} | ${runs[0].scores.find((s) => s.id === id)!.question} |`);
  }
  const stillFailing = ids.filter((id) => runs.every((r) => !r.scores.find((s) => s.id === id)!.pass));
  L.push("", `Reprovadas em todas as rodadas: ${stillFailing.length ? stillFailing.join(", ") : "nenhuma"}.`, "");
  return L;
}

const out = [
  "# Comparativo entre rodadas",
  "",
  "> Gerado por `npm run eval:compare` a partir dos arquivos `resultados-*.json`. Não editar à mão.",
  "",
  ...table(["rodada-1", "rodada-2", "rodada-3"], "Conjunto de desenvolvimento (50 perguntas)"),
  ...table(["validacao-rodada-1", "validacao-rodada-2", "validacao-rodada-3"], "Conjunto de validação separado (20 perguntas)"),
];
fs.writeFileSync(path.join(DIR, "comparativo-rodadas.md"), out.join("\n"));
console.log("comparativo-rodadas.md gerado");
