import { NextResponse } from "next/server";
import { z } from "zod";
import { escalateConversation } from "@/lib/server/conversation";

const Body = z.object({ conversationId: z.string().min(1).max(64) });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  try {
    return NextResponse.json(await escalateConversation(parsed.data.conversationId));
  } catch (e) {
    console.error("escalate error", e);
    return NextResponse.json({ error: "Não consegui encaminhar agora. Tente novamente." }, { status: 500 });
  }
}
