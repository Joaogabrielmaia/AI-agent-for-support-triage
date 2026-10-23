import { HashingEmbedder, type EmbedderOptions, EMBED_DIM } from "./embedder";
import { chunkAll, loadArticles, type ChunkOptions } from "./kb";
import { InMemoryStore } from "./store";
import type { AgentConfig, Article, Chunk } from "./types";

export interface Profile {
  name: string;
  chunking: ChunkOptions;
  embedder: EmbedderOptions;
  agent: AgentConfig;
}

/** Round 1 of the evaluation: the first thing I would build without looking at errors. */
export const BASELINE_PROFILE: Profile = {
  name: "baseline",
  chunking: { strategy: "article", maxChars: 1500 },
  embedder: { dim: EMBED_DIM, bigrams: false, synonyms: false, prefix: 0 },
  agent: { threshold: 0.15, topK: 4, confidenceMode: "top1", minCoverage: 0, chunksPerArticle: 1 },
};

/**
 * Round 2: changes motivated by the round-1 error analysis (docs/04-avaliacao/analise-de-erros.md).
 * threshold/minCoverage are chosen with eval/sweep.ts and then checked on the separate validation set.
 */
export const TUNED_PROFILE: Profile = {
  name: "tuned",
  chunking: { strategy: "section", maxChars: 600 },
  embedder: { dim: EMBED_DIM, bigrams: true, synonyms: true, prefix: 5 },
  agent: { threshold: 0.16, topK: 4, confidenceMode: "top1+coverage", minCoverage: 0.4, chunksPerArticle: 1 },
};

/**
 * Round 3: the live demo showed "Quanto custa o plano Profissional?" answered with the extra-professional price.
 * Cause: only one chunk per article reached the model. Fix: allow two chunks per article.
 */
export const FINAL_PROFILE: Profile = {
  ...TUNED_PROFILE,
  name: "final",
  agent: { ...TUNED_PROFILE.agent, chunksPerArticle: 2 },
};

export const PROFILES: Record<string, Profile> = { baseline: BASELINE_PROFILE, tuned: TUNED_PROFILE, final: FINAL_PROFILE };

/** The profile the app runs with. Updated after each evaluation round (see docs/04-avaliacao). */
export const DEFAULT_PROFILE: Profile = FINAL_PROFILE;

export interface KbIndex {
  articles: Article[];
  chunks: Chunk[];
  embedder: HashingEmbedder;
  vectors: number[][];
}

export function buildIndex(profile: Profile, kbDir?: string): KbIndex {
  const articles = loadArticles(kbDir);
  const chunks = chunkAll(articles, profile.chunking);
  const embedder = new HashingEmbedder(profile.embedder).fit(chunks.map((c) => c.embedText));
  const vectors = chunks.map((c) => embedder.embed(c.embedText));
  return { articles, chunks, embedder, vectors };
}

export function inMemoryStore(index: KbIndex): InMemoryStore {
  return new InMemoryStore(index.chunks.map((chunk, i) => ({ chunk, vec: index.vectors[i] })));
}
