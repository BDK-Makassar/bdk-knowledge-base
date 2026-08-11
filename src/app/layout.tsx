import type { Metadata } from "next";
import "./globals.css";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Knowledge Base BDK Makassar";

export const metadata: Metadata = {
  title: siteName,
  description:
    "Pusat pengetahuan Balai Diklat Keagamaan Makassar: panduan, SOP, surat tugas, peraturan, publikasi, dan media.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
