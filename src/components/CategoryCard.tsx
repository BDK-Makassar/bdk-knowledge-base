import Link from "next/link";
import { CATEGORY_ICONS } from "./Icons";

export default function CategoryCard({
  slug,
  label,
  description,
  icon,
  count,
}: {
  slug: string;
  label: string;
  description: string;
  icon: string;
  count: number;
}) {
  const Icon = CATEGORY_ICONS[icon];
  return (
    <Link
      href={`/kategori/${slug}`}
      className="group bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:border-brand-400 hover:shadow-md transition"
    >
      <div className="w-11 h-11 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition">
        {Icon ? <Icon className="w-6 h-6" /> : null}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{description}</p>
      </div>
      <span className="mt-auto text-xs font-medium text-brand-600">{count} dokumen</span>
    </Link>
  );
}
