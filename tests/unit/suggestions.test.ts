import { describe, expect, it } from "vitest";
import { DRAFT_NOTICE, MockProvider, draftTemplate } from "@/lib/agent/providers";
import { MIN_OCCURRENCES, hasPendingSuggestion, isEligible, suggestionTitle } from "@/lib/agent/suggestions";

describe("sugestões de artigo (v1.1, RN-12)", () => {
  it("só lacunas repetidas são elegíveis", () => {
    expect(isEligible({ question: "a", questions: ["a"], count: MIN_OCCURRENCES - 1 })).toBe(false);
    expect(isEligible({ question: "a", questions: ["a"], count: MIN_OCCURRENCES })).toBe(true);
  });

  it("título usa a pergunta mais curta, sem pontuação final", () => {
    expect(suggestionTitle(["Vocês têm integração com WhatsApp para enviar os lembretes?", "Vocês integram com WhatsApp?"])).toBe("Novo artigo: Vocês integram com WhatsApp");
  });

  it("não duplica sugestão pendente para as mesmas perguntas", () => {
    const gap = { question: "x", questions: ["x", "y"], count: 2 };
    expect(hasPendingSuggestion(gap, [{ questions: ["y", "z"] }])).toBe(true);
    expect(hasPendingSuggestion(gap, [{ questions: ["w"] }])).toBe(false);
  });

  it("o rascunho não inventa fatos: só perguntas reais e campos [PREENCHER]", async () => {
    const qs = ["Vocês integram com WhatsApp?", "Dá para mandar lembrete pelo WhatsApp?"];
    const { text } = await new MockProvider().draftArticle({ questions: qs });
    expect(text).toBe(draftTemplate(qs));
    expect(text).toContain(DRAFT_NOTICE);
    expect(text).toContain("[PREENCHER");
    expect(text).not.toMatch(/R\$\s?\d|\b\d+\s*(dias|horas|minutos)\b/);
    for (const q of qs) expect(text).toContain(q);
  });
});
