import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BookPlus, FileQuestion, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createLessonAction, createQuestionAction } from "@/app/admin/actions";
import { logoutAction } from "@/app/auth/actions";

type AdminLesson = { id: string; title: string; slug: string; is_published: boolean };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string; created?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role,full_name").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/dashboard");
  const { data: lessonRows } = await supabase.from("lessons").select("id,title,slug,is_published").order("order_index");
  const lessons = (lessonRows ?? []) as AdminLesson[];

  return (
    <main className="min-h-screen bg-sand">
      <header className="border-b border-slate-100 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-700"><ArrowLeft size={17} /> Dashboard</Link><div className="flex items-center gap-2 text-sm font-extrabold text-brand-700"><ShieldCheck size={18} /> ADMIN SAMI&apos;NA</div><form action={logoutAction}><button className="text-sm font-bold text-slate-500 hover:text-red-600">Keluar</button></form></div></header>
      <div className="mx-auto max-w-7xl px-5 py-9"><div><p className="text-sm font-extrabold uppercase tracking-widest text-brand-700">Content management</p><h1 className="mt-2 text-3xl font-black text-ink">Dashboard Admin</h1><p className="mt-2 text-slate-500">Kelola materi istima&apos;, naskah percakapan, dan bank soal Sami&apos;na.</p></div>
        {params.error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{params.error}</p>}
        {params.created && <p className="mt-6 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">{params.created === "lesson" ? "Materi berhasil dibuat." : "Soal dan kunci jawaban berhasil disimpan."}</p>}
        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className="rounded-xl bg-brand-50 p-3 text-brand-700"><BookPlus size={22} /></span><div><h2 className="text-lg font-extrabold text-ink">Tambah materi</h2><p className="text-sm text-slate-500">Buat unit pembelajaran baru.</p></div></div>
            <form action={createLessonAction} className="mt-6 space-y-4">
              <label className="block text-sm font-bold text-slate-700">Judul materi<input name="title" required placeholder="Latihan Istima' 1" className="form-input" /></label>
              <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-bold text-slate-700">Slug URL<input name="slug" required placeholder="taaruf" className="form-input" /></label><label className="block text-sm font-bold text-slate-700">Topik Arab<input name="topic" required dir="rtl" placeholder="التَّعَارُفُ" className="form-input arabic text-right" /></label></div>
              <label className="block text-sm font-bold text-slate-700">Deskripsi<textarea name="description" rows={2} placeholder="Latihan menyimak percakapan perkenalan..." className="form-input" /></label>
              <label className="block text-sm font-bold text-slate-700">Naskah percakapan Arab<textarea name="script_ar" required rows={5} dir="rtl" placeholder="أَحْمَدُ: السَّلَامُ عَلَيْكُمْ..." className="form-input arabic text-right text-lg" /></label>
              <label className="block text-sm font-bold text-slate-700">Terjemahan / naskah Indonesia<textarea name="script_id" rows={3} placeholder="Ahmad: Assalamu'alaikum..." className="form-input" /></label>
              <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-bold text-slate-700">Locale suara<select name="voice_locale" defaultValue="ar-SA" className="form-input"><option value="ar-SA">ar-SA — Arab Saudi</option><option value="ar-EG">ar-EG — Arab Mesir</option><option value="ar">ar — Arab umum</option></select></label><label className="block text-sm font-bold text-slate-700">Urutan materi<input name="order_index" type="number" min="1" defaultValue="1" className="form-input" /></label></div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-600"><input type="checkbox" name="is_published" defaultChecked className="h-4 w-4 accent-brand-600" /> Publikasikan materi setelah dibuat</label>
              <button className="w-full rounded-xl bg-brand-600 px-5 py-3 font-bold text-white hover:bg-brand-700">Simpan materi</button>
            </form>
          </section>
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className="rounded-xl bg-brand-50 p-3 text-brand-700"><FileQuestion size={22} /></span><div><h2 className="text-lg font-extrabold text-ink">Tambah soal pilihan ganda</h2><p className="text-sm text-slate-500">Satu kali pengisian untuk empat opsi dan kunci.</p></div></div>
            {(!lessons || lessons.length === 0) ? <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Buat materi terlebih dahulu sebelum menambahkan soal.</p> : <form action={createQuestionAction} className="mt-6 space-y-4">
              <label className="block text-sm font-bold text-slate-700">Pilih materi<select name="lesson_id" required className="form-input">{lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}{lesson.is_published ? " — Published" : " — Draft"}</option>)}</select></label>
              <label className="block text-sm font-bold text-slate-700">Pertanyaan bahasa Arab<textarea name="prompt_ar" required rows={2} dir="rtl" placeholder="مِنْ أَيْنَ عَلِيٌّ؟" className="form-input arabic text-right text-xl" /></label>
              <label className="block text-sm font-bold text-slate-700">Terjemahan pertanyaan<input name="prompt_id" required placeholder="Dari mana Ali berasal?" className="form-input" /></label>
              <div className="grid gap-3 sm:grid-cols-2">{["A", "B", "C", "D"].map((label) => <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-3"><p className="mb-2 text-xs font-extrabold text-brand-700">OPSI {label}</p><input name={`option_${label.toLowerCase()}_ar`} required dir="rtl" placeholder="Teks Arab" className="form-input arabic text-right" /><input name={`option_${label.toLowerCase()}_id`} placeholder="Terjemahan (opsional)" className="form-input mt-2" /></div>)}</div>
              <label className="block text-sm font-bold text-slate-700">Kunci jawaban<select name="correct_option" className="form-input">{["A", "B", "C", "D"].map((label) => <option key={label} value={label}>{label}</option>)}</select></label>
              <label className="block text-sm font-bold text-slate-700">Pembahasan<textarea name="explanation" rows={3} placeholder="Jelaskan alasan jawaban yang benar..." className="form-input" /></label>
              <label className="block text-sm font-bold text-slate-700">Urutan soal<input name="order_index" type="number" min="1" defaultValue="1" className="form-input" /></label>
              <button className="w-full rounded-xl bg-brand-600 px-5 py-3 font-bold text-white hover:bg-brand-700">Simpan soal dan kunci jawaban</button>
            </form>}
          </section>
        </div>
        <section className="mt-7 rounded-3xl border border-slate-100 bg-white p-6"><h2 className="font-extrabold text-ink">Materi terdaftar</h2><div className="mt-4 divide-y divide-slate-100">{lessons.map((lesson) => <div key={lesson.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-bold text-ink">{lesson.title}</p><p className="text-xs text-slate-400">/lessons/{lesson.slug}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${lesson.is_published ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-500"}`}>{lesson.is_published ? "Published" : "Draft"}</span></div>)}</div></section>
      </div>
    </main>
  );
}
