import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Headphones, LogOut, ShieldCheck, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/app/auth/actions";

type DashboardProfile = { full_name: string; role: string };
type DashboardLesson = {
  id: string;
  title: string;
  slug: string;
  topic: string;
  description: string;
  order_index: number;
};
type DashboardAttempt = {
  id: string;
  score: number | string;
  created_at: string;
  lessons: { title: string }[] | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: profileData }, { data: lessonData }, { data: attemptData }] = await Promise.all([
    supabase.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle(),
    supabase.from("lessons").select("id,title,slug,topic,description,order_index").eq("is_published", true).order("order_index"),
    supabase.from("attempts").select("id,score,created_at,lessons(title)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
  ]);
  const profile = profileData as DashboardProfile | null;
  const lessons = (lessonData ?? []) as DashboardLesson[];
  const attempts = (attemptData ?? []) as DashboardAttempt[];
  const totalAttempts = attempts.length;
  const average = totalAttempts ? (attempts.reduce((sum, item) => sum + Number(item.score), 0) / totalAttempts).toFixed(0) : "—";
  const name = profile?.full_name || user.email?.split("@")[0] || "Siswa";

  return (
    <main className="min-h-screen bg-sand">
      <header className="border-b border-slate-100 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"><Link href="/" className="flex items-center gap-3"><span className="rounded-xl bg-brand-600 p-2.5 text-white"><Headphones size={20} /></span><span><strong className="block text-lg text-ink">Sami&apos;na</strong><span className="arabic text-xs text-brand-700">سَمِعْنَا</span></span></Link><div className="flex items-center gap-2">{profile?.role === "admin" && <Link href="/admin" className="hidden items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800 sm:inline-flex"><ShieldCheck size={16} /> Admin</Link>}<form action={logoutAction}><button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"><LogOut size={16} /><span className="hidden sm:inline">Keluar</span></button></form></div></div></header>
      <div className="mx-auto max-w-7xl px-5 py-9 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] bg-brand-900 p-7 text-white shadow-soft sm:p-10"><div className="grid items-center gap-6 md:grid-cols-[1fr_auto]"><div><p className="text-sm font-bold text-brand-200">DASHBOARD SISWA</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Assalamu&apos;alaikum, {name}!</h1><p className="mt-3 max-w-xl leading-7 text-brand-100">Yuk, lanjutkan latihan menyimak bahasa Arab. Dengarkan dengan saksama dan pahami informasi dari setiap percakapan.</p></div><div className="hidden h-24 w-24 items-center justify-center rounded-3xl bg-white/10 text-brand-100 md:flex"><Headphones size={48} /></div></div></section>
        <section className="mt-6 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-100 bg-white p-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">Materi tersedia</span><BookOpen className="text-brand-600" size={20} /></div><p className="mt-3 text-3xl font-black text-ink">{lessons?.length ?? 0}</p><p className="mt-1 text-xs text-slate-400">Materi yang dapat dipelajari</p></div><div className="rounded-2xl border border-slate-100 bg-white p-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">Latihan dikerjakan</span><Trophy className="text-brand-600" size={20} /></div><p className="mt-3 text-3xl font-black text-ink">{totalAttempts}</p><p className="mt-1 text-xs text-slate-400">Lima percobaan terbaru ditampilkan</p></div><div className="rounded-2xl border border-slate-100 bg-white p-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">Rata-rata nilai terbaru</span><ShieldCheck className="text-brand-600" size={20} /></div><p className="mt-3 text-3xl font-black text-ink">{average}{average !== "—" ? <span className="text-lg">%</span> : null}</p><p className="mt-1 text-xs text-slate-400">Berdasarkan riwayat yang ditampilkan</p></div></section>
        <section className="mt-10"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-extrabold uppercase tracking-widest text-brand-700">Learning path</p><h2 className="mt-1 text-2xl font-black text-ink">Pilih materi pembelajaran</h2></div><span className="text-sm text-slate-500">Fokus: Mahārah al-Istimā&apos;</span></div>
          {(!lessons || lessons.length === 0) ? <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><BookOpen className="mx-auto text-slate-400" size={30} /><h3 className="mt-3 font-bold text-ink">Belum ada materi yang dipublikasikan</h3><p className="mt-1 text-sm text-slate-500">Admin dapat menjalankan seed.sql atau menambahkan materi dari dashboard admin.</p></div> : <div className="mt-5 grid gap-4 md:grid-cols-2">{lessons.map((lesson, index) => <Link key={lesson.id} href={`/lessons/${lesson.slug}`} className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft"><div className="flex items-start justify-between"><span className="rounded-xl bg-brand-50 p-3 text-brand-700"><Headphones size={22} /></span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">Materi {String(index + 1).padStart(2, "0")}</span></div><h3 className="mt-5 text-xl font-extrabold text-ink group-hover:text-brand-700">{lesson.title}</h3><p className="arabic mt-1 text-2xl text-brand-800">{lesson.topic}</p><p className="mt-3 text-sm leading-6 text-slate-500">{lesson.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-brand-700">Mulai latihan <span aria-hidden>→</span></span></Link>)}</div>}
        </section>
        <section className="mt-10 rounded-3xl border border-slate-100 bg-white p-6"><h2 className="text-lg font-extrabold text-ink">Riwayat latihan terbaru</h2>{!attempts?.length ? <p className="mt-3 text-sm text-slate-500">Belum ada latihan yang diselesaikan. Mulai dari materi pertama!</p> : <div className="mt-4 divide-y divide-slate-100">{attempts.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 py-3"><div><p className="font-bold text-ink">{item.lessons?.[0]?.title || "Latihan istima'"}</p><p className="text-xs text-slate-400">{new Date(item.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</p></div><span className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-extrabold text-brand-700">{Number(item.score).toFixed(2)}%</span></div>)}</div>}</section>
      </div>
    </main>
  );
}
