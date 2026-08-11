import { Suspense } from "react";
import AdminLoginForm from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center mx-auto text-xl">
            📚
          </div>
          <h1 className="text-lg font-semibold text-gray-900 mt-3">Admin Knowledge Base</h1>
          <p className="text-sm text-gray-500">BDK Makassar</p>
        </div>

        <Suspense fallback={<p className="text-sm text-gray-400 text-center">Memuat...</p>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
