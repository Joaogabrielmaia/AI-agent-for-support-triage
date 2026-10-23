import Link from "next/link";
import { redirect } from "next/navigation";
import { endSession, requireUser } from "@/lib/server/auth";

async function logout() {
  "use server";
  await endSession();
  redirect("/login");
}

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const links = [
    { href: "/tickets", label: "Fila", admin: false },
    { href: "/conversas", label: "Conversas", admin: false },
    { href: "/lacunas", label: "Lacunas", admin: false },
    { href: "/painel", label: "Painel", admin: true },
    { href: "/sugestoes", label: "Sugestões", admin: true },
    { href: "/base", label: "Base", admin: true },
    { href: "/avaliacao", label: "Avaliação", admin: true },
  ].filter((l) => !l.admin || user.role === "ADMIN");

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-lg font-bold text-prumo-900">Prumo</span>
            <nav aria-label="Principal" className="flex flex-wrap gap-x-4 gap-y-1">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-800 hover:text-prumo-600">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <form action={logout} className="flex items-center gap-3">
            <span className="text-xs text-slate-700">
              {user.name} · {user.role === "ADMIN" ? "Admin" : "Atendente"}
            </span>
            <button className="btn btn-ghost" type="submit">
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
