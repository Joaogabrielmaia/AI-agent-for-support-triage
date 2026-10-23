const STOPWORDS = new Set(
  (
    "a o as os um uma uns umas de do da dos das em no na nos nas por para com sem sob sobre ao aos à às e ou mas que se como " +
    "qual quais quando onde quem eu voce voces vc vcs me meu minha meus minhas seu sua seus suas nosso nossa ele ela eles elas " +
    "isso isto esse essa esses essas este esta estes estas aquele aquela ser sou foi eh estou estao tem tenho ter temos " +
    "ja tambem so muito muita mais menos pra pro pelo pela pelos pelas ate entre depois antes ainda mesmo mesma posso pode podem " +
    "podemos preciso gostaria queria quero fazer faco faz favor oi ola bom boa dia tarde noite obrigado obrigada"
  ).split(/\s+/),
);

export function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Very light PT-BR stemmer: enough to match plurals and a few common endings. */
function stem(w: string): string {
  if (w.length <= 3) return w;
  const rules: [RegExp, string][] = [
    [/coes$/, "cao"],
    [/mente$/, ""],
    [/(ais|eis|ois|uis)$/, "l"],
    [/ns$/, "m"],
    [/res$/, "r"],
    [/ses$/, "s"],
    [/s$/, ""],
  ];
  for (const [re, rep] of rules) if (re.test(w)) return w.replace(re, rep);
  return w;
}

export function tokenize(text: string, opts: { keepStopwords?: boolean; prefix?: number } = {}): string[] {
  const norm = stripAccents(text.toLowerCase());
  const raw = norm.match(/[a-z0-9]+/g) ?? [];
  const prefix = opts.prefix ?? 0;
  return raw
    .filter((t) => opts.keepStopwords || (!STOPWORDS.has(t) && t.length > 1))
    .map(stem)
    .map((t) => (prefix && t.length > prefix && !/[0-9]/.test(t) ? t.slice(0, prefix) : t));
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
