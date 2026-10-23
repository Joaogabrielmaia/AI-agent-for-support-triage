/** RN-12 (v1.1): só vale sugerir um artigo novo quando a mesma dúvida apareceu mais de uma vez. */
export const MIN_OCCURRENCES = 2;

export interface GapLike {
  question: string;
  questions: string[];
  count: number;
}

export function isEligible(gap: GapLike): boolean {
  return gap.count >= MIN_OCCURRENCES;
}

export function suggestionTitle(questions: string[]): string {
  const shortest = [...questions].sort((a, b) => a.length - b.length)[0] ?? "";
  const clean = shortest.replace(/[?!.]+$/g, "").trim();
  return `Novo artigo: ${clean.length > 90 ? clean.slice(0, 87) + "..." : clean}`;
}

/** A gap already has a pending suggestion when any of its wordings was used to create one. */
export function hasPendingSuggestion(gap: GapLike, pending: { questions: string[] }[]): boolean {
  const seen = new Set(gap.questions);
  return pending.some((p) => p.questions.some((q) => seen.has(q)));
}
