import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Pill, pct } from "@/components/ui";
import { requireUser } from "@/lib/server/auth";
import type { QuestionScore, Summary } from "../../../../eval/score";

export const metadata = { title: "Avaliação · Prumo" };
export const dynamic = "force-dynamic";

interface Run {
  meta: Record<string, string>;
  summary: Summary;
  scores: QuestionScore[];
}

const DIR = path.join(process.cwd(), "docs", "04-avaliacao");

function loadRuns(): Record<string, Run> {
  if (!fs.existsSync(DIR)) return {};
  const out: Record<string, Run> = {};
  for (const f of fs.readdirSync(DIR).filter((x) => x.startsWith("resultados-") && x.endsWith(".json")).sort()) {
    out[f.replace(/^resultados-|\.json$/g, "")] = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
  }
  return out;
}

export default async function EvalPage({ searchParams }: { searchParams: Promise<{ run?: string }> }) {
  await requireUser(["ADMIN"]);
  const runs = loadRuns();
  const labels = Object.keys(runs);
  const { run } = await searchParams;
  const current = (run && runs[run] ? run : labels.includes("rodada-2") ? "rodada-2" : labels[0]) as string | undefined;
  const r = current ? runs[current] : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-prumo-900">Relatório de avaliação</h1>
        <p className="text-sm text-slate-700">
          Lido de <code>docs/04-avaliacao/</code>. Gere novas rodadas com <code>npm run eval</code>.
        </p>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm" data-testid="runs-table">
          <caption className="sr-only">Rodadas de avaliação</caption>
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-700">
            <tr>
              <th scope="col" className="px-4 py-2">Rodada</th>
              <th scope="col" className="px-4 py-2">Conjunto</th>
              <th scope="col" className="px-4 py-2">Provedor</th>
              <th scope="col" className="px-4 py-2">Aprovadas</th>
              <th scope="col" className="px-4 py-2">Respondíveis</th>
              <th scope="col" className="px-4 py-2">Recusa correta</th>
              <th scope="col" className="px-4 py-2">Adversariais</th>
            </tr>
          </thead>
          <tbody>
            {labels.map((l) => {
              const x = runs[l];
              return (
                <tr key={l} className={`border-b border-slate-100 ${l === current ? "bg-prumo-50" : ""}`}>
                  <td className="px-4 py-2">
                    <Link className="font-medium text-prumo-600 underline" href={`/avaliacao?run=${l}`}>
                      {l}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{x.meta.Conjunto ?? "dataset"}</td>
                  <td className="px-4 py-2">{x.meta.Provedor}</td>
                  <td className="px-4 py-2 font-semibold">
                    {x.summary.passed}/{x.summary.total} ({pct(x.summary.passRate)})
                  </td>
                  <td className="px-4 py-2">{pct(x.summary.answerable.passRate)}</td>
                  <td className="px-4 py-2">{pct(x.summary.outOfKb.correctRefusal)}</td>
                  <td className="px-4 py-2">{pct(x.summary.adversarial.safe)}</td>
                </tr>
              );
            })}
            <tr className="text-slate-600">
              <td className="px-4 py-2">com o Claude real</td>
              <td className="px-4 py-2">dataset</td>
              <td className="px-4 py-2">anthropic</td>
              <td className="px-4 py-2" colSpan={4}>
                não executada (sem chave de API neste ambiente). Passo a passo em <code>docs/04-avaliacao/relatorio-claude.md</code>.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {r && current && (
        <section className="space-y-3" aria-label={`Detalhe da ${current}`}>
          <h2 className="text-lg font-semibold">
            {current} <Pill>{r.meta.Perfil}</Pill>
          </h2>
          <p className="text-sm text-slate-700">
            {r.meta.Trechos}. Commit {r.meta.Commit}.{r.meta.Provedor === "mock" && " Provedor mock: mede busca, limiar e guardrails, não a redação do Claude."}
          </p>
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-left text-sm" data-testid="failures-table">
              <caption className="px-4 pt-3 text-left text-sm font-semibold">Perguntas reprovadas ({r.scores.filter((s) => !s.pass).length})</caption>
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-700">
                <tr>
                  <th scope="col" className="px-4 py-2">ID</th>
                  <th scope="col" className="px-4 py-2">Veredito</th>
                  <th scope="col" className="px-4 py-2">Conf.</th>
                  <th scope="col" className="px-4 py-2">Pergunta</th>
                </tr>
              </thead>
              <tbody>
                {r.scores
                  .filter((s) => !s.pass)
                  .map((s) => (
                    <tr key={s.id} className="border-b border-slate-100">
                      <td className="px-4 py-2">{s.id}</td>
                      <td className="px-4 py-2">{s.verdict}</td>
                      <td className="px-4 py-2">{s.confidence.toFixed(2)}</td>
                      <td className="px-4 py-2">{s.question}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
