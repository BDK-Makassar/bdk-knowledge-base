"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, detectLinkType } from "@/lib/categories";

type InitialData = {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  mediaType?: string | null;
  linkType?: string;
  url?: string;
  tags?: string;
  published?: boolean;
};

export default function ItemForm({ initial }: { initial?: InitialData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [category, setCategory] = useState(initial?.category || "PANDUAN");
  const [mediaType, setMediaType] = useState(initial?.mediaType || "GAMBAR");
  const [linkType, setLinkType] = useState(initial?.linkType || "WEBSITE");
  const [url, setUrl] = useState(initial?.url || "");
  const [tags, setTags] = useState(initial?.tags || "");
  const [published, setPublished] = useState(initial?.published ?? true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleUrlChange(value: string) {
    setUrl(value);
    if (value) setLinkType(detectLinkType(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title,
      description,
      category,
      mediaType: category === "MEDIA" ? mediaType : null,
      linkType,
      url,
      tags,
      published,
    };

    try {
      const res = await fetch(isEdit ? `/api/items/${initial!.id}` : "/api/items", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan data.");
        setLoading(false);
        return;
      }
      router.push("/admin/items");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Contoh: Panduan Penggunaan Aplikasi eOffice"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Ringkasan singkat mengenai dokumen ini"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {category === "MEDIA" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Media *</label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="GAMBAR">Gambar</option>
              <option value="VIDEO">Video</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Link (Google Drive / Website / YouTube) *
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          required
          placeholder="https://drive.google.com/... atau https://youtube.com/..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          Cukup tempel link, jenis sumber (Drive/YouTube/Website) terdeteksi otomatis. Tidak perlu
          unggah file.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Link</label>
        <select
          value={linkType}
          onChange={(e) => setLinkType(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        >
          <option value="DRIVE">Google Drive</option>
          <option value="YOUTUBE">YouTube</option>
          <option value="WEBSITE">Website</option>
          <option value="LAINNYA">Lainnya</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tag (pisahkan dengan koma)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="eoffice, panduan, persuratan"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        Tampilkan di situs publik (terbit)
      </label>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg"
        >
          {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Dokumen"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-medium px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
