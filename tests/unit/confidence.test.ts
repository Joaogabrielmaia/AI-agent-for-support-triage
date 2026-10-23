import { describe, expect, it } from "vitest";
import { HashingEmbedder } from "@/lib/agent/embedder";
import { pickSources, scoreConfidence } from "@/lib/agent/pipeline";
import type { AgentConfig, Chunk, Hit } from "@/lib/agent/types";

const chunk = (slug: string, text: string, n = 0): Chunk => ({
  id: `${slug}#${n}`,
  articleSlug: slug,
  title: slug,
  heading: "h",
  text,
  embedText: `${slug}. h. ${text}`,
  ordinal: n,
});

const cfg: AgentConfig = { threshold: 0.3, topK: 4, confidenceMode: "top1+coverage", minCoverage: 0.5, chunksPerArticle: 1 };
const embedder = new HashingEmbedder({ dim: 64, bigrams: false, synonyms: false, prefix: 0 });

describe("scoreConfidence (RN-02)", () => {
  it("sem trechos, a confiança é zero", () => {
    expect(scoreConfidence([], "qualquer coisa", cfg, embedder)).toBe(0);
  });

  it("modo top1 devolve a similaridade do melhor trecho", () => {
    const hits: Hit[] = [{ chunk: chunk("a", "plano custa"), score: 0.62 }];
    expect(scoreConfidence(hits, "plano custa", { ...cfg, confidenceMode: "top1" }, embedder)).toBe(0.62);
  });

  it("cobertura baixa derruba a confiança", () => {
    const hits: Hit[] = [{ chunk: chunk("a", "plano custa mensal"), score: 0.5 }];
    const covered = scoreConfidence(hits, "plano custa", cfg, embedder);
    const uncovered = scoreConfidence(hits, "impressora fiscal configurar", cfg, embedder);
    expect(covered).toBe(0.5);
    expect(uncovered).toBeLessThan(0.3);
  });
});

describe("pickSources (RN-03)", () => {
  const hits: Hit[] = [
    { chunk: chunk("a", "x", 0), score: 0.8 },
    { chunk: chunk("a", "y", 1), score: 0.7 },
    { chunk: chunk("b", "z", 0), score: 0.6 },
    { chunk: chunk("c", "w", 0), score: 0.2 },
  ];

  it("uma fonte por artigo quando chunksPerArticle = 1", () => {
    expect(pickSources(hits, cfg).map((s) => s.articleSlug)).toEqual(["a", "b"]);
  });

  it("até dois trechos do mesmo artigo quando chunksPerArticle = 2", () => {
    expect(pickSources(hits, { ...cfg, chunksPerArticle: 2 }).map((s) => s.chunkId)).toEqual(["a#0", "a#1", "b#0"]);
  });

  it("descarta trechos abaixo do limiar e muito abaixo do melhor", () => {
    expect(pickSources(hits, cfg).some((s) => s.articleSlug === "c")).toBe(false);
  });
});
