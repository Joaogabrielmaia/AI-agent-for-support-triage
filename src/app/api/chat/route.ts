import { NextResponse } from "next/server";
import { z } from "zod";
import { processCustomerMessage } from "@/lib/server/conversation";

const Body = z.object({
  conversationId: z.string().min(1).max(64).optional(),
  customerName: z.string().max(80).optional(),
  message: z.string().trim().min(1, "Escreva uma mensagem").max(1000, "Mensagem longa demais (máx. 1000 caracteres)"),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Requisição inválida" }, { status: 400 });
  try {
    const reply = await processCustomerMessage(parsed.data);
    return NextResponse.json(reply);
  } catch (e) {
    console.error("chat error", e);
    return NextResponse.json({ error: "Não consegui processar agora. Tente novamente em instantes." }, { status: 500 });
  }
}
