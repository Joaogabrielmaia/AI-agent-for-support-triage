import fs from "node:fs";
import path from "node:path";
import type { Article, Chunk } from "./types";

export function loadArticles(dir = path.join(process.cwd(), "kb")): Article[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8").replace(/\r\n/g, "\n");
      const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!m) throw new Error(`Artigo sem frontmatter: ${file}`);
      const meta = Object.fromEntries(
        m[1].split("\n").map((l) => {
          const i = l.indexOf(":");
          return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
        }),
      );
      return { slug: file.replace(/\.md$/, ""), title: meta.title, category: meta.category, body: m[2].trim() };
    });
}

export interface ChunkOptions {
  /** "article": one chunk per article. "section": one chunk per H2 section. */
  strategy: "article" | "section";
  /** Pieces longer than this are split on sentence boundaries. */
  maxChars: number;
}

function splitLong(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];
  const sentences = text.split(/(?<=[.!?])\s+/);
  const out: string[] = [];
  let cur = "";
  for (const s of sentences) {
    if (cur && (cur + " " + s).length > maxChars) {
      out.push(cur);
      cur = s;
    } else cur = cur ? cur + " " + s : s;
  }
  if (cur) out.push(cur);
  return out;
}

export function chunkArticle(a: Article, opts: ChunkOptions): Chunk[] {
  const withoutH1 = a.body.replace(/^# .*\n+/, "");
  const sections = withoutH1.split(/^## /m).filter(Boolean);
  const pieces: { heading: string; text: string }[] =
    opts.strategy === "article"
      ? [{ heading: "", text: sections.map((s) => s.replace(/^(.*)\n/, "$1. ")).join(" ").replace(/\s+/g, " ") }]
      : sections.map((s) => {
          const [heading, ...rest] = s.split("\n");
          return { heading: heading.trim(), text: rest.join(" ").replace(/\s+/g, " ").trim() };
        });
  const chunks: Chunk[] = [];
  for (const p of pieces) {
    for (const part of splitLong(p.text, opts.maxChars)) {
      const ordinal = chunks.length;
      chunks.push({
        id: `${a.slug}#${ordinal}`,
        articleSlug: a.slug,
        title: a.title,
        heading: p.heading,
        text: part,
        embedText: `${a.title}. ${p.heading}. ${part}`,
        ordinal,
      });
    }
  }
  return chunks;
}

export function chunkAll(articles: Article[], opts: ChunkOptions): Chunk[] {
  return articles.flatMap((a) => chunkArticle(a, opts));
}
