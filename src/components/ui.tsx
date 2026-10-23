import type { Priority } from "@/lib/agent/types";

const PRIORITY_STYLE: Record<Priority, string> = {
  URGENTE: "bg-red-100 text-red-900 border-red-300",
  ALTA: "bg-orange-100 text-orange-900 border-orange-300",
  MEDIA: "bg-amber-50 text-amber-900 border-amber-300",
  BAIXA: "bg-slate-100 text-slate-800 border-slate-300",
};

export function PriorityBadge({ priority, label }: { priority: Priority; label: string }) {
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLE[priority]}`}>{label}</span>;
}

export function Pill({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "blue" | "green" | "red" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-800 border-slate-300",
    blue: "bg-blue-50 text-blue-900 border-blue-300",
    green: "bg-emerald-50 text-emerald-900 border-emerald-300",
    red: "bg-red-50 text-red-900 border-red-300",
  };
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function Stat({ label, value, hint, testId }: { label: string; value: string; hint?: string; testId?: string }) {
  return (
    <div className="card" data-testid={testId}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-600">{label}</p>
      <p className="mt-1 text-3xl font-bold text-prumo-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-600">{hint}</p>}
    </div>
  );
}

export const pct = (x: number) => `${(x * 100).toFixed(0)}%`;

export const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(d);
