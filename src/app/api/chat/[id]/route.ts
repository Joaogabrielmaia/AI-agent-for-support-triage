import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";

/** Poll used by the chat to show replies from a human. The conversation id is an unguessable cuid. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const conv = await db.conversation.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } }, ticket: { select: { status: true } } },
  });
  if (!conv) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
  return NextResponse.json({
    ticketStatus: conv.ticket?.status ?? null,
    messages: conv.messages.map((m) => ({ id: m.id, role: m.role, content: m.content, kind: m.kind, sources: m.sources })),
  });
}
