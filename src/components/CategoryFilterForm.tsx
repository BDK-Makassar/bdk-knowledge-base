"use client";

import { CATEGORIES } from "@/lib/categories";

export default function CategoryFilterForm({
  action,
  q,
  category,
}: {
  action: string;
  q: string;
  category: string;
}) {
  return (
    <form action={action} className="flex gap-2">
      {q && <input type="hidden" name="q" value={q} />}
      <select
        name="category"
        defaultValue={category}
        onChange={(e) => e.currentTarget.form?.submit()}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
      >
        <option value="">Semua Kategori</option>
        {CATEGORIES.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>
    </form>
  );
}
