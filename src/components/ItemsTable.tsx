"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCategoryByKey } from "@/lib/categories";
import { EditIcon, TrashIcon } from "./Icons";
import LinkBadge from "./LinkBadge";

type Item = {
  id: string;
  title: string;
  category: string;
  mediaType: string | null;
  linkType: string;
  url: string;
  published: boolean;
  updatedAt: string | Date;
};

export default function ItemsTable({ items }: { items: Item[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus dokumen "${title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menghapus.");
      } else {
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  async function togglePublished(item: Item) {
    setBusyId(item.id);
    setError("");
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          category: item.category,
          mediaType: item.mediaType,
          linkType: item.linkType,
          url: item.url,
          published: !item.published,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal memperbarui status.");
      } else {
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      )}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Judul</th>
              <th className="text-left px-4 py-3 font-medium">Kategori</th>
              <th className="text-left px-4 py-3 font-medium">Sumber</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  Belum ada dokumen. Klik &quot;Tambah Dokumen&quot; untuk mulai menambahkan.
                </td>
              </tr>
            )}
            {items.map((item) => {
              const cat = getCategoryByKey(item.category);
              const busy = busyId === item.id;
              return (
                <tr key={item.id} className={busy ? "opacity-50" : ""}>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(item.updatedAt).toLocaleDateString("id-ID")}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {cat?.label}
                    {item.mediaType ? ` · ${item.mediaType === "GAMBAR" ? "Gambar" : "Video"}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <LinkBadge linkType={item.linkType} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      disabled={busy}
                      onClick={() => togglePublished(item)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        item.published
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.published ? "Terbit" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/items/${item.id}/edit`}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600"
                        title="Ubah"
                      >
                        <EditIcon className="w-4 h-4" />
                      </Link>
                      <button
                        disabled={busy}
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                        title="Hapus"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
