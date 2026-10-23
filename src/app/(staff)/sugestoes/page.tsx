import { Pill, fmtDate } from "@/components/ui";
import { requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { decideSuggestionAction } from "../actions";

export const metadata = { title: "Sugestões de artigos · Prumo" };
export const dynamic = "force-dynamic";

const STATUS = { PENDING: "Pendente", ACCEPTED: "Aceita", DISCARDED: "Descartada" } as const;

export default async function SuggestionsPage() {
  await requireUser(["ADMIN"]);
  const items = await db.articleSuggestion.findMany({ orderBy: [{ status: "asc" }, { createdAt: "desc" }] });
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-prumo-900">Sugestões de novos artigos</h1>
        <p className="text-sm text-slate-700">
          Rascunhos criados a partir de lacunas repetidas. Eles trazem só as perguntas reais e espaços <code>[PREENCHER]</code>: o conteúdo precisa ser escrito e confirmado pela equipe antes de entrar em <code>kb/</code>.
        </p>
      </div>
      {items.length === 0 ? (
        <p className="card text-sm text-slate-700">Nenhuma sugestão ainda. Crie uma a partir de uma lacuna repetida em “Lacunas”.</p>
      ) : (
        <ul className="space-y-4" data-testid="suggestions">
          {items.map((s) => (
            <li key={s.id} className="card space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <Pill tone={s.status === "PENDING" ? "blue" : s.status === "ACCEPTED" ? "green" : "slate"}>{STATUS[s.status]}</Pill>
                <span className="ml-auto text-xs text-slate-600">
                  {s.occurrences} ocorrências · {fmtDate(s.createdAt)}
                </span>
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-800">{s.draft}</pre>
              {s.status === "PENDING" && (
                <div className="flex gap-2">
                  {(["ACCEPTED", "DISCARDED"] as const).map((st) => (
                    <form key={st} action={decideSuggestionAction}>
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="status" value={st} />
                      <button type="submit" className="btn btn-ghost">
                        {st === "ACCEPTED" ? "Aceitar (vou escrever o artigo)" : "Descartar"}
                      </button>
                    </form>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
