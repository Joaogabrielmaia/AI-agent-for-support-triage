import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { handleMessage, type AgentDeps } from "../src/lib/agent/pipeline";
import { providerFromEnv } from "../src/lib/agent/providers";
import { PROFILES, buildIndex, inMemoryStore } from "../src/lib/agent/setup";
import { scoreQuestion, summarize, type EvalQuestion, type QuestionScore, type Summary } from "./score";

/**
 * Uso: npm run eval -- --profile baseline --label rodada-1
 * Provedor: LLM_PROVIDER=mock (padrão) ou anthropic (precisa de ANTHROPIC_API_KEY no ambiente).
 */
function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
const f2 = (x: number) => x.toFixed(2);

function gitCommit(): string {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "sem-commit";
  }
}

function costEstimate(s: Summary): string {
  const pin = Number(process.env.PRICE_INPUT_PER_MTOK);
  const pout = Number(process.env.PRICE_OUTPUT_PER_MTOK);
  if (!pin || !pout) return "não estimado (defina PRICE_INPUT_PER_MTOK e PRICE_OUTPUT_PER_MTOK)";
  const usd = (s.tokens.input * pin + s.tokens.output * pout) / 1_000_000;
  return `US$ ${usd.toFixed(4)} no total (estimativa a partir de tokens aproximados)`;
}

function renderReport(meta: Record<string, string>, s: Summary, scores: QuestionScore[], profileJson: string): string {
  const fails = scores.filter((x) => !x.pass);
  const L: string[] = [];
  L.push(`# Relatório de avaliação — ${meta.label}`, "");
  L.push("> Gerado automaticamente por `npm run eval`. Os números abaixo vêm da execução registrada nos metadados; nada foi editado à mão.", "");
  L.push("## Metadados da execução", "");
  L.push("| Campo | Valor |", "|---|---|");
  for (const [k, v] of Object.entries(meta)) L.push(`| ${k} | ${v} |`);
  L.push("", "```json", profileJson, "```", "");
  if (meta.Provedor === "mock") {
    L.push(
      "> **Leitura obrigatória:** esta execução usa o `MockProvider` (extrativo e determinístico) e a busca local por hashing. Ela mede **recuperação, limiar de confiança, escalonamento e guardrails**. Ela **não mede a qualidade de redação do Claude**. A rodada com o Claude real está em branco em `relatorio-claude.md` até alguém rodar com chave de API.",
      "",
    );
  }
  L.push("## Resultado geral", "", `**${s.passed} de ${s.total} perguntas aprovadas (${pct(s.passRate)}).**`, "");
  L.push("| Grupo | Métrica | Resultado |", "|---|---|---|");
  L.push(`| ${s.answerable.n} respondíveis | Correção (fatos esperados presentes) | ${pct(s.answerable.correctness)} |`);
  L.push(`| ${s.answerable.n} respondíveis | Fundamentação (cita o artigo certo) | ${pct(s.answerable.grounding)} |`);
  L.push(`| ${s.answerable.n} respondíveis | Respondeu (não recusou nem escalou) | ${pct(s.answerable.answeredRate)} |`);
  L.push(`| ${s.answerable.n} respondíveis | Artigo certo entre os trechos recuperados (hit@k) | ${pct(s.answerable.retrievalHitRate)} |`);
  L.push(`| ${s.answerable.n} respondíveis | Aprovadas (correto e fundamentado) | ${pct(s.answerable.passRate)} |`);
  L.push(`| ${s.outOfKb.n} fora da base | Recusa correta | ${pct(s.outOfKb.correctRefusal)} |`);
  L.push(`| ${s.outOfKb.n} fora da base | Respondeu sem base (erro grave) | ${pct(s.outOfKb.answeredWithoutBase)} |`);
  L.push(`| ${s.adversarial.n} adversariais | Comportamento seguro | ${pct(s.adversarial.safe)} |`, "");
  L.push("### Adversariais por tipo", "", "| Tipo | Seguras | Total |", "|---|---|---|");
  for (const [k, v] of Object.entries(s.adversarial.bySubtype)) L.push(`| ${k} | ${v.safe} | ${v.n} |`);
  L.push("", "### Distribuição da confiança", "", "| Grupo | mín | mediana | máx |", "|---|---|---|---|");
  L.push(`| Respondíveis | ${f2(s.confidence.answerable.min)} | ${f2(s.confidence.answerable.median)} | ${f2(s.confidence.answerable.max)} |`);
  L.push(`| Fora da base | ${f2(s.confidence.outOfKb.min)} | ${f2(s.confidence.outOfKb.median)} | ${f2(s.confidence.outOfKb.max)} |`, "");
  L.push("### Latência e custo", "");
  L.push(`- Latência por pergunta (medida): mediana ${s.latencyMs.median.toFixed(1)} ms, máxima ${s.latencyMs.max.toFixed(1)} ms. Com o MockProvider isso não inclui chamada de rede.`);
  L.push(`- Tokens aproximados (caracteres/4): ${s.tokens.input} de entrada, ${s.tokens.output} de saída, ${s.tokens.perConversation.toFixed(0)} por pergunta.`);
  L.push(`- Custo: ${costEstimate(s)}`, "");
  L.push("## Perguntas reprovadas", "");
  if (!fails.length) L.push("Nenhuma.", "");
  else {
    L.push("| ID | Tipo | Veredito | Tipo de resposta | Conf. | Artigos no topo | Pergunta |", "|---|---|---|---|---|---|---|");
    for (const x of fails) {
      L.push(`| ${x.id} | ${x.type} | ${x.verdict} | ${x.kind} | ${f2(x.confidence)} | ${x.topArticles.slice(0, 2).join(", ") || "—"} | ${x.question} |`);
    }
    L.push("");
  }
  L.push("## Todas as perguntas", "", "| ID | Veredito | Resposta | Conf. | Citou |", "|---|---|---|---|---|");
  for (const x of scores) L.push(`| ${x.id} | ${x.pass ? "✅" : "❌"} ${x.verdict} | ${x.kind} | ${f2(x.confidence)} | ${x.citedArticles.join(", ") || "—"} |`);
  L.push("");
  return L.join("\n");
}

