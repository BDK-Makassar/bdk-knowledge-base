import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

async function requireAuth() {
  const session = await verifySession();
  return !!session;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const item = await prisma.knowledgeItem.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const item = await prisma.knowledgeItem.update({
      where: { id: params.id },
      data: {
        title,
        description: description || null,
        category,
        mediaType: category === "MEDIA" ? mediaType || null : null,
        linkType,
        url,
        tags: tags || null,
        published: published ?? true,
      },
    });

    return NextResponse.json({ item });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal memperbarui data." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await prisma.knowledgeItem.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal menghapus data." },
      { status: 500 }
    );
  }
}
