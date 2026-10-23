import type { Chunk, Hit } from "./types";
import { cosine } from "./embedder";

export interface VectorStore {
  search(queryVec: number[], k: number): Promise<Hit[]>;
}

/** In-memory store used by the evaluation harness and unit tests. Same cosine metric as pgvector's `<=>`. */
export class InMemoryStore implements VectorStore {
  constructor(private readonly rows: { chunk: Chunk; vec: number[] }[]) {}

  async search(queryVec: number[], k: number): Promise<Hit[]> {
    return this.rows
      .map((r) => ({ chunk: r.chunk, score: cosine(queryVec, r.vec) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }
}
