import { describe, expect, it } from "vitest";
import { chunkAll, loadArticles } from "@/lib/agent/kb";
import { computeMetrics, estimateCostUsd, type MetricConversation } from "@/lib/server/metrics";
import { hashPassword, makeToken, readToken, verifyPassword } from "@/lib/server/crypto";

describe("base de conhecimento (RF-01)", () => {
  const articles = loadArticles();

  it("tem pelo menos 25 artigos com título e categoria", () => {
    expect(articles.length).toBeGreaterThanOrEqual(25);
    for (const a of articles) {
      expect(a.title, a.slug).toBeTruthy();
      expect(a.category, a.slug).toBeTruthy();
    }
  });

  it("divide por seção sem perder texto", () => {
    const chunks = chunkAll(articles, { strategy: "section", maxChars: 600 });
    expect(chunks.length).toBeGreaterThan(articles.length);
    for (const c of chunks) expect(c.text.length, c.id).toBeLessThanOrEqual(700);
    const ids = new Set(chunks.map((c) => c.id));
    expect(ids.size).toBe(chunks.length);
  });

  it("chunking por artigo gera um trecho por artigo (baseline)", () => {
    expect(chunkAll(articles, { strategy: "article", maxChars: 100000 }).length).toBe(articles.length);
  });
});

const msg = (over: Partial<MetricConversation["messages"][number]>): MetricConversation["messages"][number] => ({
  role: "AGENT_AI",
  kind: null,
  content: "",
  inputTokens: 0,
  outputTokens: 0,
  rating: null,
  createdAt: new Date("2026-01-01T10:00:00Z"),
  ...over,
});

describe("computeMetrics (RF-10, RF-11)", () => {
  const convs: MetricConversation[] = [
    { category: "COBRANCA", hasTicket: false, messages: [msg({ role: "CUSTOMER", content: "quanto custa" }), msg({ kind: "ANSWER", inputTokens: 400, outputTokens: 100, rating: "CORRECT" })] },
    { category: "OUTROS", hasTicket: false, messages: [msg({ role: "CUSTOMER", content: "integra com WhatsApp?" }), msg({ kind: "REFUSAL" })] },
    { category: "OUTROS", hasTicket: false, messages: [msg({ role: "CUSTOMER", content: "tem integração WhatsApp" }), msg({ kind: "REFUSAL" })] },
    { category: "COBRANCA", hasTicket: true, messages: [msg({ role: "CUSTOMER", content: "reembolso" }), msg({ kind: "ESCALATION" })] },
  ];

  it("calcula taxas sobre o total de conversas", () => {
    const m = computeMetrics(convs, {});
    expect(m.conversations).toBe(4);
    expect(m.resolutionRate).toBeCloseTo(0.25);
    expect(m.escalationRate).toBeCloseTo(0.25);
    expect(m.unanswered).toBe(2);
    expect(m.byCategory[0]).toEqual({ category: "COBRANCA", count: 2 });
  });

  it("agrupa perguntas parecidas como a mesma lacuna", () => {
    const m = computeMetrics(convs, {});
    expect(m.gaps).toHaveLength(1);
    expect(m.gaps[0].count).toBe(2);
  });

  it("custo só é estimado com preços configurados", () => {
    expect(computeMetrics(convs, {}).estimatedCostPerConversationUsd).toBeNull();
    expect(estimateCostUsd(1_000_000, 1_000_000, { PRICE_INPUT_PER_MTOK: "1", PRICE_OUTPUT_PER_MTOK: "2" })).toBe(3);
  });

  it("taxa de respostas corretas considera só as avaliadas", () => {
    const m = computeMetrics(convs, {});
    expect(m.ratings).toEqual({ correct: 1, incorrect: 0, correctRate: 1 });
  });

  it("sem conversas, nada divide por zero", () => {
    const m = computeMetrics([], {});
    expect(m.resolutionRate).toBe(0);
    expect(m.tokensPerConversation).toBe(0);
  });
});

describe("sessão e senha (RNF-05)", () => {
  process.env.SESSION_SECRET = "segredo-de-teste-com-mais-de-16-chars";

  it("token válido volta o userId", () => {
    expect(readToken(makeToken("u1"))).toBe("u1");
  });

  it("token adulterado ou expirado é rejeitado", () => {
    const t = makeToken("u1");
    expect(readToken(t.replace("u1", "u2"))).toBeNull();
    expect(readToken(t, Date.now() + 9 * 3600 * 1000)).toBeNull();
    expect(readToken(undefined)).toBeNull();
    expect(readToken("lixo")).toBeNull();
  });

  it("senha: hash com sal, verifica certo e errado", () => {
    const h = hashPassword("prumo-demo-123");
    expect(h).not.toContain("prumo-demo-123");
    expect(hashPassword("prumo-demo-123")).not.toBe(h);
    expect(verifyPassword("prumo-demo-123", h)).toBe(true);
    expect(verifyPassword("errada", h)).toBe(false);
  });
});

describe("clusterQuestions (RF-11)", () => {
  it("agrupa a mesma dúvida com palavras diferentes e separa assuntos distintos", async () => {
    const { clusterQuestions } = await import("@/lib/agent/gaps");
    const g = clusterQuestions([
      "Vocês têm integração com WhatsApp para enviar os lembretes?",
      "Vocês integram com WhatsApp?",
      "Quando vai sair o módulo de prontuário eletrônico?",
      "Vocês têm prontuário eletrônico para clínica?",
      "Posso usar o sistema em inglês ou espanhol?",
    ]);
    expect(g[0]).toBe(g[1]);
    expect(g[2]).toBe(g[3]);
    expect(new Set(g).size).toBe(3);
  });
});
