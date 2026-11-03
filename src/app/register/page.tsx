import Link from "next/link";
import { Headphones } from "lucide-react";
import { registerAction } from "@/app/auth/actions";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3"><span className="rounded-2xl bg-brand-600 p-3 text-white"><Headphones size={23} /></span><span><strong className="block text-xl text-ink">Sami'na</strong><span className="arabic text-sm text-brand-700">سَمِعْنَا</span></span></Link>
        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft sm:p-9">
          <div className="text-center"><h1 className="text-2xl font-black text-ink">Buat akun Sami'na</h1><p className="mt-2 text-sm text-slate-500">Mulai perjalanan belajar bahasa Arabmu.</p></div>
          {params.error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{params.error}</p>}
          <form action={registerAction} className="mt-7 space-y-4">
            <label className="block text-sm font-bold text-slate-700">Nama lengkap<input name="full_name" required autoComplete="name" placeholder="Nama kamu" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50" /></label>
            <label className="block text-sm font-bold text-slate-700">Email<input name="email" type="email" required autoComplete="email" placeholder="nama@email.com" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50" /></label>
            <label className="block text-sm font-bold text-slate-700">Password<input name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="Minimal 8 karakter" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50" /></label>
            <button className="w-full rounded-xl bg-brand-600 px-5 py-3.5 font-bold text-white transition hover:bg-brand-700">Daftar dan mulai belajar</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">Sudah punya akun? <Link href="/login" className="font-bold text-brand-700 hover:underline">Masuk</Link></p>
        </div>
      </div>
    </main>
  );
}
