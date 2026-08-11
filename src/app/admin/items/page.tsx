import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import ItemsTable from "@/components/ItemsTable";
import SearchBar from "@/components/SearchBar";
import CategoryFilterForm from "@/components/CategoryFilterForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminItemsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const q = (searchParams.q || "").trim();
  const category = searchParams.category || "";

  const items = await prisma.knowledgeItem.findMany({
    where: {
      ...(category ? { category: category as any } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Kelola Dokumen</h1>
        <Link
          href="/admin/items/new"
          className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          + Tambah Dokumen
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-5 mb-5">
        <div className="flex-1">
          <SearchBar action="/admin/items" defaultValue={q} placeholder="Cari dokumen..." />
        </div>
        <CategoryFilterForm action="/admin/items" q={q} category={category} />
      </div>

      <ItemsTable items={items as any} />
    </AdminShell>
  );
}
