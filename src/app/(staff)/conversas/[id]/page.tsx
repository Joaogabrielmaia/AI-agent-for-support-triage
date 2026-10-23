import Link from "next/link";
import { notFound } from "next/navigation";
import { Transcript } from "@/components/transcript";
import { db } from "@/lib/server/db";

export const metadata = { title: "Conversa · Prumo" };
export const dynamic = "force-dynamic";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conv = await db.conversation.findUnique({ where: { id }, include: { messages: { orderBy: { createdAt: "asc" } }, ticket: { select: { id: true } } } });
  if (!conv) notFound();
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/conversas" className="text-sm font-medium text-prumo-600 underline">
        ← Voltar para as conversas
      </Link>
      <h1 className="text-xl font-bold text-prumo-900">{conv.customerName}</h1>
      {conv.ticket && (
        <p className="text-sm">
          Esta conversa tem um chamado:{" "}
          <Link className="font-medium text-prumo-600 underline" href={`/tickets/${conv.ticket.id}`}>
            abrir chamado
          </Link>
        </p>
      )}
      <Transcript messages={conv.messages} returnPath={`/conversas/${conv.id}`} />
    </div>
  );
}
