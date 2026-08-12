import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import ItemRow from "@/components/ItemRow";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const q = (searchParams.q || "").trim();
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  const where = {
    published: true,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
            { tags: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total, counts] = await Promise.all([
    prisma.knowledgeItem.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.knowledgeItem.count({ where }),
    prisma.knowledgeItem.groupBy({
      by: ["category"],
      where: { published: true },
      _count: { _all: true },
    }),
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.category, c._count._all]));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand-700 to-brand-600 text-white">
          <div className="max-w-6xl mx-auto px-4 py-14 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold">Knowledge Base BDK Makassar</h1>
            <p className="mt-3 text-brand-100 max-w-2xl mx-auto">
              Pusat referensi panduan, SOP, surat tugas, peraturan, format laporan, dan media
              Balai Diklat Keagamaan Makassar.
            </p>
            <div className="mt-6 max-w-xl mx-auto">
              <SearchBar defaultValue={q} />
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 -mt-8 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((c) => (
              <CategoryCard
                key={c.key}
                slug={c.slug}
                label={c.label}
                description={c.description}
                icon={c.icon}
                count={countMap[c.key] || 0}
              />
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {q ? `Hasil pencarian untuk "${q}"` : "Dokumen Terbaru"}
            </h2>
            <span className="text-sm text-gray-500">{total} dokumen</span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-white border border-dashed border-gray-300 rounded-xl">
              Belum ada dokumen{q ? " yang cocok dengan pencarian." : "."}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/?${q ? `q=${encodeURIComponent(q)}&` : ""}page=${p}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium ${
                    p === page
                      ? "bg-brand-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-brand-400"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
