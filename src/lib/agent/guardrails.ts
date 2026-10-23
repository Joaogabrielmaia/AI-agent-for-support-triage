import { stripAccents } from "./text";
import type { Source } from "./types";

/** Marker placed in the system prompt. If it ever shows up in an answer, the prompt leaked. */
export const PROMPT_CANARY = "PRUMO-CANARY-7731";

// ---------------------------------------------------------------------------
// RN-06: mascaramento de dados pessoais antes de armazenar ou enviar ao modelo
// ---------------------------------------------------------------------------

function luhn(digits: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export interface MaskResult {
  text: string;
  found: string[];
}

export function maskPii(input: string): MaskResult {
  const found: string[] = [];
  let text = input;
  const swap = (re: RegExp, label: string, tag: string, accept?: (m: string) => boolean) => {
    text = text.replace(re, (m) => {
      if (accept && !accept(m)) return m;
      found.push(label);
      return tag;
    });
  };
  swap(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "e-mail", "[E-MAIL]");
  swap(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, "cnpj", "[CNPJ]");
  swap(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "cpf", "[CPF]");
  swap(/\b(?:\d[ -]?){13,19}\b/g, "cartao", "[CARTAO]", (m) => luhn(m.replace(/\D/g, "")));
  swap(/(?:\+?55\s?)?\(?\b\d{2}\)?\s?9?\d{4}[-\s]?\d{4}\b/g, "telefone", "[TELEFONE]");
  return { text, found: [...new Set(found)] };
}

// ---------------------------------------------------------------------------
// RN-07: prompt injection e pedidos de dados de terceiros
// ---------------------------------------------------------------------------

const INJECTION_PATTERNS: RegExp[] = [
  /ignor\w*\s+(\w+\s+){0,3}(instrucoes|regras|ordens|orientacoes|diretrizes)/,
  /(esqueca|desconsidere|desconsiderar|descarte)\s+(\w+\s+){0,4}(instrucoes|regras|ordens|diretrizes)/,
  /(revele|mostre|exiba|repita|imprima|vaze|copie)\s+(\w+\s+){0,5}(prompt|instrucoes)/,
  /system\s*prompt|prompt\s+d[eo]\s+sistema|prompt\s+inicial|instrucoes\s+(internas|do sistema|iniciais)/,
  /(a partir de agora|de agora em diante)\s+(\w+\s+){0,3}(voce|aja|responda|seja)/,
  /voce\s+(agora\s+)?(e|sera|vai ser)\s+(um|uma)?\s*(dan|desenvolvedor|administrador|admin|hacker|assistente sem)/,
  /modo\s+(desenvolvedor|deus|admin|administrador|sem\s+restricoes|debug)/,
  /jailbreak|\bdan\b.*sem\s+(regras|restricoes)/,
  /(finja|simule|faca de conta)\s+(que|ser)/,
  /sem\s+(nenhuma\s+)?(restricao|restricoes|filtro|filtros|regras)/,
  /<\/?\s*(system|instructions?|sistema)\s*>/,
  /novas?\s+instrucoes/,
  /\[\s*(system|sistema|admin)\s*\]/,
];

const THIRD_PARTY_SUBJECT = /outr[oa]s?\s+(cliente|clientes|salao|saloes|clinica|clinicas|conta|contas|usuario|usuarios|estabelecimento|empresa)/;
const THIRD_PARTY_DATA =
  /(dados|telefone|celular|cpf|e-?mail|endereco|historico|agenda|fatura|faturamento|senha|cadastro|lista|numero|cartao)/;
const THIRD_PARTY_BY_NAME =
  /(passe|passa|informe|informar|diga|mostre|envie|me de|quero ver|preciso d[eo]|qual (e|eh) o)\s+(\w+\s+){0,4}(telefone|cpf|e-?mail|endereco|senha|cartao|dados)\s+d[aeo]\s+(cliente|salao|clinica|dona|dono)\s+\w+/;

export function detectInjection(input: string): string | null {
  const t = stripAccents(input.toLowerCase());
  for (const re of INJECTION_PATTERNS) if (re.test(t)) return "prompt_injection";
  return null;
}

export function detectThirdPartyData(input: string): string | null {
  const t = stripAccents(input.toLowerCase());
  if (THIRD_PARTY_SUBJECT.test(t) && THIRD_PARTY_DATA.test(t)) return "dados_de_terceiros";
  if (THIRD_PARTY_BY_NAME.test(t)) return "dados_de_terceiros";
  return null;
}

// ---------------------------------------------------------------------------
// RN-08/RN-09: filtro de saída (não inventar preço, não prometer prazo nem reembolso)
// ---------------------------------------------------------------------------

const PROMISE_PATTERNS: RegExp[] = [
  /(sera|serao|esta|estao|vai ser|vao ser)\s+(reembolsad|estornad|devolvid|ressarcid)/,
  /(vamos|iremos|irei|vou|podemos|posso)\s+(lhe\s+)?(reembolsar|devolver|estornar|ressarcir)/,
  /(garanto|garantimos|prometo|prometemos|asseguro)/,
  /seu\s+(reembolso|estorno)\s+(sera|esta|foi)/,
  /(resolvemos|resolveremos|retorno|responderemos)\s+(\w+\s+){0,3}(hoje|amanha|em ate)/,
];

const PRICE_RE = /R\$\s?\d+(?:[.,]\d+)?/g;

function digits(s: string): string {
  return s.replace(/\D/g, "");
}

export interface OutputCheck {
  ok: boolean;
  violation?: string;
}

export function checkOutput(answer: string, sources: Pick<Source, "snippet">[]): OutputCheck {
  if (answer.includes(PROMPT_CANARY)) return { ok: false, violation: "vazamento_de_prompt" };
  const corpus = stripAccents(sources.map((s) => s.snippet).join(" ").toLowerCase());
  const t = stripAccents(answer.toLowerCase());
  for (const re of PROMISE_PATTERNS) {
    const m = t.match(re);
    if (m && !corpus.includes(m[0])) return { ok: false, violation: "promessa_nao_fundamentada" };
  }
  const prices = answer.match(PRICE_RE) ?? [];
  const sourceDigitsList = (sources.map((s) => s.snippet).join(" ").match(PRICE_RE) ?? []).map(digits);
  for (const p of prices) {
    if (!sourceDigitsList.includes(digits(p))) return { ok: false, violation: "preco_nao_fundamentado" };
  }
  return { ok: true };
}
