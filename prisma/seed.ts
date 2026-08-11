import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  const items = [
    {
      title: "Panduan Penggunaan Aplikasi eOffice BDK Makassar",
      description:
        "Panduan langkah demi langkah penggunaan aplikasi eOffice untuk persuratan dan kepegawaian internal.",
      category: "PANDUAN" as const,
      linkType: "DRIVE" as const,
      url: "https://drive.google.com/drive/folders/contoh-panduan-eoffice",
      tags: "eoffice,panduan,persuratan",
    },
    {
      title: "SOP Pengajuan Cuti Pegawai",
      description: "Standar operasional prosedur pengajuan cuti bagi pegawai BDK Makassar.",
      category: "SOP" as const,
      linkType: "DRIVE" as const,
      url: "https://drive.google.com/file/d/contoh-sop-cuti/view",
      tags: "sop,cuti,kepegawaian",
    },
    {
      title: "Surat Tugas Narasumber Diklat Substantif",
      description: "Contoh surat tugas narasumber untuk kegiatan diklat substantif.",
      category: "SURAT_TUGAS" as const,
      linkType: "DRIVE" as const,
      url: "https://drive.google.com/file/d/contoh-surat-tugas/view",
      tags: "surat tugas,diklat",
    },
    {
      title: "Peraturan Menteri Agama tentang Pendidikan dan Pelatihan",
      description: "Regulasi terkait penyelenggaraan pendidikan dan pelatihan di lingkungan Kementerian Agama.",
      category: "PERATURAN" as const,
      linkType: "WEBSITE" as const,
      url: "https://peraturan.kemenag.go.id/",
      tags: "peraturan,kemenag,diklat",
    },
    {
      title: "Buletin Widyaiswara Edisi 2026",
      description: "Publikasi buletin berisi artikel dan kajian dari para widyaiswara BDK Makassar.",
      category: "PUBLIKASI" as const,
      linkType: "DRIVE" as const,
      url: "https://drive.google.com/file/d/contoh-buletin/view",
      tags: "publikasi,buletin,widyaiswara",
    },
    {
      title: "Dokumentasi Kegiatan Pembukaan Diklat",
      description: "Galeri foto kegiatan pembukaan diklat tahun 2026.",
      category: "MEDIA" as const,
      mediaType: "GAMBAR" as const,
      linkType: "DRIVE" as const,
      url: "https://drive.google.com/drive/folders/contoh-galeri-foto",
      tags: "media,dokumentasi,foto",
    },
    {
      title: "Video Profil BDK Makassar",
      description: "Video profil singkat mengenai Balai Diklat Keagamaan Makassar.",
      category: "MEDIA" as const,
      mediaType: "VIDEO" as const,
      linkType: "YOUTUBE" as const,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      tags: "media,video,profil",
    },
  ];

  for (const item of items) {
    const slug = slugify(item.title);
    await prisma.knowledgeItem.upsert({
      where: { slug },
      update: {},
      create: { ...item, slug },
    });
  }

  console.log(`Seeded ${items.length} contoh data.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
