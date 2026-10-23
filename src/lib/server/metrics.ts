import type { TicketCategory } from "../agent/types";
import { clusterQuestions } from "../agent/gaps";
import { db } from "./db";

export interface MetricMessage {
  role: "CUSTOMER" | "AGENT_AI" | "HUMAN";
  kind: "ANSWER" | "REFUSAL" | "ESCALATION" | "BLOCKED" | null;
  content: string;
  inputTokens: number;
  outputTokens: number;
  rating: "CORRECT" | "INCORRECT" | null;
  createdAt: Date;
}

export interface MetricConversation {
  category: TicketCategory;
  hasTicket: boolean;
  messages: MetricMessage[];
}

export interface GapRow {
  question: string;
  /** Every wording seen in this group (v1.1 uses it to draft an article). */
  questions: string[];
  count: number;
  lastSeen: Date;
}

export interface Metrics {
  conversations: number;
  /** RF-10: conversas com ao menos uma resposta do agente e sem chamado aberto. Proxy: o cliente não confirma. */
  resolvedByAgent: number;
  resolutionRate: number;
  escalated: number;
  escalationRate: number;
  blocked: number;
  unanswered: number;
  byCategory: { category: TicketCategory; count: number }[];
  ratings: { correct: number; incorrect: number; correctRate: number | null };
  tokensPerConversation: number;
  estimatedCostPerConversationUsd: number | null;
  gaps: GapRow[];
}

export function estimateCostUsd(inputTokens: number, outputTokens: number, env: Record<string, string | undefined> = process.env): number | null {
  const pin = Number(env.PRICE_INPUT_PER_MTOK);
  const pout = Number(env.PRICE_OUTPUT_PER_MTOK);
  if (!pin || !pout) return null;
  return (inputTokens * pin + outputTokens * pout) / 1_000_000;
}

/** Pure function so the dashboard rules are unit-testable (RF-10). */
export function computeMetrics(convs: MetricConversation[], env: Record<string, string | undefined> = process.env): Metrics {
  const n = convs.length;
  const msgs = convs.flatMap((c) => c.messages);
  const answered = (c: MetricConversation) => c.messages.some((m) => m.kind === "ANSWER");
  const resolvedByAgent = convs.filter((c) => answered(c) && !c.hasTicket).length;
  const escalated = convs.filter((c) => c.hasTicket).length;
  const cat = new Map<TicketCategory, number>();
  for (const c of convs) cat.set(c.category, (cat.get(c.category) ?? 0) + 1);

  const rated = msgs.filter((m) => m.rating);
  const correct = rated.filter((m) => m.rating === "CORRECT").length;
  const tin = msgs.reduce((t, m) => t + m.inputTokens, 0);
  const tout = msgs.reduce((t, m) => t + m.outputTokens, 0);

  const refused: { question: string; at: Date }[] = [];
  for (const c of convs) {
    c.messages.forEach((m, i) => {
      if (m.kind !== "REFUSAL") return;
      const q = [...c.messages.slice(0, i)].reverse().find((x) => x.role === "CUSTOMER");
      if (q) refused.push({ question: q.content, at: q.createdAt });
    });
  }
  const groups = clusterQuestions(refused.map((r) => r.question));
  const gapMap = new Map<number, GapRow>();
  refused.forEach((r, i) => {
    const cur = gapMap.get(groups[i]);
    if (cur) {
      cur.count++;
      if (!cur.questions.includes(r.question)) cur.questions.push(r.question);
      if (r.at > cur.lastSeen) cur.lastSeen = r.at;
    } else gapMap.set(groups[i], { question: r.question, questions: [r.question], count: 1, lastSeen: r.at });
  });

  const cost = estimateCostUsd(tin, tout, env);
  return {
    conversations: n,
    resolvedByAgent,
    resolutionRate: n ? resolvedByAgent / n : 0,
    escalated,
    escalationRate: n ? escalated / n : 0,
    blocked: msgs.filter((m) => m.kind === "BLOCKED").length,
    unanswered: msgs.filter((m) => m.kind === "REFUSAL").length,
    byCategory: [...cat].map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count),
    ratings: { correct, incorrect: rated.length - correct, correctRate: rated.length ? correct / rated.length : null },
    tokensPerConversation: n ? (tin + tout) / n : 0,
    estimatedCostPerConversationUsd: cost !== null && n ? cost / n : null,
    gaps: [...gapMap.values()].sort((a, b) => b.count - a.count || b.lastSeen.getTime() - a.lastSeen.getTime()),
  };
}

export async function loadMetrics(): Promise<Metrics> {
  const rows = await db.conversation.findMany({
    include: {
      ticket: { select: { id: true } },
      messages: { orderBy: { createdAt: "asc" }, select: { role: true, kind: true, content: true, inputTokens: true, outputTokens: true, rating: true, createdAt: true } },
    },
  });
  return computeMetrics(rows.map((r) => ({ category: r.category, hasTicket: !!r.ticket, messages: r.messages })));
}
