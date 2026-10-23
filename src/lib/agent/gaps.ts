import { tokenize } from "./text";

/** Groups the same question asked with small wording differences (RF-11). */
export function normalizeQuestion(q: string): string {
  return [...new Set(tokenize(q))].sort().join(" ");
}
