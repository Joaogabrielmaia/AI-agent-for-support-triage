import { describe, expect, it } from "vitest";
import { categoryFromKb, matchEscalation } from "@/lib/agent/escalation";

describe("matchEscalation (RN-04, RN-05)", () => {
  const cases: [string, string, string][] = [
    ["Vou processar vocês no Procon", "juridico", "URGENTE"],
    ["Meus agendamentos sumiram do painel desde hoje cedo", "perda_de_dados", "URGENTE"],
    ["Sumiram meus agendamentos", "perda_de_dados", "URGENTE"],
    ["Quero reembolso do último mês", "reembolso", "ALTA"],
    ["Cobraram duas vezes a minha mensalidade", "cobranca_indevida", "ALTA"],
    ["Quero excluir minha conta e todos os meus dados", "exclusao_de_dados", "ALTA"],
    ["Perdi meu celular e não tenho o código do 2FA", "acesso_identidade", "ALTA"],
    ["Vocês fazem desconto no plano anual?", "comercial", "MEDIA"],
    ["Quero falar com um atendente", "pedido_humano", "MEDIA"],
  ];

  it.each(cases)("%s -> %s (%s)", (q, id, priority) => {
    const r = matchEscalation(q);
    expect(r?.id).toBe(id);
    expect(r?.priority).toBe(priority);
  });

  it("perguntas comuns não escalam", () => {
    for (const q of ["Quanto custa o plano Profissional?", "Como faço para cancelar minha assinatura?", "Esqueci minha senha", "Posso excluir uma cliente duplicada?"]) {
      expect(matchEscalation(q), q).toBeNull();
    }
  });

  it("regra mais grave vence quando há mais de um assunto", () => {
    expect(matchEscalation("Vou ao Procon se não devolverem meu dinheiro, quero reembolso")?.id).toBe("juridico");
  });
});

describe("categoryFromKb", () => {
  it("mapeia categorias da base para categorias de chamado", () => {
    expect(categoryFromKb("Cobrança")).toBe("COBRANCA");
    expect(categoryFromKb("Conta e acesso")).toBe("CONTA_ACESSO");
    expect(categoryFromKb(undefined)).toBe("OUTROS");
    expect(categoryFromKb("Desconhecida")).toBe("OUTROS");
  });
});
