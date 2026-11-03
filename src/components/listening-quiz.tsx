"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, RotateCcw, Trophy, XCircle } from "lucide-react";

type Option = { id: string; label: string; text_ar: string; text_id: string | null };
type Question = { id: string; prompt_ar: string; prompt_id: string; options: Option[] };
type ReviewItem = {
  question_id: string;
  prompt_ar: string;
  prompt_id: string;
  is_correct: boolean;
  selected_option: Option | null;
  correct_option: Option;
  explanation: string;
};
type Result = { attempt_id: string; total_questions: number; correct_answers: number; wrong_answers: number; score: number; review: ReviewItem[] };

export default function ListeningQuiz({ lessonId, questions, transcriptAr, transcriptId }: { lessonId: string; questions: Question[]; transcriptAr: string; transcriptId: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const completed = Object.keys(answers).length;
  const canSubmit = useMemo(() => questions.length > 0 && completed === questions.length, [completed, questions.length]);

  async function submit() {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/lessons/${lessonId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: Object.entries(answers).map(([question_id, option_id]) => ({ question_id, option_id })) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Jawaban belum berhasil diperiksa.");
      setResult(payload as Result);
      setShowTranscript(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  function retry() {
    setAnswers({});
    setResult(null);
    setError("");
    setShowTranscript(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (questions.length === 0) return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">Belum ada soal untuk materi ini. Silakan hubungi guru atau admin.</div>;

  return (
    <div className="space-y-6">
      {result && <section className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft sm:p-8"><div className="flex flex-col items-center text-center"><span className="rounded-2xl bg-brand-50 p-4 text-brand-700"><Trophy size={30} /></span><p className="mt-4 text-sm font-extrabold uppercase tracking-widest text-brand-700">Hasil latihan</p><div className="mt-1 text-5xl font-black tracking-tight text-ink">{Number(result.score).toFixed(2)}<span className="text-2xl">%</span></div><p className="mt-2 text-slate-500">Kamu menjawab {result.correct_answers} dari {result.total_questions} soal dengan benar.</p></div><div className="mt-6 grid grid-cols-3 gap-3"><div className="rounded-2xl bg-slate-50 p-3 text-center"><p className="text-2xl font-black text-ink">{result.total_questions}</p><p className="text-xs text-slate-500">Jumlah soal</p></div><div className="rounded-2xl bg-brand-50 p-3 text-center"><p className="text-2xl font-black text-brand-700">{result.correct_answers}</p><p className="text-xs text-brand-700">Benar</p></div><div className="rounded-2xl bg-red-50 p-3 text-center"><p className="text-2xl font-black text-red-700">{result.wrong_answers}</p><p className="text-xs text-red-600">Salah</p></div></div><p className="mt-5 text-center text-sm font-semibold text-slate-600">{result.score >= 80 ? "Bagus sekali! Kamu memahami sebagian besar percakapan." : result.score >= 60 ? "Usaha yang baik. Pelajari pembahasan dan coba lagi." : "Jangan menyerah. Dengarkan kembali dialog dan pelajari pembahasannya."}</p><button type="button" onClick={retry} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-5 py-3 font-bold text-brand-700 hover:bg-brand-50"><RotateCcw size={17} /> Ulangi latihan</button></section>}

      {!result && <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"><div><p className="text-sm font-bold text-ink">Pengerjaan soal</p><p className="text-xs text-slate-500">Pilih satu jawaban pada setiap soal.</p></div><span className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-extrabold text-brand-700">{completed}/{questions.length}</span></div>}

      {questions.map((question, index) => {
        const review = result?.review.find((item) => item.question_id === question.id);
        return <section key={question.id} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-widest text-brand-700">Soal {index + 1}</span>{review && (review.is_correct ? <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700"><CheckCircle2 size={15} /> Benar</span> : <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600"><XCircle size={15} /> Belum tepat</span>)}</div><h3 className="arabic mt-4 text-right text-2xl font-bold text-ink sm:text-3xl">{question.prompt_ar}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{question.prompt_id}</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{question.options.map((option) => {
          const selected = answers[question.id] === option.id;
          const isCorrect = review?.correct_option.id === option.id;
          const isWrongSelected = review && selected && !review.is_correct;
          let style = selected ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100" : "border-slate-200 bg-white hover:border-brand-200 hover:bg-brand-50/50";
          if (result && isCorrect) style = "border-brand-400 bg-brand-50";
          if (result && isWrongSelected) style = "border-red-300 bg-red-50";
          return <button key={option.id} type="button" disabled={!!result} onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))} className={`flex min-h-[68px] items-center gap-3 rounded-2xl border p-4 text-left transition disabled:cursor-default ${style}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${selected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>{option.label}</span><span className="min-w-0 flex-1"><span className="arabic block text-right text-xl font-semibold text-ink">{option.text_ar}</span>{option.text_id && <span className="mt-1 block text-xs text-slate-500">{option.text_id}</span>}</span>{result && isCorrect && <CheckCircle2 className="shrink-0 text-brand-600" size={19} />}</button>;
        })}</div>{review && <div className="mt-5 rounded-2xl bg-slate-50 p-4"><p className="text-sm font-extrabold text-ink">Pembahasan</p><p className="mt-2 text-sm leading-6 text-slate-600">{review.explanation}</p><p className="mt-3 text-sm font-bold text-brand-800">Kunci jawaban: {review.correct_option.label}. <span className="arabic text-lg">{review.correct_option.text_ar}</span></p></div>}</section>;
      })}

      {!result && <div className="space-y-3"><div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(completed / questions.length) * 100}%` }} /></div>{error && <p className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"><CircleAlert size={16} /> {error}</p>}<button type="button" disabled={!canSubmit || loading} onClick={submit} className="w-full rounded-2xl bg-brand-600 px-6 py-4 font-extrabold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300">{loading ? "Memeriksa jawaban..." : `Periksa Jawaban (${completed}/${questions.length})`}</button><p className="text-center text-xs text-slate-400">Semua soal harus dijawab sebelum diperiksa.</p></div>}

      {result && <section className="rounded-3xl border border-brand-100 bg-white p-5 sm:p-7"><button type="button" onClick={() => setShowTranscript((value) => !value)} className="flex w-full items-center justify-between text-left"><span><span className="block font-extrabold text-ink">Naskah percakapan</span><span className="mt-1 block text-sm text-slate-500">Lihat teks Arab dan terjemahan setelah evaluasi.</span></span><span className="text-sm font-bold text-brand-700">{showTranscript ? "Sembunyikan" : "Tampilkan"}</span></button>{showTranscript && <div className="mt-5 border-t border-slate-100 pt-5"><p className="arabic whitespace-pre-line text-right text-xl leading-[2.3] text-ink">{transcriptAr}</p><p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{transcriptId}</p></div>}</section>}
    </div>
  );
}
