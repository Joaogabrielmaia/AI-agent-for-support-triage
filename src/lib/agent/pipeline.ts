import { categoryFromKb, matchEscalation } from "./escalation";
import type { HashingEmbedder } from "./embedder";
import { checkOutput, detectInjection, detectThirdPartyData, maskPii } from "./guardrails";
import { ProviderError, type LlmProvider } from "./providers";
import type { VectorStore } from "./store";
import type { AgentConfig, AgentResult, Handoff, HistoryTurn, Hit, Source, TicketCategory, Usage } from "./types";

export interface AgentDeps {
  embedder: HashingEmbedder;
  store: VectorStore;
  provider: LlmProvider;
  config: AgentConfig;
  /** Maps article slug -> KB category, so the ticket category follows the best source. */
  articleCategory?: (slug: string) => string | undefined;
}

export const MESSAGES = {
  refusal:
    "Não tenho essa informação na minha base de conhecimento, e prefiro não arriscar um palpite. Se quiser, posso encaminhar a sua dúvida para uma pessoa da equipe.",
  escalation:
    "Entendi. Esse assunto precisa ser analisado por uma pessoa da nossa equipe, então já estou encaminhando o seu pedido com um resumo para você não precisar repetir tudo. Por aqui eu não consigo confirmar valores, reembolsos nem prazos.",
  injection:
    "Não posso seguir esse tipo de instrução. Sigo sempre as mesmas regras de atendimento e não altero nem revelo a minha configuração. Posso ajudar com alguma dúvida sobre a Agenda Bela?",
  thirdParty:
    "Não posso compartilhar dados de outras contas ou de outras pessoas. Posso ajudar com informações sobre a sua própria conta e sobre como usar a Agenda Bela.",
  providerDown:
    "Estou com uma instabilidade para responder agora. Para você não ficar sem retorno, encaminhei a sua pergunta para uma pessoa da equipe.",
  outputBlocked:
    "Prefiro não responder isso por aqui para não passar uma informação que eu não consigo confirmar. Encaminhei a sua pergunta para uma pessoa da equipe.",
};

const ZERO: Usage = { inputTokens: 0, outputTokens: 0 };

function addUsage(a: Usage, b: Usage): Usage {
  return { inputTokens: a.inputTokens + b.inputTokens, outputTokens: a.outputTokens + b.outputTokens };
}

/** RN-02: how sure the agent is that the retrieved text answers the question. */
export function scoreConfidence(hits: Hit[], question: string, cfg: AgentConfig, embedder: HashingEmbedder): number {
  if (!hits.length) return 0;
  const top = hits[0];
  if (cfg.confidenceMode === "top1") return top.score;
  const q = [...new Set(embedder.tokens(question))];
  if (!q.length) return 0;
  const chunkTokens = new Set(embedder.tokens(top.chunk.embedText));
  const coverage = q.filter((t) => embedder.covers(t, chunkTokens)).length / q.length;
  return coverage >= cfg.minCoverage ? top.score : top.score * coverage;
}

/** RN-03: sources shown to the customer are the ones the answer was built from. */
export function pickSources(hits: Hit[], cfg: AgentConfig): Source[] {
  if (!hits.length) return [];
  const floor = Math.max(cfg.threshold, hits[0].score * 0.6);
  const perArticle = new Map<string, number>();
  const out: Source[] = [];
  for (const h of hits) {
    const used = perArticle.get(h.chunk.articleSlug) ?? 0;
    if (h.score < floor || used >= cfg.chunksPerArticle) continue;
    perArticle.set(h.chunk.articleSlug, used + 1);
    out.push({
      articleSlug: h.chunk.articleSlug,
      title: h.chunk.title,
      chunkId: h.chunk.id,
      heading: h.chunk.heading,
      snippet: h.chunk.text,
      score: Number(h.score.toFixed(4)),
    });
    if (out.length === 3) break;
  }
  return out;
}

function topSources(hits: Hit[]): Source[] {
  return hits.slice(0, 2).map((h) => ({
    articleSlug: h.chunk.articleSlug,
    title: h.chunk.title,
    chunkId: h.chunk.id,
    heading: h.chunk.heading,
    snippet: h.chunk.text,
    score: Number(h.score.toFixed(4)),
  }));
}

