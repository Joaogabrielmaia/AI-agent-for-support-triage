"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SourceView {
  articleSlug: string;
  title: string;
  heading: string;
  snippet: string;
}

interface Msg {
  id: string;
  role: "CUSTOMER" | "AGENT_AI" | "HUMAN";
  text: string;
  kind?: "ANSWER" | "REFUSAL" | "ESCALATION" | "BLOCKED" | null;
  sources?: SourceView[];
}

const SUGGESTIONS = [
  "Quanto custa o plano Profissional?",
  "Como faço para cancelar minha assinatura?",
  "Vocês têm integração com WhatsApp?",
  "Cobraram duas vezes a minha mensalidade.",
];

const KIND_LABEL: Record<string, string> = {
  ANSWER: "Resposta com fontes",
  REFUSAL: "Sem informação na base",
  ESCALATION: "Encaminhado para a equipe",
  BLOCKED: "Pedido não atendido",
};

export default function Chat() {
  const [name, setName] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [escalated, setEscalated] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, sending]);

  // Mostra respostas de uma pessoa da equipe depois do encaminhamento.
  useEffect(() => {
    if (!conversationId || !escalated) return;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat/${conversationId}`);
        if (!res.ok) return;
        const data = (await res.json()) as { messages: { id: string; role: Msg["role"]; content: string; kind: Msg["kind"]; sources: SourceView[] | null }[] };
        setMessages(data.messages.map((m) => ({ id: m.id, role: m.role, text: m.content, kind: m.kind, sources: m.sources ?? undefined })));
      } catch {
        /* a próxima tentativa tenta de novo */
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [conversationId, escalated]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || sending) return;
    setError(null);
    setSending(true);
    setMessages((m) => [...m, { id: `tmp-${Date.now()}`, role: "CUSTOMER", text: message }]);
    setInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId: conversationId ?? undefined, customerName: name || undefined, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro inesperado");
      setConversationId(data.conversationId);
      if (data.result.kind === "ESCALATION") setEscalated(true);
      setMessages((m) => [
        ...m,
        { id: data.messageId, role: "AGENT_AI", text: data.result.text, kind: data.result.kind, sources: data.result.sources },
      ]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  async function askHuman() {
    if (!conversationId) return;
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/chat/escalate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro inesperado");
      setEscalated(true);
      const data = (await (await fetch(`/api/chat/${conversationId}`)).json()) as { messages: { id: string; role: Msg["role"]; content: string; kind: Msg["kind"]; sources: SourceView[] | null }[] };
      setMessages(data.messages.map((m) => ({ id: m.id, role: m.role, text: m.content, kind: m.kind, sources: m.sources ?? undefined })));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  const last = messages[messages.length - 1];
  const canAskHuman = !escalated && last?.role === "AGENT_AI" && last.kind === "REFUSAL";

  return (
    <main className="mx-auto flex h-[100dvh] max-w-2xl flex-col px-3 py-3 sm:px-4">
      <header className="flex items-center justify-between gap-3 pb-3">
        <div>
          <h1 className="text-lg font-bold text-prumo-900">Suporte Agenda Bela</h1>
          <p className="text-xs text-slate-700">Assistente automático. Não confirmo valores, reembolsos nem prazos fora da base.</p>
        </div>
        <Link href="/" className="text-sm font-medium text-prumo-600 underline">
          Início
        </Link>
      </header>

      <div className="card flex-1 space-y-3 overflow-y-auto" role="log" aria-live="polite" aria-label="Conversa com o assistente" data-testid="chat-log">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-800">Olá! Sou o assistente de suporte da Agenda Bela. Pergunte sobre planos, agenda, cobrança ou conta. Se eu não souber, eu aviso.</p>
            <label className="block text-xs font-medium text-slate-800" htmlFor="name">
              Seu nome (opcional)
            </label>
            <input id="name" className="input max-w-xs" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Como devo te chamar?" />
            <div className="flex flex-wrap gap-2" aria-label="Sugestões de perguntas">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="btn btn-ghost text-left" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={m.role === "CUSTOMER" ? "flex justify-end" : "flex justify-start"}>
            <div
              data-testid={`msg-${m.role}`}
              data-kind={m.kind ?? ""}
              className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm ${
                m.role === "CUSTOMER"
                  ? "bg-prumo-600 text-white"
                  : m.role === "HUMAN"
                    ? "border border-emerald-300 bg-emerald-50 text-slate-900"
                    : m.kind === "BLOCKED"
                      ? "border border-amber-300 bg-amber-50 text-slate-900"
                      : "border border-slate-200 bg-slate-50 text-slate-900"
              }`}
            >
              {m.role === "HUMAN" && <p className="mb-1 text-xs font-semibold text-emerald-800">Equipe Agenda Bela</p>}
              {m.role === "AGENT_AI" && m.kind && <p className="mb-1 text-xs font-semibold text-slate-700">{KIND_LABEL[m.kind]}</p>}
              <p className="whitespace-pre-wrap">{m.text}</p>
              {m.sources && m.sources.length > 0 && m.kind === "ANSWER" && (
                <div className="mt-2 border-t border-slate-200 pt-2" data-testid="sources">
                  <p className="text-xs font-semibold text-slate-700">Fontes</p>
                  <ol className="mt-1 space-y-1">
                    {m.sources.map((s, i) => (
                      <li key={s.articleSlug}>
                        <details>
                          <summary className="cursor-pointer text-xs text-prumo-700 underline">
                            [{i + 1}] {s.title}
                            {s.heading ? ` · ${s.heading}` : ""}
                          </summary>
                          <p className="mt-1 rounded bg-white p-2 text-xs text-slate-700">{s.snippet}</p>
                        </details>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        ))}

        {sending && <p className="text-sm text-slate-600">Consultando a base de conhecimento…</p>}
        {canAskHuman && (
          <button type="button" className="btn btn-ghost" onClick={askHuman} disabled={sending}>
            Falar com uma pessoa da equipe
          </button>
        )}
        {escalated && <p className="text-xs text-slate-700" data-testid="escalated-note">Seu pedido está na fila da equipe. Esta página mostra a resposta assim que ela chegar.</p>}
        <div ref={endRef} />
      </div>

      {error && (
        <p role="alert" className="mt-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
          {error}
        </p>
      )}

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <label htmlFor="msg" className="sr-only">
          Sua mensagem
        </label>
        <input id="msg" className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Digite sua dúvida…" maxLength={1000} autoComplete="off" />
        <button type="submit" className="btn btn-primary" disabled={sending || !input.trim()}>
          Enviar
        </button>
      </form>
    </main>
  );
}
