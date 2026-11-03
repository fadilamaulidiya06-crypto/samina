import Link from "next/link";
import { ArrowRight, AudioLines, BookOpenCheck, CheckCircle2, Headphones, Languages, Sparkles } from "lucide-react";
import SiteHeader from "@/components/site-header";

const features = [
  { icon: Headphones, title: "Dengarkan percakapan", text: "Latih pemahaman bahasa Arab melalui dialog yang disuarakan langsung oleh browser." },
  { icon: CheckCircle2, title: "Evaluasi otomatis", text: "Jawab soal pilihan ganda dan dapatkan nilai serta umpan balik secara langsung." },
  { icon: BookOpenCheck, title: "Pelajari pembahasan", text: "Lihat kembali naskah, kunci jawaban, dan penjelasan setelah latihan selesai." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader />
      <section className="relative">
        <div className="surface-grid absolute inset-0 opacity-50" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm"><Sparkles size={16} /> Platform latihan istima&apos; bahasa Arab</div>
            <h1 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-tight text-ink sm:text-6xl">Belajar bahasa Arab dimulai dari <span className="text-brand-600">mendengar.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Sami&apos;na membantu kamu memahami percakapan bahasa Arab melalui audio interaktif, latihan pilihan ganda, nilai otomatis, dan pembahasan.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-700">Mulai belajar gratis <ArrowRight size={18} /></Link>
              <Link href="/login" className="rounded-full border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50">Saya sudah punya akun</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500"><span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-600" /> Belajar mandiri</span><span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-600" /> Audio tanpa file MP3</span><span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-600" /> Bisa di HP dan laptop</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-100 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-44 w-44 rounded-full bg-brand-100 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white bg-white p-5 shadow-[0_30px_90px_rgba(26,70,45,.14)] sm:p-7">
              <div className="flex items-center justify-between"><div><p className="text-sm font-bold text-slate-500">LATIHAN PERTAMA</p><h2 className="mt-1 text-xl font-extrabold text-ink">التَّعَارُفُ</h2><p className="text-sm text-slate-500">Perkenalan</p></div><span className="rounded-2xl bg-brand-50 p-3 text-brand-700"><AudioLines size={25} /></span></div>
              <div className="mt-6 rounded-2xl bg-brand-50 p-5 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg"><Headphones size={29} /></div><p className="mt-3 font-bold text-brand-900">Dengarkan percakapannya</p><p className="mt-1 text-sm text-brand-700">Audio bahasa Arab langsung dari browser</p><div className="mt-5 flex items-center justify-center gap-1.5">{[22,36,27,45,31,52,25,40,30,47,22,36,28,44,24].map((height, i) => <span key={i} className="w-1.5 rounded-full bg-brand-500/80" style={{ height }} />)}</div></div>
              <div className="mt-5 space-y-3"><p className="text-sm font-bold text-slate-500">CONTOH PERTANYAAN</p><p className="arabic text-right text-2xl font-bold text-ink">مِنْ أَيْنَ عَلِيٌّ؟</p><p className="text-sm text-slate-600">Dari mana Ali berasal?</p>{["مِنْ مِصْرَ", "مِنَ الْمَالِيزِيَا", "مِنْ إِنْدُونِيسِيَا"].map((answer, i) => <div key={answer} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${i === 2 ? "border-brand-300 bg-brand-50" : "border-slate-100 bg-white"}`}><span className="arabic text-lg">{answer}</span>{i === 2 && <CheckCircle2 size={18} className="text-brand-600" />}</div>)}</div>
              <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><span className="text-sm font-semibold text-slate-500">Preview pengalaman belajar</span><span className="text-xs font-bold text-brand-700">SAMI&apos;NA</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center"><p className="text-sm font-extrabold uppercase tracking-[.2em] text-brand-600">Belajar lebih terarah</p><h2 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">Satu alur belajar, dari mendengar hingga memahami.</h2><p className="mt-4 leading-7 text-slate-600">Latihan dirancang agar siswa benar-benar menangkap informasi dari percakapan, bukan sekadar membaca teks Arab.</p></div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft"><span className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700"><Icon size={24} /></span><h3 className="mt-5 text-lg font-extrabold text-ink">{title}</h3><p className="mt-2 leading-7 text-slate-600">{text}</p></div>)}</div>
      </section>
      <section className="mx-5 mb-16 rounded-[2rem] bg-brand-900 px-6 py-12 text-center text-white sm:px-12"><Languages className="mx-auto text-brand-100" size={32} /><h2 className="mt-4 text-3xl font-black">Siap mulai latihan istima&apos;?</h2><p className="mx-auto mt-3 max-w-xl leading-7 text-brand-100">Buat akun, buka materi التَّعَارُفُ, dengarkan dialog, lalu uji pemahamanmu.</p><Link href="/register" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-brand-900 hover:bg-brand-50">Buat akun Sami&apos;na <ArrowRight size={18} /></Link></section>
      <footer className="border-t border-slate-200 bg-white px-5 py-7 text-center text-sm text-slate-500">© {new Date().getFullYear()} Sami&apos;na. Platform pembelajaran bahasa Arab.</footer>
    </main>
  );
}
