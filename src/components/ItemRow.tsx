import Link from "next/link";
import { getCategoryByKey } from "@/lib/categories";
import LinkBadge from "./LinkBadge";

type Item = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  mediaType: string | null;
  linkType: string;
  updatedAt: Date | string;
};

function formatDate(d: Date | string) {
  const date = new Date(d);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

export default function ItemRow({ item }: { item: Item }) {
  const cat = getCategoryByKey(item.category);
  return (
    <Link
      href={`/item/${item.id}`}
      className="flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg px-4 py-3.5 hover:border-brand-400 hover:shadow-sm transition"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            {cat?.label}
            {item.mediaType ? ` · ${item.mediaType === "GAMBAR" ? "Gambar" : "Video"}` : ""}
          </span>
          <LinkBadge linkType={item.linkType} />
        </div>
        <h3 className="font-medium text-gray-900 mt-1 truncate">{item.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">Diperbarui: {formatDate(item.updatedAt)}</p>
      </div>
      <span className="shrink-0 text-sm font-medium text-brand-600 border border-brand-200 rounded-full px-4 py-1.5 whitespace-nowrap">
        Lihat
      </span>
    </Link>
  );
}
