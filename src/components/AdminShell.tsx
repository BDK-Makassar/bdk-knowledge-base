"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoutIcon, PlusIcon } from "./Icons";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/items", label: "Kelola Dokumen" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-60 bg-brand-800 text-white flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="font-semibold leading-tight">Knowledge Base</p>
          <p className="text-xs text-brand-200">Admin BDK Makassar</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                pathname === item.href
                  ? "bg-white/15 text-white"
                  : "text-brand-100 hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin/items/new"
            className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-brand-500 hover:bg-brand-400"
          >
            <PlusIcon className="w-4 h-4" /> Tambah Dokumen
          </Link>
        </nav>
        <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-1">
          <Link href="/" className="px-3 py-2 rounded-lg text-sm text-brand-100 hover:bg-white/10">
            Lihat Situs Publik
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-100 hover:bg-white/10 text-left"
          >
            <LogoutIcon className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
