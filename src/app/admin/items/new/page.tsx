import AdminShell from "@/components/AdminShell";
import ItemForm from "@/components/ItemForm";

export default function NewItemPage() {
  return (
    <AdminShell>
      <h1 className="text-xl font-semibold text-gray-900">Tambah Dokumen</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Tempelkan link Google Drive, website, atau YouTube &mdash; tidak perlu unggah file.
      </p>
      <ItemForm />
    </AdminShell>
  );
}
