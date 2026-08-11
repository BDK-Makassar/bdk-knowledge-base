import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { slugify } from "@/lib/categories";

async function requireAuth() {
  const session = await verifySession();
  return !!session;
}

export async function GET(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const items = await prisma.knowledgeItem.findMany({
    where: {
      ...(category ? { category: category as any } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { title, description, category, mediaType, linkType, url, tags, published } = body;

    if (!title || !category || !linkType || !url) {
      return NextResponse.json(
        { error: "Judul, kategori, jenis link, dan URL wajib diisi." },
        { status: 400 }
      );
    }

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.knowledgeItem.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const item = await prisma.knowledgeItem.create({
      data: {
        title,
        slug,
        description: description || null,
        category,
        mediaType: category === "MEDIA" ? mediaType || null : null,
        linkType,
        url,
        tags: tags || null,
        published: published ?? true,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal menyimpan data." },
      { status: 500 }
    );
  }
}