async function main() {
  const profileName = arg("profile", "baseline");
  const label = arg("label", profileName);
  const outDir = path.resolve(arg("out", "docs/04-avaliacao"));
  const profile = PROFILES[profileName];
  if (!profile) throw new Error(`Perfil desconhecido: ${profileName}. Use: ${Object.keys(PROFILES).join(", ")}`);

  const datasetName = arg("dataset", "dataset");
  const questions = JSON.parse(fs.readFileSync(path.join(__dirname, `${datasetName}.json`), "utf8")) as EvalQuestion[];
  const index = buildIndex(profile);
  const store = inMemoryStore(index);
  const provider = providerFromEnv();
  const catBySlug = new Map(index.articles.map((a) => [a.slug, a.category]));
  const deps: AgentDeps = { embedder: index.embedder, store, provider, config: profile.agent, articleCategory: (s) => catBySlug.get(s) };

  const scores: QuestionScore[] = [];
  for (const q of questions) {
    const hits = await store.search(index.embedder.embed(q.question, true), profile.agent.topK);
    const t0 = performance.now();
    const result = await handleMessage(deps, { question: q.question });
    const latencyMs = performance.now() - t0;
    scores.push(scoreQuestion(q, result, { latencyMs, topArticles: [...new Set(hits.map((h) => h.chunk.articleSlug))] }));
  }

  const summary = summarize(scores);
  const meta = {
    Rodada: label,
    Perfil: profile.name,
    Provedor: provider.name,
    Embeddings: "hashing local (IDF + hash), 512 dimensões",
    Trechos: `${index.chunks.length} trechos de ${index.articles.length} artigos`,
    Commit: gitCommit(),
    Data: new Date().toISOString(),
    Conjunto: datasetName,
    Perguntas: String(questions.length),
  };
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `resultados-${label}.json`), JSON.stringify({ meta, profile, summary, scores }, null, 2));
  fs.writeFileSync(path.join(outDir, `relatorio-${label}.md`), renderReport(meta, summary, scores, JSON.stringify(profile, null, 2)));
  console.log(`${label}: ${summary.passed}/${summary.total} aprovadas (${pct(summary.passRate)})`);
  console.log(
    `respondíveis ok ${pct(summary.answerable.passRate)} | recusa correta ${pct(summary.outOfKb.correctRefusal)} | adversariais seguras ${pct(summary.adversarial.safe)}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
