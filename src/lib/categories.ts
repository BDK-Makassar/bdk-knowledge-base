export type CategoryKey =
  | "PANDUAN"
  | "SOP"
  | "SURAT_TUGAS"
  | "PERATURAN"
  | "PUBLIKASI"
  | "MEDIA";

export const CATEGORIES: {
  key: CategoryKey;
  label: string;
  slug: string;
  description: string;
  icon: string;
}[] = [
  {
    key: "PANDUAN",
    label: "Panduan",
    slug: "panduan",
    description: "Buku petunjuk dan panduan penggunaan aplikasi/layanan",
    icon: "book",
  },
  {
    key: "SOP",
    label: "SOP",
    slug: "sop",
    description: "Standar Operasional Prosedur",
    icon: "clipboard",
  },
  {
    key: "SURAT_TUGAS",
    label: "Surat Tugas",
    slug: "surat-tugas",
    description: "Contoh dan arsip surat tugas",
    icon: "document",
  },
  {
    key: "PERATURAN",
    label: "Peraturan",
    slug: "peraturan",
    description: "Peraturan, keputusan, dan regulasi terkait",
    icon: "scale",
  },
  {
    key: "PUBLIKASI",
    label: "Publikasi",
    slug: "publikasi",
    description: "Buletin, artikel, dan publikasi resmi",
    icon: "newspaper",
  },
  {
    key: "MEDIA",
    label: "Media",
    slug: "media",
    description: "Gambar dan video dokumentasi",
    icon: "photo",
  },
];

export function getCategoryByKey(key: string) {
  return CATEGORIES.find((c) => c.key === key);
}

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const LINK_TYPE_LABELS: Record<string, string> = {
  DRIVE: "Google Drive",
  YOUTUBE: "YouTube",
  WEBSITE: "Website",
  LAINNYA: "Lainnya",
};

export function detectLinkType(url: string): "DRIVE" | "YOUTUBE" | "WEBSITE" | "LAINNYA" {
  try {
    const host = new URL(url).hostname;
    if (host.includes("drive.google.com") || host.includes("docs.google.com")) return "DRIVE";
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "YOUTUBE";
    if (host) return "WEBSITE";
    return "LAINNYA";
  } catch {
    return "LAINNYA";
  }
}

export function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1);
    } else if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/embed/")[1];
      else if (u.pathname.startsWith("/shorts/")) id = u.pathname.split("/shorts/")[1];
    }
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export function getGoogleDrivePreviewUrl(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return null;
}

export function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80) || "item"
  );
}
