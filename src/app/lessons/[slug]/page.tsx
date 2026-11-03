import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpen, Headphones } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AudioPlayer from "@/components/audio-player";
import ListeningQuiz from "@/components/listening-quiz";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: lesson } = await supabase.from("lessons").select("id,title,slug,topic,description,script_ar,script_id,voice_locale,speech_rate").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (!lesson) notFound();
  const { data: questionRows } = await supabase.from("questions").select("id,prompt_ar,prompt_id,order_index").eq("lesson_id", lesson.id).order("order_index");
  const questionIds = (questionRows || []).map((question: any) => question.id);
  const { data: optionRows } = questionIds.length ? await supabase.from("answer_options").select("id,question_id,label,text_ar,text_id,order_index").in("question_id", questionIds).order("order_index") : { data: [] as any[] };
  const questions = (questionRows || []).map((question: any) => ({ ...question, options: (optionRows || []).filter((option: any) => option.question_id === question.id) }));

  return (
    <main className="min-h-screen bg-sand">
      <header className="border-b border-slate-100 bg-white"><div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-700"><ArrowLeft size={17} /> Dashboard</Link><span className="flex items-center gap-2 text-sm font-extrabold text-brand-700"><Headphones size={17} /> SAMI'NA</span></div></header>
      <div className="mx-auto max-w-4xl px-5 py-8 sm:py-10">
        <div className="mb-7"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-brand-700">Mahārah al-Istimā' · Latihan menyimak</p><h1 className="mt-2 text-3xl font-black text-ink">{lesson.title}</h1><p className="arabic mt-1 text-3xl text-brand-800">{lesson.topic}</p><p className="mt-3 max-w-2xl leading-7 text-slate-600">{lesson.description}</p></div>
        <div className="space-y-6"><AudioPlayer text={lesson.script_ar} locale={lesson.voice_locale || "ar-SA"} speechRate={Number(lesson.speech_rate || 0.85)} /><div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><div className="flex gap-3"><BookOpen className="mt-0.5 shrink-0 text-amber-700" size={19} /><div><p className="font-bold text-amber-900">Petunjuk pengerjaan</p><p className="mt-1 text-sm leading-6 text-amber-800">Dengarkan percakapan dengan saksama, kemudian pilih jawaban yang paling tepat. Naskah percakapan disembunyikan selama latihan dan baru dapat dilihat setelah jawaban diperiksa.</p></div></div></div><ListeningQuiz lessonId={lesson.id} questions={questions} transcriptAr={lesson.script_ar} transcriptId={lesson.script_id || ""} /></div>
      </div>
    </main>
  );
}
