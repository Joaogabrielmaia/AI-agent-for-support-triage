import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-5 py-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-prumo-600">Estudo de caso · Agenda Bela (empresa fictícia)</p>
        <h1 className="mt-2 text-4xl font-bold text-prumo-900">Prumo</h1>
        <p className="mt-3 text-lg text-slate-700">
          Agente de IA que faz a triagem do suporte: responde com fontes, admite quando não sabe e encaminha para uma pessoa com o contexto organizado.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/chat" className="card block hover:border-prumo-500">
          <h2 className="text-lg font-semibold">Sou cliente</h2>
          <p className="mt-1 text-sm text-slate-700">Abrir o chat de suporte da Agenda Bela.</p>
        </Link>
        <Link href="/login" className="card block hover:border-prumo-500">
          <h2 className="text-lg font-semibold">Sou da equipe</h2>
          <p className="mt-1 text-sm text-slate-700">Fila de chamados, painel e lacunas da base.</p>
        </Link>
      </div>
      <p className="text-xs text-slate-600">Tudo aqui é fictício e roda localmente. Nenhum dado, cliente ou empresa é real.</p>
    </main>
  );
}
