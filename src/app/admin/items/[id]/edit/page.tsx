import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import ItemForm from "@/components/ItemForm";

export const dynamic = "force-dynamic";

export default async function EditItemPage({ params }: { params: { id: string } }) {
  const item = await prisma.knowledgeItem.findUnique({ where: { id: params.id } });
  if (!item) notFound();

  return (
    <AdminShell>
      <h1 className="text-xl font-semibold text-gray-900">Ubah Dokumen</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">{item.title}</p>
      <ItemForm
        initial={{
          id: item.id,
          title: item.title,
          description: item.description || "",
          category: item.category,
          mediaType: item.mediaType,
          linkType: item.linkType,
          url: item.url,
          tags: item.tags || "",
          published: item.published,
        }}
      />
    </AdminShell>
  );
}
