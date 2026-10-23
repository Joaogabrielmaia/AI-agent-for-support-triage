import type { Prisma } from "@prisma/client";
import { escalateOnRequest, handleMessage } from "../agent/pipeline";
import type { AgentResult, HistoryTurn } from "../agent/types";
import { getAgent } from "./agent";
import { db } from "./db";

function toHistory(msgs: { role: string; content: string }[]): HistoryTurn[] {
  return msgs
    .filter((m) => m.role === "CUSTOMER" || m.role === "AGENT_AI")
    .map((m) => ({ role: m.role === "CUSTOMER" ? "CUSTOMER" : "AGENT", content: m.content }));
}

export interface ChatReply {
  conversationId: string;
  result: Pick<AgentResult, "kind" | "text" | "sources" | "confidence">;
  ticketId?: string;
  messageId: string;
}

async function createTicket(conversationId: string, h: NonNullable<AgentResult["handoff"]>): Promise<string> {
  const existing = await db.ticket.findUnique({ where: { conversationId } });
  if (existing) return existing.id;
  const t = await db.ticket.create({
    data: { conversationId, category: h.category, priority: h.priority, reason: h.reason, summary: h.summary },
  });
  await db.conversation.update({ where: { id: conversationId }, data: { category: h.category } });
  return t.id;
}

/** RF-02..RF-07: one customer turn, end to end. */
export async function processCustomerMessage(input: {
  conversationId?: string;
  customerName?: string;
  message: string;
  isDemo?: boolean;
}): Promise<ChatReply> {
  const conv = input.conversationId
    ? await db.conversation.findUniqueOrThrow({ where: { id: input.conversationId }, include: { messages: { orderBy: { createdAt: "asc" } } } })
    : await db.conversation.create({
        data: { customerName: input.customerName?.trim() || "Cliente", isDemo: input.isDemo ?? false },
        include: { messages: true },
      });

  const deps = getAgent();
  const result = await handleMessage(deps, { question: input.message, history: toHistory(conv.messages) });

  await db.message.create({
    data: { conversationId: conv.id, role: "CUSTOMER", content: result.maskedQuestion, piiFound: result.piiFound },
  });
  const ai = await db.message.create({
    data: {
      conversationId: conv.id,
      role: "AGENT_AI",
      content: result.text,
      kind: result.kind,
      sources: result.sources as unknown as Prisma.InputJsonValue,
      confidence: result.confidence,
      guardrail: result.guardrail,
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
    },
  });

  if (result.category !== "OUTROS" && conv.category === "OUTROS") {
    await db.conversation.update({ where: { id: conv.id }, data: { category: result.category } });
  }
  const ticketId = result.handoff ? await createTicket(conv.id, result.handoff) : undefined;
  return { conversationId: conv.id, result, ticketId, messageId: ai.id };
}

/** RF-08: the customer asks for a person after "não tenho essa informação". */
export async function escalateConversation(conversationId: string): Promise<{ ticketId: string }> {
  const conv = await db.conversation.findUniqueOrThrow({ where: { id: conversationId }, include: { messages: { orderBy: { createdAt: "asc" } } } });
  const lastQuestion = [...conv.messages].reverse().find((m) => m.role === "CUSTOMER")?.content ?? "";
  const { handoff, usage } = await escalateOnRequest(getAgent(), { question: lastQuestion, history: toHistory(conv.messages), category: conv.category });
  const ticketId = await createTicket(conversationId, handoff);
  await db.message.create({
    data: {
      conversationId,
      role: "AGENT_AI",
      content: "Pronto, encaminhei a sua dúvida para uma pessoa da equipe, com um resumo da nossa conversa. Você receberá a resposta aqui mesmo.",
      kind: "ESCALATION",
      guardrail: "escalonamento:pedido_do_cliente",
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
    },
  });
  return { ticketId };
}
