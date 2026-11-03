"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/dashboard");
  return supabase;
}

export async function createLessonAction(formData: FormData) {
  const supabase = await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
  const topic = String(formData.get("topic") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const scriptAr = String(formData.get("script_ar") || "").trim();
  const scriptId = String(formData.get("script_id") || "").trim();
  const voiceLocale = String(formData.get("voice_locale") || "ar-SA");
  const orderIndex = Number(formData.get("order_index") || 1);
  const published = formData.get("is_published") === "on";
  if (!title || !slug || !topic || !scriptAr) redirect("/admin?error=Lengkapi%20judul%2C%20slug%2C%20topik%2C%20dan%20naskah%20Arab.");

  const { error } = await supabase.from("lessons").insert({
    title, slug, topic, description, script_ar: scriptAr, script_id: scriptId,
    voice_locale: voiceLocale, order_index: orderIndex, is_published: published,
  });
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  redirect("/admin?created=lesson");
}

export async function createQuestionAction(formData: FormData) {
  const supabase = await requireAdmin();
  const lessonId = String(formData.get("lesson_id") || "");
  const promptAr = String(formData.get("prompt_ar") || "").trim();
  const promptId = String(formData.get("prompt_id") || "").trim();
  const explanation = String(formData.get("explanation") || "").trim();
  const correctLabel = String(formData.get("correct_option") || "A");
  if (!lessonId || !promptAr || !promptId) redirect("/admin?error=Lengkapi%20materi%20dan%20pertanyaan.");

  const { data: question, error: questionError } = await supabase.from("questions").insert({
    lesson_id: lessonId, prompt_ar: promptAr, prompt_id: promptId, order_index: Number(formData.get("order_index") || 1),
  }).select("id").single();
  if (questionError || !question) redirect(`/admin?error=${encodeURIComponent(questionError?.message || "Gagal membuat soal")}`);

  const options = ["A", "B", "C", "D"].map((label, index) => ({
    question_id: question.id,
    label,
    text_ar: String(formData.get(`option_${label.toLowerCase()}_ar`) || "").trim(),
    text_id: String(formData.get(`option_${label.toLowerCase()}_id`) || "").trim(),
    order_index: index + 1,
  }));
  if (options.some((option) => !option.text_ar)) {
    await supabase.from("questions").delete().eq("id", question.id);
    redirect("/admin?error=Semua%20pilihan%20jawaban%20Arab%20harus%20diisi.");
  }
  const { data: insertedOptions, error: optionsError } = await supabase.from("answer_options").insert(options).select("id,label");
  if (optionsError || !insertedOptions) {
    await supabase.from("questions").delete().eq("id", question.id);
    redirect(`/admin?error=${encodeURIComponent(optionsError?.message || "Gagal menyimpan pilihan")}`);
  }
  const correctOption = insertedOptions.find((option: any) => option.label === correctLabel);
  const { error: keyError } = await supabase.from("question_answer_keys").insert({
    question_id: question.id, correct_option_id: correctOption?.id, explanation,
  });
  if (keyError) {
    await supabase.from("questions").delete().eq("id", question.id);
    redirect(`/admin?error=${encodeURIComponent(keyError.message)}`);
  }
  redirect("/admin?created=question");
}
