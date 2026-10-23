import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/server/crypto";
import { buildIndex, DEFAULT_PROFILE } from "../src/lib/agent/setup";

/**
 * Cria usuários de demonstração, os artigos e vetores da base de conhecimento.
 * Os dados de conversa de demonstração ficam em scripts/seed-demo.ts.
 */
const db = new PrismaClient();

export const DEMO_USERS = [
  { name: "Renata Alves", email: "admin@agendabela.test", role: "ADMIN" as const },
  { name: "Carlos Nogueira", email: "atendente@agendabela.test", role: "AGENT" as const },
];
export const DEMO_PASSWORD = "prumo-demo-123";

async function main() {
  for (const u of DEMO_USERS) {
    await db.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role },
      create: { ...u, passwordHash: hashPassword(DEMO_PASSWORD) },
    });
  }

  const index = buildIndex(DEFAULT_PROFILE);
  await db.chunk.deleteMany();
  await db.article.deleteMany();
  for (const a of index.articles) {
    await db.article.create({ data: { slug: a.slug, title: a.title, category: a.category, body: a.body } });
  }
  for (let i = 0; i < index.chunks.length; i++) {
    const c = index.chunks[i];
    const vec = `[${index.vectors[i].join(",")}]`;
    await db.$executeRaw`INSERT INTO "Chunk" (id, "articleSlug", heading, text, ordinal, embedding)
      VALUES (${c.id}, ${c.articleSlug}, ${c.heading}, ${c.text}, ${c.ordinal}, ${vec}::vector)`;
  }
  console.log(`Seed ok: ${DEMO_USERS.length} usuários, ${index.articles.length} artigos, ${index.chunks.length} trechos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
