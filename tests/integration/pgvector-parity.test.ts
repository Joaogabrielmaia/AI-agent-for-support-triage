import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DEFAULT_PROFILE, buildIndex, inMemoryStore } from "@/lib/agent/setup";
import { PgVectorStore } from "@/lib/server/agent";

/**
 * A avaliação roda na busca em memória; o app roda no pgvector. Este teste garante que os dois
 * devolvem o mesmo trecho no topo. Precisa do banco do docker compose já com `npm run db:seed`.
 */
let dbUp = false;
const probe = new PrismaClient();

beforeAll(async () => {
  try {
    dbUp = (await probe.chunk.count()) > 0;
  } catch {
    dbUp = false;
  }
});
afterAll(async () => {
  await probe.$disconnect();
});

describe("paridade entre busca em memória e pgvector", () => {
  it("mesmo trecho no topo para as 50 perguntas de avaliação", async (ctx) => {
    if (!dbUp) return ctx.skip();
    const index = buildIndex(DEFAULT_PROFILE);
    const mem = inMemoryStore(index);
    const pg = new PgVectorStore();
    const ds = JSON.parse(fs.readFileSync(path.join(process.cwd(), "eval", "dataset.json"), "utf8")) as { question: string }[];
    let compared = 0;
    for (const q of ds) {
      const v = index.embedder.embed(q.question, true);
      const [a] = await mem.search(v, 1);
      const [b] = await pg.search(v, 1);
      expect(b.chunk.id, q.question).toBe(a.chunk.id);
      expect(Math.abs(a.score - b.score), q.question).toBeLessThan(1e-4);
      compared++;
    }
    expect(compared).toBe(50);
  });
});
