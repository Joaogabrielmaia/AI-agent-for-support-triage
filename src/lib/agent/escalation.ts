import { stripAccents } from "./text";
import type { Priority, TicketCategory } from "./types";

export interface EscalationRule {
  id: string;
  test: RegExp;
  category: TicketCategory;
  priority: Priority;
  reason: string;
}

/**
 * RN-04: assuntos que sempre vão para uma pessoa, mesmo que a base tenha artigo relacionado.
 * Ordem importa: a primeira regra que casa vence, então as mais graves vêm antes.
 */
export const ESCALATION_RULES: EscalationRule[] = [
  {
    id: "juridico",
    test: /procon|processo|processar|advogad|justica|judicial|reclame\s*aqui|danos?\s+morais|denunci/,
    category: "OUTROS",
    priority: "URGENTE",
    reason: "Menção a ação jurídica ou reclamação pública",
  },
  {
    id: "perda_de_dados",
    test: /(sumiram|sumiu|desapareceram|desapareceu|perdi)\s+(\w+\s+){0,3}(agendamentos?|clientes?|dados|historico|cadastros?)|apagou\s+(\w+\s+){0,3}(agendamentos?|clientes?|dados)/,
    category: "TECNICO",
    priority: "URGENTE",
    reason: "Possível perda de dados do salão",
  },
  {
    id: "reembolso",
    test: /reembols|estorn|devolu[cç]ao|devolv\w+\s+(\w+\s+){0,2}(dinheiro|valor|pagamento)|quero\s+meu\s+dinheiro/,
    category: "COBRANCA",
    priority: "ALTA",
    reason: "Pedido de reembolso ou estorno: decisão do financeiro",
  },
  {
    id: "cobranca_indevida",
    test: /cobranca\s+(indevida|duplicada|errada|a\s+mais|dupla)|cobraram\s+(a\s+mais|duas\s+vezes|em\s+duplicidade|errado)|cobrado\s+(duas|2)\s+vezes|nao\s+reconheco\s+(essa\s+|a\s+)?cobranca|valor\s+(errado|diferente)\s+na\s+fatura/,
    category: "COBRANCA",
    priority: "ALTA",
    reason: "Contestação de cobrança: exige análise do financeiro",
  },
  {
    id: "exclusao_de_dados",
    test: /(excluir|apagar|deletar|remover|eliminar)\s+(\w+\s+){0,3}(minha\s+conta|conta\s+inteira|todos\s+os\s+(meus\s+)?dados|meus\s+dados)|\blgpd\b.*(direito|exclu|apag)|direito\s+ao\s+esquecimento/,
    category: "PRIVACIDADE",
    priority: "ALTA",
    reason: "Exclusão de conta ou dados: exige confirmação de identidade",
  },
  {
    id: "acesso_identidade",
    test: /(perdi|troquei|trocou|nao\s+tenho\s+mais)\s+(\w+\s+){0,3}(celular|aparelho|e-?mail|autenticador|codigos?)|transferir\s+(a\s+)?(conta|titularidade)|trocar\s+(o\s+)?dono|remover\s+(o\s+)?(2fa|dois\s+fatores|verificacao)/,
    category: "CONTA_ACESSO",
    priority: "ALTA",
    reason: "Recuperação de acesso exige confirmação de identidade por uma pessoa",
  },
  {
    id: "comercial",
    test: /desconto|promocao|cupom|negociar|condicao\s+especial|abater|baratear/,
    category: "COBRANCA",
    priority: "MEDIA",
    reason: "Pedido comercial: o agente não negocia valores",
  },
  {
    id: "pedido_humano",
    test: /(falar|conversar|passar|transferir|chamar)\s+(\w+\s+){0,4}(atendente|humano|pessoa|alguem|gerente|responsavel|suporte)|quero\s+um\s+atendente|atendimento\s+humano/,
    category: "SUPORTE",
    priority: "MEDIA",
    reason: "Cliente pediu para falar com uma pessoa",
  },
];

export function matchEscalation(input: string): EscalationRule | null {
  const t = stripAccents(input.toLowerCase());
  return ESCALATION_RULES.find((r) => r.test.test(t)) ?? null;
}

const KB_CATEGORY_MAP: Record<string, TicketCategory> = {
  "Primeiros passos": "PRIMEIROS_PASSOS",
  Agenda: "AGENDA",
  Cobrança: "COBRANCA",
  "Conta e acesso": "CONTA_ACESSO",
  Clientes: "CLIENTES",
  "Financeiro do salão": "FINANCEIRO_SALAO",
  Privacidade: "PRIVACIDADE",
  "Problema técnico": "TECNICO",
  Suporte: "SUPORTE",
};

export function categoryFromKb(kbCategory: string | undefined): TicketCategory {
  return (kbCategory && KB_CATEGORY_MAP[kbCategory]) || "OUTROS";
}

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  COBRANCA: "Cobrança",
  CONTA_ACESSO: "Conta e acesso",
  AGENDA: "Agenda",
  CLIENTES: "Clientes",
  FINANCEIRO_SALAO: "Financeiro do salão",
  PRIVACIDADE: "Privacidade",
  TECNICO: "Problema técnico",
  PRIMEIROS_PASSOS: "Primeiros passos",
  SUPORTE: "Suporte",
  OUTROS: "Outros",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  URGENTE: "Urgente",
};
