# Sami'na — Full-stack Arabic Listening Platform

Sami'na adalah starter website full-stack untuk latihan **Mahārah al-Istimā' (keterampilan menyimak bahasa Arab)**. Project ini menggunakan Next.js App Router, TypeScript, Tailwind CSS, Supabase, dan Web Speech API (Text-to-Speech browser).

## Fitur yang sudah disiapkan

- Landing page Sami'na yang responsif.
- Registrasi dan login menggunakan Supabase Auth.
- Profil pengguna otomatis dibuat setelah registrasi.
- Dashboard siswa dan riwayat hasil latihan.
- Materi latihan istima' dengan audio Text-to-Speech browser (tanpa file MP3).
- Pemilihan voice Arab yang tersedia pada perangkat.
- Kontrol play, pause/resume, stop, replay, dan kecepatan audio.
- Soal pilihan ganda A–D.
- Penilaian otomatis melalui PostgreSQL function di Supabase.
- Kunci jawaban dipisahkan dari tabel opsi dan hanya dikembalikan setelah submit.
- Pembahasan, kunci jawaban, dan naskah percakapan setelah evaluasi.
- Dashboard admin untuk membuat materi dan menambahkan soal pilihan ganda.
- Row Level Security (RLS) untuk melindungi data.
- Seed materi pertama: **التَّعَارُفُ (Perkenalan)**.

## Teknologi

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL + Row Level Security
- Web Speech API (`SpeechSynthesis`) untuk audio Arab dari browser
- Lucide React
- Deployment: Vercel

## 1. Persiapan

Pastikan sudah terpasang:

- Node.js 20.9 atau lebih baru
- npm
- Git
- VS Code
- Akun GitHub, Supabase, dan Vercel

## 2. Instalasi lokal

Ekstrak ZIP, buka folder project di VS Code, lalu jalankan:

```bash
npm install
```

Salin `.env.example` menjadi `.env.local`, lalu isi kredensial dari **Supabase Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

Jangan pernah memasukkan `service_role` key ke frontend atau repository GitHub.

## 3. Siapkan database Supabase

1. Buat project baru di Supabase.
2. Buka **SQL Editor**.
3. Salin dan jalankan seluruh isi `supabase/schema.sql`.
4. Setelah berhasil, jalankan seluruh isi `supabase/seed.sql` untuk memasukkan materi contoh التَّعَارُفُ beserta 3 soal.
5. Pastikan email/password provider aktif di **Authentication → Providers**.

## 4. Jalankan website

```bash
npm run dev
```

Buka `http://localhost:3000`.

Daftarkan akun melalui halaman Register. Jika konfirmasi email Supabase aktif, verifikasi email terlebih dahulu sebelum login.

## 5. Jadikan akun sebagai admin

Daftarkan akun biasa terlebih dahulu. Setelah itu, buka Supabase SQL Editor dan jalankan query berikut dengan email akun yang didaftarkan:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'email-admin-kamu@example.com'
);
```

Keluar lalu masuk kembali. Link **Admin** akan muncul di dashboard, dan `/admin` dapat digunakan untuk menambah materi serta soal.

## 6. Upload ke GitHub

Buat repository baru di GitHub, lalu dari terminal folder project jalankan:

```bash
git init
git add .
git commit -m "Initial Sami'na full-stack website"
git branch -M main
git remote add origin https://github.com/USERNAME/samina.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub kamu.

## 7. Deploy ke Vercel

1. Masuk ke Vercel dan pilih **Add New → Project**.
2. Import repository Sami'na dari GitHub.
3. Framework akan terdeteksi sebagai Next.js.
4. Tambahkan environment variables yang sama dengan `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Klik **Deploy**.
6. Di Supabase → Authentication → URL Configuration, tambahkan URL domain Vercel ke **Site URL** dan **Redirect URLs** sesuai domain deployment.

Setelah perubahan environment variables, lakukan redeploy.

## 8. Cara kerja audio browser

Komponen `src/components/audio-player.tsx` memakai `window.speechSynthesis` dan `SpeechSynthesisUtterance`. Teks Arab disimpan di database, lalu browser mengubah teks menjadi suara saat siswa menekan tombol Putar.

**Catatan kompatibilitas:** daftar suara Arab bergantung pada sistem operasi dan browser. Tidak semua perangkat menyediakan voice Arab. Sami'na akan menampilkan peringatan jika voice Arab tidak ditemukan. Uji suara di Chrome/Edge Android dan Safari iOS sebelum digunakan untuk pembelajaran resmi.

**Catatan pedagogis:** suara TTS browser dapat berbeda kualitas, intonasi, dan pelafalannya. Untuk ujian menyimak yang membutuhkan audio seragam dan naskah tidak boleh diakses siswa, gunakan rekaman audio atau TTS server-side yang menghasilkan audio final. Browser TTS membutuhkan teks berada di perangkat pengguna sehingga naskah secara teknis dapat diperiksa melalui developer tools.

## 9. Struktur utama

```text
src/
  app/
    page.tsx                    # Landing page
    login/                      # Login
    register/                   # Registrasi
    dashboard/                  # Dashboard siswa
    lessons/[slug]/             # Halaman latihan istima'
    api/lessons/[lessonId]/submit/ # Endpoint evaluasi
    admin/                      # Dashboard admin + server actions
  components/
    audio-player.tsx            # Browser Text-to-Speech
    listening-quiz.tsx          # Soal, hasil, dan pembahasan
    site-header.tsx
  lib/supabase/
    server.ts
    client.ts
  middleware.ts                 # Refresh session + route protection
supabase/
  schema.sql                    # Struktur database, RLS, RPC
  seed.sql                      # Materi dan soal contoh
```

## Catatan pengembangan berikutnya

Versi ini adalah MVP full-stack yang sudah memiliki alur utama. Pengembangan lanjutan yang disarankan:

1. Tambah banyak materi dan bank soal.
2. Tambahkan pengelolaan seluruh soal (edit, hapus, reorder) di admin.
3. Tambahkan kelas, penugasan, dan laporan guru.
4. Tambahkan batas percobaan, timer, dan randomisasi soal bila diperlukan.
5. Tambahkan audio rekaman/TTS server-side sebagai opsi audio konsisten.
6. Tambahkan PWA agar Sami'na dapat dipasang seperti aplikasi.

