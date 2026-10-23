export type TicketCategory =
  | "COBRANCA"
  | "CONTA_ACESSO"
  | "AGENDA"
  | "CLIENTES"
  | "FINANCEIRO_SALAO"
  | "PRIVACIDADE"
  | "TECNICO"
  | "PRIMEIROS_PASSOS"
  | "SUPORTE"
  | "OUTROS";

export type Priority = "BAIXA" | "MEDIA" | "ALTA" | "URGENTE";

/** What the agent decided to do with a customer message. */
export type ResultKind = "ANSWER" | "REFUSAL" | "ESCALATION" | "BLOCKED";

export interface Article {
  slug: string;
  title: string;
  category: string;
  body: string;
}

export interface Chunk {
  id: string;
  articleSlug: string;
  title: string;
  heading: string;
  /** Text shown to the model and to the customer. */
  text: string;
  /** Text that gets embedded (title + heading + body). */
  embedText: string;
  ordinal: number;
}

export interface Source {
  articleSlug: string;
  title: string;
  chunkId: string;
  heading: string;
  snippet: string;
  score: number;
}

export interface Hit {
  chunk: Chunk;
  score: number;
}

export interface Usage {
  inputTokens: number;
  outputTokens: number;
}

export interface HistoryTurn {
  role: "CUSTOMER" | "AGENT";
  content: string;
}

export interface Handoff {
  category: TicketCategory;
  priority: Priority;
  reason: string;
  summary: string;
}

export interface AgentResult {
  kind: ResultKind;
  text: string;
  sources: Source[];
  confidence: number;
  category: TicketCategory;
  /** Masked version of the customer message (what we store and send to the model). */
  maskedQuestion: string;
  piiFound: string[];
  handoff?: Handoff;
  /** Set when a guardrail fired (injection, cross-customer data, output filter...). */
  guardrail?: string;
  usage: Usage;
}

export interface AgentConfig {
  /** Minimum confidence to answer. Below it the agent says "não tenho essa informação". */
  threshold: number;
  topK: number;
  /** "top1": best cosine only. "top1+coverage": also needs the question terms to appear in the best chunk. */
  confidenceMode: "top1" | "top1+coverage";
  minCoverage: number;
}
