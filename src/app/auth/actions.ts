"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) redirect("/login?error=Lengkapi%20email%20dan%20password.");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!fullName || !email || password.length < 8) {
    redirect("/register?error=Nama%20dan%20email%20wajib%20diisi.%20Password%20minimal%208%20karakter.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) redirect(`/register?error=${encodeURIComponent(error.message)}`);
  if (data.session) redirect("/dashboard");
  redirect("/login?registered=1");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
