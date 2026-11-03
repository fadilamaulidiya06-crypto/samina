import Link from "next/link";
import { Headphones, ShieldCheck } from "lucide-react";
import { loginAction } from "@/app/auth/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; registered?: string; next?: string }> }) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3"><span className="rounded-2xl bg-brand-600 p-3 text-white"><Headphones size={23} /></span><span><strong className="block text-xl text-ink">Sami&apos;na</strong><span className="arabic text-sm text-brand-700">سَمِعْنَا</span></span></Link>
        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft sm:p-9">
          <div className="text-center"><h1 className="text-2xl font-black text-ink">Selamat datang kembali</h1><p className="mt-2 text-sm text-slate-500">Masuk untuk melanjutkan latihan bahasa Arab.</p></div>
          {params.registered && <p className="mt-5 rounded-xl bg-brand-50 p-3 text-sm text-brand-800">Pendaftaran berhasil. Jika konfirmasi email aktif, silakan verifikasi email terlebih dahulu.</p>}
          {params.error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{params.error}</p>}
          <form action={loginAction} className="mt-7 space-y-4">
            <label className="block text-sm font-bold text-slate-700">Email<input name="email" type="email" autoComplete="email" required placeholder="nama@email.com" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50" /></label>
            <label className="block text-sm font-bold text-slate-700">Password<input name="password" type="password" autoComplete="current-password" required placeholder="Masukkan password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50" /></label>
            <button className="w-full rounded-xl bg-brand-600 px-5 py-3.5 font-bold text-white transition hover:bg-brand-700">Masuk ke Sami&apos;na</button>
          </form>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400"><ShieldCheck size={14} /> Akun dilindungi oleh Supabase Authentication</div>
          <p className="mt-6 text-center text-sm text-slate-500">Belum punya akun? <Link href="/register" className="font-bold text-brand-700 hover:underline">Daftar sekarang</Link></p>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400"><Link href="/" className="hover:text-brand-700">Kembali ke beranda</Link></p>
      </div>
    </main>
  );
}
