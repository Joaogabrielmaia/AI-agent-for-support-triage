import { buildIndex, DEFAULT_PROFILE } from "../agent/setup";
import { providerFromEnv } from "../agent/providers";
import type { AgentDeps } from "../agent/pipeline";
import type { Chunk, Hit } from "../agent/types";
import type { VectorStore } from "../agent/store";
import { db } from "./db";

/** pgvector `<=>` is cosine distance, so score = 1 - distance. Same metric as the in-memory store used by the evaluation. */
export class PgVectorStore implements VectorStore {
  async search(queryVec: number[], k: number): Promise<Hit[]> {
    const vec = `[${queryVec.join(",")}]`;
    const rows = await db.$queryRaw<
      { id: string; articleSlug: string; title: string; heading: string; text: string; ordinal: number; score: number }[]
    >`SELECT c.id, c."articleSlug", a.title, c.heading, c.text, c.ordinal,
             1 - (c.embedding <=> ${vec}::vector) AS score
      FROM "Chunk" c JOIN "Article" a ON a.slug = c."articleSlug"
      WHERE c.embedding IS NOT NULL
      ORDER BY c.embedding <=> ${vec}::vector
      LIMIT ${k}`;
    return rows.map((r) => {
      const chunk: Chunk = {
        id: r.id,
        articleSlug: r.articleSlug,
        title: r.title,
        heading: r.heading,
        text: r.text,
        embedText: `${r.title}. ${r.heading}. ${r.text}`,
        ordinal: r.ordinal,
      };
      return { chunk, score: Number(r.score) };
    });
  }
}

const g = globalThis as unknown as { prumoDeps?: AgentDeps; prumoCategories?: Map<string, string> };

/** Embedder is fitted from the same kb/ files and profile the seed used, so query and stored vectors agree. */
export function getAgent(): AgentDeps {
  if (!g.prumoDeps) {
    const index = buildIndex(DEFAULT_PROFILE);
    const cats = new Map(index.articles.map((a) => [a.slug, a.category]));
    g.prumoCategories = cats;
    g.prumoDeps = {
      embedder: index.embedder,
      store: new PgVectorStore(),
      provider: providerFromEnv(),
      config: { ...DEFAULT_PROFILE.agent, threshold: Number(process.env.CONFIDENCE_THRESHOLD) || DEFAULT_PROFILE.agent.threshold },
      articleCategory: (slug) => cats.get(slug),
    };
  }
  return g.prumoDeps;
}
