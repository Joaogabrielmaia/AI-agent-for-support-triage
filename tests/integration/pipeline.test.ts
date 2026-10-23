import { beforeAll, describe, expect, it } from "vitest";
import { handleMessage, type AgentDeps } from "@/lib/agent/pipeline";
import { MockProvider, ProviderError, type LlmProvider } from "@/lib/agent/providers";
import { DEFAULT_PROFILE, buildIndex, inMemoryStore } from "@/lib/agent/setup";
import type { VectorStore } from "@/lib/agent/store";

const noDraft = async () => ({ text: "", usage: { inputTokens: 0, outputTokens: 0 } });

let deps: AgentDeps;

beforeAll(() => {
  const index = buildIndex(DEFAULT_PROFILE);
  const cats = new Map(index.articles.map((a) => [a.slug, a.category]));
  deps = {
    embedder: index.embedder,
    store: inMemoryStore(index),
    provider: new MockProvider(),
    config: DEFAULT_PROFILE.agent,
    articleCategory: (s) => cats.get(s),
  };
});

describe("pipeline com MockProvider", () => {
  it("responde com fontes e categoria (RF-02, RF-03)", async () => {
    const r = await handleMessage(deps, { question: "Esqueci minha senha, o que eu faço?" });
    expect(r.kind).toBe("ANSWER");
    expect(r.sources.length).toBeGreaterThan(0);
    expect(r.sources[0].articleSlug).toBe("redefinir-senha");
    expect(r.text).toMatch(/\[1\]/);
    expect(r.category).toBe("CONTA_ACESSO");
  });

  it("admite que não sabe quando a confiança é baixa (RF-04)", async () => {
    const r = await handleMessage(deps, { question: "Qual a melhor tintura para cabelo loiro?" });
    expect(r.kind).toBe("REFUSAL");
    expect(r.text).toMatch(/Não tenho essa informação/);
    expect(r.sources).toEqual([]);
  });

  it("escala assunto sensível com resumo, categoria, prioridade e motivo (RF-05)", async () => {
    const r = await handleMessage(deps, {
      question: "Cobraram duas vezes a minha mensalidade, quero o reembolso.",
      history: [{ role: "CUSTOMER", content: "Oi, tenho um problema com a fatura" }],
    });
    expect(r.kind).toBe("ESCALATION");
    expect(r.handoff?.category).toBe("COBRANCA");
    expect(r.handoff?.priority).toBe("ALTA");
    expect(r.handoff?.reason).toMatch(/reembolso|cobrança/i);
    expect(r.handoff?.summary).toContain("Oi, tenho um problema com a fatura");
    expect(r.text).not.toMatch(/vamos reembolsar|garantimos/i);
  });

  it("mascara dados pessoais antes de guardar e de resumir (RN-06)", async () => {
    const r = await handleMessage(deps, { question: "Meu CPF é 123.456.789-09, quero reembolso." });
    expect(r.maskedQuestion).not.toContain("123.456.789-09");
    expect(r.piiFound).toContain("cpf");
    expect(r.handoff?.summary).not.toContain("123.456.789-09");
  });

  it("não deixa o cliente sem resposta quando o provedor falha (modo de falha)", async () => {
    const down: LlmProvider = {
      name: "down",
      draftArticle: noDraft,
      answer: async () => {
        throw new ProviderError("API fora");
      },
      summarize: async () => {
        throw new ProviderError("API fora");
      },
    };
    const r = await handleMessage({ ...deps, provider: down }, { question: "Como faço para cancelar minha assinatura?" });
    expect(r.kind).toBe("ESCALATION");
    expect(r.handoff?.reason).toMatch(/indisponível/);
    expect(r.handoff?.summary).toContain("Como faço para cancelar");
  });

  it("trata falha da busca como falta de confiança (modo de falha)", async () => {
    const broken: VectorStore = {
      search: async () => {
        throw new Error("banco fora");
      },
    };
    const r = await handleMessage({ ...deps, store: broken }, { question: "Quanto custa o plano Profissional?" });
    expect(r.kind).toBe("REFUSAL");
  });

  it("filtro de saída transforma resposta com promessa em encaminhamento (RN-08/09)", async () => {
    const promiser: LlmProvider = {
      name: "promiser",
      draftArticle: noDraft,
      answer: async () => ({ text: "Vamos reembolsar o valor ainda hoje, garantimos.", usage: { inputTokens: 1, outputTokens: 1 } }),
      summarize: async () => ({ text: "resumo", usage: { inputTokens: 1, outputTokens: 1 } }),
    };
    const r = await handleMessage({ ...deps, provider: promiser }, { question: "Como faço para cancelar minha assinatura?" });
    expect(r.kind).toBe("ESCALATION");
    expect(r.guardrail).toBe("saida:promessa_nao_fundamentada");
    expect(r.text).not.toMatch(/reembolsar/);
  });

  it("filtro de saída bloqueia preço inventado pelo modelo", async () => {
    const liar: LlmProvider = {
      name: "liar",
      draftArticle: noDraft,
      answer: async () => ({ text: "O plano Profissional custa R$ 49 por mês.", usage: { inputTokens: 1, outputTokens: 1 } }),
      summarize: async () => ({ text: "resumo", usage: { inputTokens: 1, outputTokens: 1 } }),
    };
    const r = await handleMessage({ ...deps, provider: liar }, { question: "Quanto custa o plano Profissional?" });
    expect(r.kind).toBe("ESCALATION");
    expect(r.guardrail).toBe("saida:preco_nao_fundamentado");
  });
});
