import { Pill, fmtDate } from "@/components/ui";
import { MIN_OCCURRENCES, hasPendingSuggestion, isEligible } from "@/lib/agent/suggestions";
import { requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { loadMetrics } from "@/lib/server/metrics";
import { createSuggestionAction } from "../actions";

export const metadata = { title: "Lacunas da base · Prumo" };
export const dynamic = "force-dynamic";

export default async function GapsPage() {
  const user = await requireUser();
  const { gaps } = await loadMetrics();
  const pending = await db.articleSuggestion.findMany({ where: { status: "PENDING" }, select: { questions: true } });
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-prumo-900">Lacunas da base de conhecimento</h1>
        <p className="text-sm text-slate-700">
          Perguntas que o agente não soube responder, agrupadas por semelhança. As mais repetidas são as melhores candidatas a virar artigo novo
          {isAdmin ? ` (a partir de ${MIN_OCCURRENCES} ocorrências o painel oferece um rascunho).` : "."}
        </p>
      </div>
      {gaps.length === 0 ? (
        <p className="card text-sm text-slate-700">Nenhuma pergunta sem resposta até agora.</p>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-left text-sm" data-testid="gaps-table">
            <caption className="sr-only">Perguntas sem resposta</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-700">
              <tr>
                <th scope="col" className="px-4 py-2">Pergunta (exemplo)</th>
                <th scope="col" className="px-4 py-2">Vezes</th>
                <th scope="col" className="px-4 py-2">Última vez</th>
                {isAdmin && (
                  <th scope="col" className="px-4 py-2">
                    Sugestão de artigo
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {gaps.map((g) => (
                <tr key={g.question} className="border-b border-slate-100">
                  <td className="px-4 py-2">{g.question}</td>
                  <td className="px-4 py-2 font-semibold">{g.count}</td>
                  <td className="px-4 py-2">{fmtDate(g.lastSeen)}</td>
                  {isAdmin && (
                    <td className="px-4 py-2">
                      {!isEligible(g) ? (
                        <span className="text-xs text-slate-600">Só apareceu uma vez</span>
                      ) : hasPendingSuggestion(g, pending) ? (
                        <Pill tone="green">Rascunho criado</Pill>
                      ) : (
                        <form action={createSuggestionAction}>
                          <input type="hidden" name="questions" value={JSON.stringify(g.questions)} />
                          <input type="hidden" name="count" value={g.count} />
                          <button type="submit" className="btn btn-ghost">
                            Criar rascunho de artigo
                          </button>
                        </form>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
