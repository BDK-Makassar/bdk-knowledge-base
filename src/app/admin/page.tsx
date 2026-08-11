import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";
import AdminShell from "@/components/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [total, published, counts, recent] = await Promise.all([
    prisma.knowledgeItem.count(),
    prisma.knowledgeItem.count({ where: { published: true } }),
    prisma.knowledgeItem.groupBy({ by: ["category"], _count: { _all: true } }),
    prisma.knowledgeItem.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.category, c._count._all]));

  return (
    <AdminShell>
      <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      <p className="text-sm text-gray-500 mt-1">Ringkasan data knowledge base.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-sm text-gray-500">Total Dokumen</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-gray-900">{published}</p>
          <p className="text-sm text-gray-500">Dipublikasikan</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-gray-900">{total - published}</p>
          <p className="text-sm text-gray-500">Draft / Disembunyikan</p>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-gray-700 mt-8 mb-3">Dokumen per Kategori</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CATEGORIES.map((c) => (
          <div
            key={c.key}
            className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between"
          >
            <span className="text-sm text-gray-700">{c.label}</span>
            <span className="text-sm font-semibold text-brand-600">{countMap[c.key] || 0}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8 mb-3">
        <h2 className="text-sm font-semibold text-gray-700">Terakhir Diperbarui</h2>
        <Link href="/admin/items" className="text-sm text-brand-600 hover:underline">
          Lihat semua &rarr;
        </Link>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        {recent.length === 0 && (
          <p className="px-4 py-6 text-sm text-gray-500">Belum ada dokumen.</p>
        )}
        {recent.map((item) => (
          <Link
            key={item.id}
            href={`/admin/items/${item.id}/edit`}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
          >
            <span className="text-sm text-gray-800 truncate">{item.title}</span>
            <span className="text-xs text-gray-400">
              {new Date(item.updatedAt).toLocaleDateString("id-ID")}
            </span>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
