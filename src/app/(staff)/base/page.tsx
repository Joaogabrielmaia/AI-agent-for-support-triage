import { requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";

export const metadata = { title: "Base de conhecimento · Prumo" };
export const dynamic = "force-dynamic";

export default async function KnowledgeBasePage() {
  await requireUser(["ADMIN"]);
  const articles = await db.article.findMany({ include: { _count: { select: { chunks: true } } }, orderBy: { title: "asc" } });
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-prumo-900">Base de conhecimento</h1>
        <p className="text-sm text-slate-700">
          {articles.length} artigos em Markdown (pasta <code>kb/</code>), divididos em {articles.reduce((t, a) => t + a._count.chunks, 0)} trechos com vetor no pgvector.
        </p>
      </div>
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm" data-testid="kb-table">
          <caption className="sr-only">Artigos da base</caption>
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-700">
            <tr>
              <th scope="col" className="px-4 py-2">Artigo</th>
              <th scope="col" className="px-4 py-2">Categoria</th>
              <th scope="col" className="px-4 py-2">Trechos</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.slug} className="border-b border-slate-100">
                <td className="px-4 py-2">{a.title}</td>
                <td className="px-4 py-2">{a.category}</td>
                <td className="px-4 py-2">{a._count.chunks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
