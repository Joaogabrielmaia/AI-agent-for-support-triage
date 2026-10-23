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
  embedder: { dim: EMBED_DIM, bigrams: false, synonyms: false },
  agent: { threshold: 0.15, topK: 4, confidenceMode: "top1", minCoverage: 0 },
};

export const PROFILES: Record<string, Profile> = { baseline: BASELINE_PROFILE };

/** The profile the app runs with. Updated after each evaluation round (see docs/04-avaliacao). */
export const DEFAULT_PROFILE: Profile = BASELINE_PROFILE;

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