async function buildHandoff(
  deps: AgentDeps,
  history: HistoryTurn[],
  question: string,
  base: { category: TicketCategory; priority: Handoff["priority"]; reason: string },
  sources: Source[],
): Promise<{ handoff: Handoff; usage: Usage }> {
  try {
    const s = await deps.provider.summarize({ history, question, reason: base.reason, sources });
    return { handoff: { ...base, summary: s.text }, usage: s.usage };
  } catch {
    // The handoff must never fail because the model is down: fall back to a plain summary.
    return { handoff: { ...base, summary: `Pedido do cliente: "${question}". Motivo: ${base.reason}.` }, usage: ZERO };
  }
}

export async function handleMessage(deps: AgentDeps, input: { question: string; history?: HistoryTurn[] }): Promise<AgentResult> {
  const history = input.history ?? [];
  const masked = maskPii(input.question);
  const question = masked.text;
  const base = { maskedQuestion: question, piiFound: masked.found };

  // RN-07: injection and third-party data are blocked before anything else touches the model.
  const injection = detectInjection(question);
  if (injection) return { ...base, kind: "BLOCKED", text: MESSAGES.injection, sources: [], confidence: 0, category: "OUTROS", guardrail: injection, usage: ZERO };
  const third = detectThirdPartyData(question);
  if (third) return { ...base, kind: "BLOCKED", text: MESSAGES.thirdParty, sources: [], confidence: 0, category: "PRIVACIDADE", guardrail: third, usage: ZERO };

  const queryVec = deps.embedder.embed(question, true);
  let hits: Hit[];
  try {
    hits = await deps.store.search(queryVec, deps.config.topK);
  } catch {
    hits = []; // modo de falha: busca indisponível => tratamos como sem confiança
  }
  const confidence = scoreConfidence(hits, question, deps.config, deps.embedder);
  const kbCategory = hits[0] ? (deps.articleCategory?.(hits[0].chunk.articleSlug) ?? undefined) : undefined;
  const topCategory = confidence >= deps.config.threshold ? categoryFromKb(kbCategory) : "OUTROS";

  // RN-04: sensitive topics go to a person, with whatever context the knowledge base can offer.
  const rule = matchEscalation(question);
  if (rule) {
    const sources = confidence >= deps.config.threshold ? topSources(hits) : [];
    const { handoff, usage } = await buildHandoff(deps, history, question, rule, sources);
    return { ...base, kind: "ESCALATION", text: MESSAGES.escalation, sources, confidence, category: rule.category, handoff, guardrail: `escalonamento:${rule.id}`, usage };
  }

  // RN-02: below the threshold the agent admits it does not know.
  if (confidence < deps.config.threshold) {
    return { ...base, kind: "REFUSAL", text: MESSAGES.refusal, sources: [], confidence, category: "OUTROS", usage: ZERO };
  }

  const sources = pickSources(hits, deps.config);
  try {
    const completion = await deps.provider.answer({ question, history, sources });
    const check = checkOutput(completion.text, sources);
    if (!check.ok) {
      const { handoff, usage } = await buildHandoff(
        deps, history, question,
        { category: topCategory, priority: "MEDIA", reason: `Resposta do agente bloqueada pelo filtro de saída (${check.violation})` },
        sources,
      );
      return { ...base, kind: "ESCALATION", text: MESSAGES.outputBlocked, sources: [], confidence, category: topCategory, handoff, guardrail: `saida:${check.violation}`, usage: addUsage(completion.usage, usage) };
    }
    return { ...base, kind: "ANSWER", text: completion.text, sources, confidence, category: topCategory, usage: completion.usage };
  } catch (e) {
    if (!(e instanceof ProviderError)) throw e;
    // Modo de falha: API fora => não deixamos o cliente sem resposta, escalamos.
    const { handoff, usage } = await buildHandoff(
      deps, history, question,
      { category: topCategory, priority: "MEDIA", reason: "Provedor de linguagem indisponível" },
      sources,
    );
    return { ...base, kind: "ESCALATION", text: MESSAGES.providerDown, sources, confidence, category: topCategory, handoff, guardrail: "provedor_indisponivel", usage };
  }
}

/** Customer asked for a person after a refusal (RF-08). */
export async function escalateOnRequest(
  deps: AgentDeps,
  input: { question: string; history: HistoryTurn[]; category?: TicketCategory },
): Promise<{ handoff: Handoff; usage: Usage }> {
  return buildHandoff(
    deps,
    input.history,
    maskPii(input.question).text,
    { category: input.category ?? "OUTROS", priority: "MEDIA", reason: "Cliente pediu atendimento humano depois de uma resposta sem informação suficiente" },
    [],
  );
}
