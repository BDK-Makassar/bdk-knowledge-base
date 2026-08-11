import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCategoryByKey, getYouTubeEmbedUrl, getGoogleDrivePreviewUrl } from "@/lib/categories";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LinkBadge from "@/components/LinkBadge";
import { ExternalLinkIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const item = await prisma.knowledgeItem.findUnique({ where: { id: params.id } });
  if (!item || !item.published) notFound();

  const category = getCategoryByKey(item.category);
  const youtubeEmbed = item.linkType === "YOUTUBE" ? getYouTubeEmbedUrl(item.url) : null;
  const driveEmbed = item.linkType === "DRIVE" ? getGoogleDrivePreviewUrl(item.url) : null;

  const tags = item.tags
    ? item.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <Link
            href={category ? `/kategori/${category.slug}` : "/"}
            className="text-brand-600 text-sm hover:underline"
          >
            &larr; Kembali ke {category?.label || "Beranda"}
          </Link>

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              {category?.label}
              {item.mediaType ? ` · ${item.mediaType === "GAMBAR" ? "Gambar" : "Video"}` : ""}
            </span>
            <LinkBadge linkType={item.linkType} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">{item.title}</h1>

          {item.description && (
            <p className="text-gray-600 mt-3 leading-relaxed">{item.description}</p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg"
            >
              Buka Link Sumber <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </div>

          {youtubeEmbed && (
            <div className="mt-8 aspect-video rounded-xl overflow-hidden border border-gray-200 bg-black">
              <iframe
                src={youtubeEmbed}
                title={item.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {driveEmbed && (
            <div className="mt-8 aspect-video rounded-xl overflow-hidden border border-gray-200">
              <iframe src={driveEmbed} title={item.title} className="w-full h-full" allow="autoplay" />
            </div>
          )}

          {!youtubeEmbed && !driveEmbed && item.mediaType === "GAMBAR" && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.url}
              alt={item.title}
              className="mt-8 rounded-xl border border-gray-200 max-h-[520px] object-contain w-full bg-gray-50"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
