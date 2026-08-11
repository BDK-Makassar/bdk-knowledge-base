import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCategoryBySlug } from "@/lib/categories";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ItemRow from "@/components/ItemRow";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 15;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { q?: string; page?: string };
}) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const q = (searchParams.q || "").trim();
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  const where = {
    published: true,
    category: category.key,
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

  const [items, total] = await Promise.all([
    prisma.knowledgeItem.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.knowledgeItem.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-brand-700 text-white">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <Link href="/" className="text-brand-100 text-sm hover:underline">
              &larr; Kembali ke Beranda
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold mt-2">{category.label}</h1>
            <p className="text-brand-100 mt-1">{category.description}</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="max-w-xl mb-6">
            <SearchBar action={`/kategori/${category.slug}`} defaultValue={q} />
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-500">{total} dokumen</h2>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-white border border-dashed border-gray-300 rounded-xl">
              Belum ada dokumen pada kategori ini.
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
                  href={`/kategori/${category.slug}?${q ? `q=${encodeURIComponent(q)}&` : ""}page=${p}`}
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
