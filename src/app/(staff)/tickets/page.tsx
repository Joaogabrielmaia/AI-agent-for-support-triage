import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { CATEGORY_LABELS, PRIORITY_LABELS } from "@/lib/agent/escalation";
import type { Priority, TicketCategory } from "@/lib/agent/types";
import { PriorityBadge, Pill, fmtDate } from "@/components/ui";
import { db } from "@/lib/server/db";

export const metadata = { title: "Fila de chamados · Prumo" };
export const dynamic = "force-dynamic";

const STATUS_LABEL = { OPEN: "Aberto", IN_PROGRESS: "Em andamento", DONE: "Concluído" } as const;
const PRIORITY_ORDER: Record<string, number> = { URGENTE: 0, ALTA: 1, MEDIA: 2, BAIXA: 3 };

export default async function TicketsPage({ searchParams }: { searchParams: Promise<{ status?: string; categoria?: string; prioridade?: string }> }) {
  const sp = await searchParams;
  const where: Prisma.TicketWhereInput = {};
  if (sp.status && sp.status in STATUS_LABEL) where.status = sp.status as keyof typeof STATUS_LABEL;
  if (sp.categoria && sp.categoria in CATEGORY_LABELS) where.category = sp.categoria as TicketCategory;
  if (sp.prioridade && sp.prioridade in PRIORITY_LABELS) where.priority = sp.prioridade as Priority;

  const tickets = (await db.ticket.findMany({ where, include: { conversation: { select: { customerName: true } } }, orderBy: { createdAt: "desc" } })).sort(
    (a, b) => (a.status === "DONE" ? 1 : 0) - (b.status === "DONE" ? 1 : 0) || PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-prumo-900">Fila de chamados</h1>
        <p className="text-sm text-slate-700">Ordenada por status e prioridade. Cada chamado chega com resumo, categoria e motivo do encaminhamento.</p>
      </div>

      <form className="card grid gap-3 sm:grid-cols-4" aria-label="Filtros">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Status</span>
          <select name="status" defaultValue={sp.status ?? ""} className="input">
            <option value="">Todos</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Categoria</span>
          <select name="categoria" defaultValue={sp.categoria ?? ""} className="input">
            <option value="">Todas</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Prioridade</span>
          <select name="prioridade" defaultValue={sp.prioridade ?? ""} className="input">
            <option value="">Todas</option>
            {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button className="btn btn-primary" type="submit">
            Filtrar
          </button>
          <Link href="/tickets" className="btn btn-ghost">
            Limpar
          </Link>
        </div>
      </form>

      {tickets.length === 0 ? (
        <p className="card text-sm text-slate-700">Nenhum chamado com esses filtros.</p>
      ) : (
        <ul className="space-y-3" data-testid="ticket-list">
          {tickets.map((t) => (
            <li key={t.id}>
              <Link href={`/tickets/${t.id}`} className="card block hover:border-prumo-500">
                <div className="flex flex-wrap items-center gap-2">
                  <PriorityBadge priority={t.priority} label={PRIORITY_LABELS[t.priority]} />
                  <Pill tone="blue">{CATEGORY_LABELS[t.category]}</Pill>
                  <Pill tone={t.status === "DONE" ? "green" : "slate"}>{STATUS_LABEL[t.status]}</Pill>
                  <span className="ml-auto text-xs text-slate-600">{fmtDate(t.createdAt)}</span>
                </div>
                <p className="mt-2 font-medium">{t.conversation.customerName}</p>
                <p className="text-sm text-slate-700">{t.reason}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
