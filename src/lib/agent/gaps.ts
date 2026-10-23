import { tokenize } from "./text";

/** Words of a question reduced to 5-letter stems, so "integra" and "integração" meet. */
export function gapTokens(q: string): Set<string> {
  return new Set(tokenize(q, { prefix: 5 }));
}

/** Overlap coefficient: shared stems over the size of the smaller question. Needs at least 2 shared stems. */
export function overlap(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter >= 2 ? inter / Math.min(a.size, b.size) : 0;
}

export const GAP_SIMILARITY = 0.66;

/**
 * RF-11: groups the same question asked with different words.
 * Returns, for each input, the index of its group (first question of the group).
 */
export function clusterQuestions(questions: string[], minSimilarity = GAP_SIMILARITY): number[] {
  const sets = questions.map(gapTokens);
  const leaders: number[] = [];
  return sets.map((s, i) => {
    const hit = leaders.find((l) => overlap(sets[l], s) >= minSimilarity);
    if (hit !== undefined) return hit;
    leaders.push(i);
    return i;
  });
}
