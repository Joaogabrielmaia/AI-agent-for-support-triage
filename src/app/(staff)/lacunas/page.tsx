import { fmtDate } from "@/components/ui";
import { loadMetrics } from "@/lib/server/metrics";

export const metadata = { title: "Lacunas da base · Prumo" };
export const dynamic = "force-dynamic";

export default async function GapsPage() {
  const { gaps } = await loadMetrics();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-prumo-900">Lacunas da base de conhecimento</h1>
        <p className="text-sm text-slate-700">
          Perguntas que o agente não soube responder, agrupadas por semelhança. As mais repetidas são as melhores candidatas a virar artigo novo.
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
                <th scope="col" className="px-4 py-2">
                  Pergunta (exemplo)
                </th>
                <th scope="col" className="px-4 py-2">
                  Vezes
                </th>
                <th scope="col" className="px-4 py-2">
                  Última vez
                </th>
              </tr>
            </thead>
            <tbody>
              {gaps.map((g) => (
                <tr key={g.question} className="border-b border-slate-100">
                  <td className="px-4 py-2">{g.question}</td>
                  <td className="px-4 py-2 font-semibold">{g.count}</td>
                  <td className="px-4 py-2">{fmtDate(g.lastSeen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
