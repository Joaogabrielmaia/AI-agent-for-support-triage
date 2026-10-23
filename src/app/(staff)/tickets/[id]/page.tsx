import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_LABELS, PRIORITY_LABELS } from "@/lib/agent/escalation";
import { Pill, PriorityBadge, fmtDate } from "@/components/ui";
import { db } from "@/lib/server/db";
import { Transcript } from "@/components/transcript";
import { replyAction, setStatusAction } from "../../actions";

export const metadata = { title: "Chamado · Prumo" };
export const dynamic = "force-dynamic";

const STATUS_LABEL = { OPEN: "Aberto", IN_PROGRESS: "Em andamento", DONE: "Concluído" } as const;

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await db.ticket.findUnique({
    where: { id },
    include: { assignee: { select: { name: true } }, conversation: { include: { messages: { orderBy: { createdAt: "asc" } } } } },
  });
  if (!ticket) notFound();

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <section className="space-y-4 lg:col-span-1" aria-label="Resumo do chamado">
        <Link href="/tickets" className="text-sm font-medium text-prumo-600 underline">
          ← Voltar para a fila
        </Link>
        <div className="card space-y-3">
          <div className="flex flex-wrap gap-2">
            <PriorityBadge priority={ticket.priority} label={PRIORITY_LABELS[ticket.priority]} />
            <Pill tone="blue">{CATEGORY_LABELS[ticket.category]}</Pill>
            <Pill>{STATUS_LABEL[ticket.status]}</Pill>
          </div>
          <h1 className="text-xl font-bold text-prumo-900">{ticket.conversation.customerName}</h1>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-semibold">Motivo do encaminhamento</dt>
              <dd className="text-slate-800" data-testid="ticket-reason">{ticket.reason}</dd>
            </div>
            <div>
              <dt className="font-semibold">Resumo para o atendente</dt>
              <dd className="text-slate-800" data-testid="ticket-summary">{ticket.summary}</dd>
            </div>
            <div>
              <dt className="font-semibold">Aberto em</dt>
              <dd className="text-slate-800">{fmtDate(ticket.createdAt)}</dd>
            </div>
            <div>
              <dt className="font-semibold">Responsável</dt>
              <dd className="text-slate-800">{ticket.assignee?.name ?? "Ninguém ainda"}</dd>
            </div>
          </dl>
          <form action={setStatusAction} className="flex items-end gap-2">
            <input type="hidden" name="ticketId" value={ticket.id} />
            <label className="flex-1 text-sm">
              <span className="mb-1 block font-medium">Status</span>
              <select name="status" defaultValue={ticket.status} className="input">
                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn btn-ghost" type="submit">
              Atualizar
            </button>
          </form>
        </div>
      </section>

      <section className="space-y-4 lg:col-span-2" aria-label="Conversa">
        <Transcript messages={ticket.conversation.messages} returnPath={`/tickets/${ticket.id}`} />

        <form action={replyAction} className="card space-y-3">
          <input type="hidden" name="ticketId" value={ticket.id} />
          <label htmlFor="text" className="block text-sm font-semibold">
            Responder ao cliente
          </label>
          <textarea id="text" name="text" required maxLength={2000} rows={4} className="input" placeholder="Escreva a resposta que o cliente verá no chat…" />
          <button className="btn btn-primary" type="submit">
            Enviar resposta
          </button>
        </form>
      </section>
    </div>
  );
}
