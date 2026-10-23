import { CATEGORY_LABELS } from "@/lib/agent/escalation";
import { Stat, pct } from "@/components/ui";
import { requireUser } from "@/lib/server/auth";
import { loadMetrics } from "@/lib/server/metrics";

export const metadata = { title: "Painel · Prumo" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireUser(["ADMIN"]);
  const m = await loadMetrics();
  const max = Math.max(1, ...m.byCategory.map((c) => c.count));
  const cost = m.estimatedCostPerConversationUsd;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-prumo-900">Painel</h1>
        <p className="text-sm text-slate-700">
          Calculado sobre as conversas guardadas neste banco local. No ambiente de demonstração, elas vêm do <code>db:demo</code> e do que for testado no chat, e não são
          medições de uso real.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Conversas" value={String(m.conversations)} testId="stat-conversations" />
        <Stat label="Resolvidas pelo agente" value={pct(m.resolutionRate)} hint="Tiveram resposta e não geraram chamado. O cliente não confirma." testId="stat-resolution" />
        <Stat label="Taxa de escalonamento" value={pct(m.escalationRate)} hint={`${m.escalated} conversas com chamado`} testId="stat-escalation" />
        <Stat label="Perguntas sem resposta" value={String(m.unanswered)} hint="Lacunas da base de conhecimento" testId="stat-unanswered" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card" aria-labelledby="cat-h">
          <h2 id="cat-h" className="text-lg font-semibold">
            Volume por categoria
          </h2>
          <ul className="mt-3 space-y-2" data-testid="by-category">
            {m.byCategory.map((c) => (
              <li key={c.category} className="text-sm">
                <div className="flex justify-between">
                  <span>{CATEGORY_LABELS[c.category]}</span>
                  <span className="font-semibold">{c.count}</span>
                </div>
                <div className="h-2 rounded bg-slate-100" role="presentation">
                  <div className="h-2 rounded bg-prumo-600" style={{ width: `${(c.count / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card space-y-3" aria-labelledby="q-h">
          <h2 id="q-h" className="text-lg font-semibold">
            Qualidade e custo
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt>Respostas avaliadas como corretas</dt>
              <dd className="font-semibold" data-testid="rating-rate">
                {m.ratings.correctRate === null ? "sem avaliações" : `${pct(m.ratings.correctRate)} (${m.ratings.correct} de ${m.ratings.correct + m.ratings.incorrect})`}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Pedidos bloqueados por guardrail</dt>
              <dd className="font-semibold">{m.blocked}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Tokens aproximados por conversa</dt>
              <dd className="font-semibold">{m.tokensPerConversation.toFixed(0)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Custo estimado por conversa</dt>
              <dd className="font-semibold" data-testid="cost">
                {cost === null ? "defina os preços no .env" : `US$ ${cost.toFixed(5)}`}
              </dd>
            </div>
          </dl>
          <p className="text-xs text-slate-600">
            Tokens são estimados por caracteres ÷ 4. O custo só aparece se <code>PRICE_INPUT_PER_MTOK</code> e <code>PRICE_OUTPUT_PER_MTOK</code> estiverem preenchidos, e é uma estimativa, não
            uma fatura.
          </p>
        </section>
      </div>
    </div>
  );
}
