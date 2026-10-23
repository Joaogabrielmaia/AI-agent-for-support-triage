import Link from "next/link";
import { Pill, fmtDate } from "@/components/ui";
import { CATEGORY_LABELS } from "@/lib/agent/escalation";
import { db } from "@/lib/server/db";

export const metadata = { title: "Conversas · Prumo" };
export const dynamic = "force-dynamic";

const KIND_LABEL = { ANSWER: "Respondida", REFUSAL: "Sem informação", ESCALATION: "Encaminhada", BLOCKED: "Bloqueada" } as const;

export default async function ConversationsPage() {
  const convs = await db.conversation.findMany({
    orderBy: { createdAt: "desc" },
    take: 60,
    include: { ticket: { select: { id: true } }, messages: { orderBy: { createdAt: "asc" } } },
  });
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-prumo-900">Conversas</h1>
        <p className="text-sm text-slate-700">Inclui as que o agente resolveu sozinho. Abra uma conversa para marcar se a resposta estava correta.</p>
      </div>
      <ul className="space-y-3" data-testid="conversation-list">
        {convs.map((c) => {
          const lastAi = [...c.messages].reverse().find((m) => m.role === "AGENT_AI");
          const first = c.messages.find((m) => m.role === "CUSTOMER");
          const unrated = c.messages.filter((m) => m.kind === "ANSWER" && !m.rating).length;
          return (
            <li key={c.id}>
              <Link href={`/conversas/${c.id}`} className="card block hover:border-prumo-500">
                <div className="flex flex-wrap items-center gap-2">
                  {lastAi?.kind && <Pill tone={lastAi.kind === "ANSWER" ? "green" : lastAi.kind === "BLOCKED" ? "red" : "slate"}>{KIND_LABEL[lastAi.kind]}</Pill>}
                  <Pill tone="blue">{CATEGORY_LABELS[c.category]}</Pill>
                  {c.ticket && <Pill>Com chamado</Pill>}
                  {unrated > 0 && <Pill>{unrated} resposta(s) sem avaliação</Pill>}
                  <span className="ml-auto text-xs text-slate-600">{fmtDate(c.createdAt)}</span>
                </div>
                <p className="mt-2 font-medium">{c.customerName}</p>
                <p className="line-clamp-1 text-sm text-slate-700">{first?.content}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
