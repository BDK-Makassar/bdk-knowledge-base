# Knowledge Base BDK Makassar

Aplikasi Knowledge Base internal untuk Balai Diklat Keagamaan (BDK) Makassar, terinspirasi dari
struktur Helpdesk BKN. Berisi 6 kategori dokumen: **Panduan, SOP, Surat Tugas, Peraturan,
Publikasi, dan Media (Gambar & Video)**.

Admin **tidak perlu mengunggah file** — cukup tempel link (Google Drive, website, atau YouTube),
dan aplikasi akan otomatis mendeteksi jenis sumbernya serta menampilkan preview (embed) untuk
YouTube dan Google Drive.

## Tumpukan Teknologi (Tech Stack)

- **Next.js 14** (App Router) + TypeScript — di-deploy ke Vercel
- **Tailwind CSS** — styling
- **Prisma ORM** + **PostgreSQL** — database (bisa pakai Vercel Postgres / Neon / Supabase, semua ada tier gratis)
- Autentikasi admin sederhana berbasis session cookie (JWT, tanpa library eksternal berat)

## Struktur Fitur

- **Publik**: beranda dengan pencarian & kartu kategori, halaman per kategori, halaman detail
  dokumen (dengan embed video YouTube / preview Google Drive bila tersedia).
- **Admin** (`/admin`): login, dashboard ringkasan, kelola dokumen (tambah/ubah/hapus/terbitkan),
  semua lewat form link — tanpa upload file.

## 1. Menjalankan di Lokal

```bash
npm install
cp .env.example .env
```

Edit `.env` dan isi minimal:

```
DATABASE_URL="postgresql://..."   # lihat langkah 2 di bawah
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="password-anda"
AUTH_SECRET="string-acak-panjang-minimal-32-karakter"
```

Lalu buat tabel di database dan (opsional) isi contoh data:

```bash
npx prisma db push
npm run db:seed   # opsional, isi 7 contoh dokumen
npm run dev
```

Buka `http://localhost:3000` untuk situs publik, dan `http://localhost:3000/admin` untuk login admin.

## 2. Menyiapkan Database (gratis, cukup 5 menit)

Pilih salah satu (semua kompatibel dengan Prisma + Vercel):

- **Vercel Postgres** — dari dashboard proyek Vercel: Storage → Create Database → Postgres.
  `DATABASE_URL` akan otomatis tersedia sebagai environment variable.
- **Neon** (https://neon.tech) — buat project baru, salin connection string (yang mode
  "pooled"/"pgbouncer" jika tersedia) ke `DATABASE_URL`.
- **Supabase** (https://supabase.com) — buat project, ambil connection string dari
  Project Settings → Database.

Setelah `DATABASE_URL` didapat, jalankan `npx prisma db push` sekali untuk membuat tabel.

## 3. Deploy ke Vercel

### Opsi A — lewat GitHub (disarankan)

1. Push folder ini ke repository GitHub baru.
2. Buka https://vercel.com/new, import repository tersebut.
3. Saat konfigurasi proyek, isi **Environment Variables**:
   - `DATABASE_URL`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_SITE_NAME` (opsional)
4. Klik **Deploy**. Vercel otomatis menjalankan `npm install` (yang men-generate Prisma Client)
   lalu `npm run build`.
5. Setelah deploy pertama sukses, jalankan migrasi skema database sekali dari komputer lokal
   Anda (arahkan `DATABASE_URL` di `.env` lokal ke database produksi), lalu:
   ```bash
   npx prisma db push
   npm run db:seed   # opsional
   ```

### Opsi B — lewat Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel env add DATABASE_URL
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD
vercel env add AUTH_SECRET
vercel --prod
```

## 4. Login Admin

Buka `https://domain-anda.vercel.app/admin` → login dengan `ADMIN_USERNAME` /
`ADMIN_PASSWORD` yang diatur di environment variable. Dari sana Admin bisa:

- Melihat ringkasan jumlah dokumen per kategori
- Menambah dokumen baru (judul, deskripsi, kategori, tempel link, tag)
- Mengubah / menghapus / menerbitkan-menyembunyikan dokumen

> Catatan keamanan: kredensial admin adalah satu akun bersama (shared account) yang diatur lewat
> environment variable, bukan tersimpan di database. Untuk multi-admin dengan akun terpisah,
> tambahkan tabel `User` + hashing password (bcrypt) sebagai pengembangan lanjutan.

## 5. Menyesuaikan Kategori / Tampilan

- Daftar kategori & ikon ada di `src/lib/categories.ts`.
- Warna tema (hijau) ada di `tailwind.config.ts` (`colors.brand`) — ganti sesuai identitas visual
  BDK Makassar / Kemenag jika perlu.
- Nama situs diatur lewat `NEXT_PUBLIC_SITE_NAME`.

## Struktur Folder Penting

```
prisma/schema.prisma        # skema database (model KnowledgeItem)
prisma/seed.ts               # contoh data
src/lib/categories.ts        # daftar kategori, deteksi jenis link, helper embed
src/lib/auth.ts               # session admin (JWT cookie)
src/middleware.ts             # proteksi rute /admin
src/app/page.tsx              # beranda publik
src/app/kategori/[slug]/      # daftar dokumen per kategori
src/app/item/[id]/            # detail dokumen + embed
src/app/admin/                # dashboard & kelola dokumen (butuh login)
src/app/api/items/            # API CRUD dokumen (dipakai oleh form admin)
src/app/api/auth/             # API login/logout admin
```
