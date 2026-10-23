import type { Message } from "@prisma/client";
import { Pill } from "@/components/ui";

interface SrcView {
  articleSlug: string;
  title: string;
  heading: string;
}

const KIND_LABEL = { ANSWER: "Resposta", REFUSAL: "Sem informação", ESCALATION: "Encaminhamento", BLOCKED: "Bloqueado" } as const;

/** Conversation as the attendant sees it: sources, confidence, masked data and the correct/incorrect rating (RF-09). */
export function Transcript({ messages, returnPath, rateAction }: { messages: Message[]; returnPath: string; rateAction: (formData: FormData) => Promise<void> }) {
  return (
    <div className="card space-y-3" data-testid="transcript">
      <h2 className="text-lg font-semibold">Conversa</h2>
      {messages.map((m) => {
        const sources = (m.sources as SrcView[] | null) ?? [];
        return (
          <div
            key={m.id}
            className={`rounded-lg border p-3 text-sm ${m.role === "CUSTOMER" ? "border-slate-200 bg-slate-50" : m.role === "HUMAN" ? "border-emerald-300 bg-emerald-50" : "border-blue-200 bg-blue-50"}`}
          >
            <p className="mb-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
              {m.role === "CUSTOMER" ? "Cliente" : m.role === "HUMAN" ? "Equipe" : "Agente (IA)"}
              {m.kind && <Pill>{KIND_LABEL[m.kind]}</Pill>}
              {m.confidence != null && <span className="font-normal">confiança {m.confidence.toFixed(2)}</span>}
              {m.guardrail && <Pill tone="red">{m.guardrail}</Pill>}
              {m.piiFound.length > 0 && <Pill tone="red">dados mascarados: {m.piiFound.join(", ")}</Pill>}
            </p>
            <p className="whitespace-pre-wrap">{m.content}</p>
            {sources.length > 0 && (
              <p className="mt-2 text-xs text-slate-700">Fontes: {sources.map((s, i) => `[${i + 1}] ${s.title}`).join(" · ")}</p>
            )}
            {m.role === "AGENT_AI" && m.kind === "ANSWER" && (
              <div className="mt-2 flex flex-wrap items-center gap-2" data-testid="rating">
                <span className="text-xs font-medium">A resposta do agente estava correta?</span>
                {(["CORRECT", "INCORRECT"] as const).map((r) => (
                  <form key={r} action={rateAction}>
                    <input type="hidden" name="messageId" value={m.id} />
                    <input type="hidden" name="path" value={returnPath} />
                    <input type="hidden" name="rating" value={r} />
                    <button
                      type="submit"
                      aria-pressed={m.rating === r}
                      className={`btn ${m.rating === r ? (r === "CORRECT" ? "bg-emerald-600 text-white" : "bg-red-600 text-white") : "btn-ghost"}`}
                    >
                      {r === "CORRECT" ? "Correta" : "Incorreta"}
                    </button>
                  </form>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
