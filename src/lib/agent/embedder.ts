import { tokenize } from "./text";

export const EMBED_DIM = 512;

export interface EmbedderOptions {
  dim: number;
  bigrams: boolean;
  /** Query-side expansion with a small domain lexicon (see SYNONYMS). */
  synonyms: boolean;
  /** Truncate stems to this many letters (0 = off). Joins gratis/gratuito, atendem/atendemos. */
  prefix: number;
}

/** Small domain lexicon: colloquial term -> terms used in the knowledge base. */
export const SYNONYMS: Record<string, string[]> = {
  mensalidade: ["plano", "preco", "fatura"],
  valor: ["preco", "custa"],
  gratis: ["gratuito", "teste"],
  gratuito: ["gratis"],
  telefonar: ["telefone"],
  ligar: ["telefone"],
  custa: ["preco"],
  barato: ["preco", "plano"],
  desistir: ["cancelar"],
  encerrar: ["cancelar"],
  entrar: ["login", "acesso"],
  logar: ["login", "acesso"],
  funcionario: ["profissional"],
  funcionaria: ["profissional"],
  cabeleireira: ["profissional"],
  cabeleireiro: ["profissional"],
  faltas: ["falta", "lembrete"],
  planilha: ["importar", "csv"],
  excel: ["importar", "xlsx"],
  celular: ["aplicativo", "app"],
  trava: ["lento", "erro"],
  travou: ["lento", "erro"],
  caiu: ["fora", "erro"],
  boleto: ["fatura", "pagamento"],
  pix: ["pagamento"],
  cartao: ["pagamento"],
};

function fnv1a(str: string, seed = 2166136261): number {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/**
 * Deterministic, local text embedder: IDF-weighted hashed bag of words (+ bigrams), L2-normalised.
 * It is NOT a neural embedding. It exists so the whole system, tests and evaluation run without a network
 * or API key. It is isolated in this file so a neural model can replace it (see ADR-002).
 */
export class HashingEmbedder {
  private idf = new Map<string, number>();
  private defaultIdf = 1;

  constructor(private readonly opts: EmbedderOptions = { dim: EMBED_DIM, bigrams: true, synonyms: false, prefix: 0 }) {}

  get dim(): number {
    return this.opts.dim;
  }

  fit(texts: string[]): this {
    const df = new Map<string, number>();
    for (const t of texts) for (const w of new Set(this.tokens(t))) df.set(w, (df.get(w) ?? 0) + 1);
    const n = texts.length;
    this.idf = new Map([...df].map(([w, d]) => [w, Math.log((n + 1) / (d + 1)) + 1]));
    this.defaultIdf = Math.log(n + 1) + 1;
    return this;
  }

  private weight(token: string): number {
    return this.idf.get(token) ?? this.defaultIdf;
  }

  tokens(text: string): string[] {
    return tokenize(text, { prefix: this.opts.prefix });
  }

  /** Is this query token (or one of its synonyms) present in the chunk token set? */
  covers(token: string, chunkTokens: Set<string>): boolean {
    if (chunkTokens.has(token)) return true;
    if (!this.opts.synonyms) return false;
    return this.expand([token]).some((t) => chunkTokens.has(t));
  }

  expand(tokens: string[]): string[] {
    if (!this.opts.synonyms) return tokens;
    const extra: string[] = [];
    for (const t of tokens) for (const s of SYNONYMS[t] ?? []) extra.push(...this.tokens(s));
    return [...tokens, ...extra];
  }

  embed(text: string, isQuery = false): number[] {
    let tokens = this.tokens(text);
    if (isQuery) tokens = this.expand(tokens);
    const v = new Array<number>(this.opts.dim).fill(0);
    const add = (feature: string, w: number) => {
      const h = fnv1a(feature);
      const sign = (fnv1a(feature, 99991) & 1) === 0 ? 1 : -1;
      v[h % this.opts.dim] += sign * w;
    };
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const [t, c] of tf) add(t, (1 + Math.log(c)) * this.weight(t));
    if (this.opts.bigrams) {
      for (let i = 0; i < tokens.length - 1; i++) {
        add(tokens[i] + "_" + tokens[i + 1], 0.5 * Math.sqrt(this.weight(tokens[i]) * this.weight(tokens[i + 1])));
      }
    }
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
    return v.map((x) => x / norm);
  }
}

export function cosine(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}
