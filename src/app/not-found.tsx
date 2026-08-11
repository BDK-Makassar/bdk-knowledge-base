import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center py-24 px-4">
          <p className="text-5xl font-bold text-brand-600">404</p>
          <h1 className="text-xl font-semibold text-gray-900 mt-3">Halaman tidak ditemukan</h1>
          <p className="text-gray-500 mt-1">Dokumen atau halaman yang Anda cari tidak tersedia.</p>
          <Link
            href="/"
            className="inline-block mt-6 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
