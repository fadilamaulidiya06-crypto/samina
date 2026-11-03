import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  try {
    const { lessonId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });

    const body = await request.json();
    if (!Array.isArray(body.answers)) return NextResponse.json({ error: "Format jawaban tidak valid." }, { status: 400 });
    const { data, error } = await supabase.rpc("submit_lesson_attempt", {
      p_lesson_id: lessonId,
      p_answers: body.answers,
    });
    if (error) {
      console.error("submit_lesson_attempt:", error.message);
      return NextResponse.json({ error: "Jawaban belum dapat diperiksa. Pastikan database Supabase sudah disiapkan." }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Submit attempt error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat memeriksa jawaban." }, { status: 500 });
  }
}
