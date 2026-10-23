import { redirect } from "next/navigation";
import { z } from "zod";
import { startSession, currentUser } from "@/lib/server/auth";
import { verifyPassword } from "@/lib/server/crypto";
import { db } from "@/lib/server/db";

export const metadata = { title: "Entrar · Equipe Agenda Bela" };

async function login(formData: FormData) {
  "use server";
  const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/login?erro=1");
  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  // Mesma resposta para e-mail inexistente e senha errada, para não revelar quais e-mails existem.
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) redirect("/login?erro=1");
  await startSession(user.id);
  redirect("/tickets");
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  if (await currentUser()) redirect("/tickets");
  const { erro } = await searchParams;
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-5 px-5">
      <div>
        <h1 className="text-2xl font-bold text-prumo-900">Entrar</h1>
        <p className="text-sm text-slate-700">Área da equipe de suporte da Agenda Bela.</p>
      </div>
      <form action={login} className="card space-y-4">
        {erro && (
          <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
            E-mail ou senha incorretos.
          </p>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            E-mail
          </label>
          <input id="email" name="email" type="email" required autoComplete="username" className="input" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Senha
          </label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Entrar
        </button>
      </form>
      <p className="text-xs text-slate-600">Contas de demonstração estão no README (dados fictícios, ambiente local).</p>
    </main>
  );
}
