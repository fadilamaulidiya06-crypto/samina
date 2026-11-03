import Link from "next/link";
import { Headphones } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-brand-100/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-soft"><Headphones size={21} /></span>
          <span>
            <span className="block text-lg font-extrabold tracking-tight text-ink">Sami'na</span>
            <span className="arabic block -mt-1 text-sm text-brand-700">سَمِعْنَا</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-brand-50 hover:text-brand-700">Masuk</Link>
          <Link href="/register" className="rounded-full bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700">Mulai belajar</Link>
        </nav>
      </div>
    </header>
  );
}
