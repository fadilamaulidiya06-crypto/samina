"use client";

import { useEffect, useState } from "react";
import { Headphones, Pause, Play, RotateCcw, Square, Volume2 } from "lucide-react";

type Props = { text: string; locale?: string; speechRate?: number };
type Status = "idle" | "playing" | "paused";

export default function AudioPlayer({ text, locale = "ar-SA", speechRate = 0.85 }: Props) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState(String(speechRate));
  const [status, setStatus] = useState<Status>("idle");
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      const arabic = available.find((voice) => voice.lang.toLowerCase().startsWith("ar"));
      if (arabic) setSelectedVoice((current) => current || arabic.voiceURI);
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const arabicVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("ar"));

  function play() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = Number(rate);
    utterance.pitch = 1;
    const voice = voices.find((item) => item.voiceURI === selectedVoice) || arabicVoices[0];
    if (voice) utterance.voice = voice;
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("idle");
    setStatus("playing");
    window.speechSynthesis.speak(utterance);
  }

  function pauseOrResume() {
    if (status === "playing") {
      window.speechSynthesis.pause();
      setStatus("paused");
    } else if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
    } else {
      play();
    }
  }

  function stop() {
    if (supported) window.speechSynthesis.cancel();
    setStatus("idle");
  }

  return (
    <section className="rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div><div className="flex items-center gap-2 text-sm font-extrabold text-brand-800"><Headphones size={17} /> AUDIO ISTIMĀ'</div><p className="mt-1 text-sm text-slate-500">Dengarkan dialog dengan saksama.</p></div>
        <span className="rounded-xl bg-white p-2.5 text-brand-700 shadow-sm"><Volume2 size={20} /></span>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={pauseOrResume} disabled={!supported} aria-label={status === "playing" ? "Jeda audio" : "Putar audio"} className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition hover:scale-105 hover:bg-brand-700 disabled:opacity-40">{status === "playing" ? <Pause size={27} fill="currentColor" /> : <Play size={27} fill="currentColor" className="ml-1" />}</button>
        <button type="button" onClick={stop} disabled={!supported} className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 hover:bg-brand-50 disabled:opacity-40" aria-label="Hentikan audio"><Square size={17} fill="currentColor" /></button>
        <button type="button" onClick={play} disabled={!supported} className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 hover:bg-brand-50 disabled:opacity-40" aria-label="Putar ulang audio"><RotateCcw size={17} /></button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-bold text-slate-600">KECEPATAN SUARA<select value={rate} onChange={(event) => setRate(event.target.value)} className="mt-1.5 w-full rounded-xl border border-brand-100 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-500"><option value="0.75">0.75× — Lambat</option><option value="0.85">0.85× — Pemula</option><option value="1">1.00× — Normal</option><option value="1.25">1.25× — Cepat</option></select></label>
        <label className="text-xs font-bold text-slate-600">SUARA BAHASA ARAB<select value={selectedVoice} onChange={(event) => setSelectedVoice(event.target.value)} className="mt-1.5 w-full rounded-xl border border-brand-100 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-500"><option value="">Otomatis</option>{arabicVoices.map((voice) => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>)}</select></label>
      </div>
      {!supported ? <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Browser ini belum mendukung Speech Synthesis. Coba gunakan browser modern seperti Chrome, Edge, atau Safari.</p> : arabicVoices.length === 0 ? <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Voice bahasa Arab belum terdeteksi di perangkat ini. Browser mungkin menggunakan suara default. Untuk hasil terbaik, pasang/aktifkan voice Arabic pada pengaturan perangkat.</p> : <p className="mt-3 text-xs text-brand-700">{arabicVoices.length} pilihan suara Arab tersedia di perangkat ini.</p>}
      <p className="mt-2 text-center text-xs text-slate-400">Suara dibuat oleh browser; hasil pelafalan dapat berbeda antarperangkat.</p>
    </section>
  );
}
