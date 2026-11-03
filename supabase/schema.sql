-- SAMI'NA DATABASE SCHEMA
-- Jalankan seluruh file ini di Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Siswa',
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  topic text not null,
  description text not null default '',
  script_ar text not null,
  script_id text not null default '',
  voice_locale text not null default 'ar-SA',
  speech_rate numeric(3,2) not null default 0.85,
  order_index integer not null default 1,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  prompt_ar text not null,
  prompt_id text not null,
  order_index integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.answer_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  label text not null check (label in ('A', 'B', 'C', 'D')),
  text_ar text not null,
  text_id text not null default '',
  order_index integer not null default 1,
  unique(question_id, label)
);

-- Kunci jawaban dipisahkan agar tidak dikirim ke browser sebelum evaluasi.
create table if not exists public.question_answer_keys (
  question_id uuid primary key references public.questions(id) on delete cascade,
  correct_option_id uuid not null references public.answer_options(id) on delete cascade,
  explanation text not null default ''
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  total_questions integer not null default 0,
  correct_answers integer not null default 0,
  score numeric(5,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option_id uuid references public.answer_options(id) on delete set null,
  is_correct boolean not null default false,
  unique(attempt_id, question_id)
);

create index if not exists lessons_published_order_idx on public.lessons(is_published, order_index);
create index if not exists questions_lesson_order_idx on public.questions(lesson_id, order_index);
create index if not exists attempts_user_created_idx on public.attempts(user_id, created_at desc);

-- Membuat profil otomatis saat user mendaftar melalui Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Siswa'), 'student')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Helper untuk policy admin tanpa recursive RLS pada profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.questions enable row level security;
alter table public.answer_options enable row level security;
alter table public.question_answer_keys enable row level security;
alter table public.attempts enable row level security;
alter table public.attempt_answers enable row level security;

-- Profiles
 drop policy if exists profiles_select_self_or_admin on public.profiles;
create policy profiles_select_self_or_admin on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());

-- Lessons
 drop policy if exists lessons_read_published_or_admin on public.lessons;
create policy lessons_read_published_or_admin on public.lessons for select to anon, authenticated
using (is_published = true or public.is_admin());
drop policy if exists lessons_admin_insert on public.lessons;
create policy lessons_admin_insert on public.lessons for insert to authenticated with check (public.is_admin());
drop policy if exists lessons_admin_update on public.lessons;
create policy lessons_admin_update on public.lessons for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists lessons_admin_delete on public.lessons;
create policy lessons_admin_delete on public.lessons for delete to authenticated using (public.is_admin());

-- Questions
 drop policy if exists questions_read_published_or_admin on public.questions;
create policy questions_read_published_or_admin on public.questions for select to anon, authenticated
using (public.is_admin() or exists (select 1 from public.lessons l where l.id = questions.lesson_id and l.is_published = true));
drop policy if exists questions_admin_insert on public.questions;
create policy questions_admin_insert on public.questions for insert to authenticated with check (public.is_admin());
drop policy if exists questions_admin_update on public.questions;
create policy questions_admin_update on public.questions for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists questions_admin_delete on public.questions;
create policy questions_admin_delete on public.questions for delete to authenticated using (public.is_admin());

-- Answer options: opsi boleh dibaca, tetapi kunci jawaban tidak berada di tabel ini.
 drop policy if exists options_read_published_or_admin on public.answer_options;
create policy options_read_published_or_admin on public.answer_options for select to anon, authenticated
using (public.is_admin() or exists (
  select 1 from public.questions q join public.lessons l on l.id = q.lesson_id
  where q.id = answer_options.question_id and l.is_published = true
));
drop policy if exists options_admin_insert on public.answer_options;
create policy options_admin_insert on public.answer_options for insert to authenticated with check (public.is_admin());
drop policy if exists options_admin_update on public.answer_options;
create policy options_admin_update on public.answer_options for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists options_admin_delete on public.answer_options;
create policy options_admin_delete on public.answer_options for delete to authenticated using (public.is_admin());

-- Answer keys hanya dapat dibaca/diubah admin. Fungsi evaluasi berjalan sebagai SECURITY DEFINER.
 drop policy if exists answer_keys_admin_all on public.question_answer_keys;
create policy answer_keys_admin_all on public.question_answer_keys for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Riwayat hanya dapat dibaca pemilik akun atau admin.
 drop policy if exists attempts_read_owner_or_admin on public.attempts;
create policy attempts_read_owner_or_admin on public.attempts for select to authenticated
using (user_id = auth.uid() or public.is_admin());
drop policy if exists attempt_answers_read_owner_or_admin on public.attempt_answers;
create policy attempt_answers_read_owner_or_admin on public.attempt_answers for select to authenticated
using (exists (select 1 from public.attempts a where a.id = attempt_id and (a.user_id = auth.uid() or public.is_admin())));

-- Hak akses API Supabase.
grant select on public.lessons, public.questions, public.answer_options to anon, authenticated;
grant select on public.profiles, public.attempts, public.attempt_answers to authenticated;
grant insert, update, delete on public.lessons, public.questions, public.answer_options to authenticated;
grant select, insert, update, delete on public.question_answer_keys to authenticated;

-- Pemeriksaan nilai di server/database. Kunci jawaban tidak dikirim sebelum submit.
create or replace function public.submit_lesson_attempt(p_lesson_id uuid, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_total integer;
  v_correct_count integer := 0;
  v_score numeric(5,2);
  v_attempt_id uuid;
  v_question record;
  v_selected_option_id uuid;
  v_selected_label text;
  v_selected_ar text;
  v_selected_id text;
  v_correct_option_id uuid;
  v_correct_label text;
  v_correct_ar text;
  v_correct_id text;
  v_selected_correct boolean;
  v_explanation text;
  v_review jsonb := '[]'::jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if not exists (select 1 from public.lessons where id = p_lesson_id and (is_published = true or public.is_admin())) then
    raise exception 'Lesson not found or not published';
  end if;

  select count(*) into v_total from public.questions where lesson_id = p_lesson_id;
  if v_total = 0 then raise exception 'No questions in this lesson'; end if;

  insert into public.attempts (user_id, lesson_id, total_questions, correct_answers, score)
  values (v_user_id, p_lesson_id, v_total, 0, 0)
  returning id into v_attempt_id;

  for v_question in
    select id, prompt_ar, prompt_id from public.questions
    where lesson_id = p_lesson_id order by order_index, created_at
  loop
    v_selected_option_id := null;
    v_selected_label := null;
    v_selected_ar := null;
    v_selected_id := null;
    v_correct_option_id := null;
    v_correct_label := null;
    v_correct_ar := null;
    v_correct_id := null;
    v_explanation := '';
    v_selected_correct := false;

    select nullif(answer_item->>'option_id', '')::uuid into v_selected_option_id
    from jsonb_array_elements(coalesce(p_answers, '[]'::jsonb)) as answer_items(answer_item)
    where answer_item->>'question_id' = v_question.id::text
    limit 1;

    if v_selected_option_id is not null then
      select id, label, text_ar, text_id
      into v_selected_option_id, v_selected_label, v_selected_ar, v_selected_id
      from public.answer_options
      where id = v_selected_option_id and question_id = v_question.id;
    end if;

    select ao.id, ao.label, ao.text_ar, ao.text_id, ak.explanation
    into v_correct_option_id, v_correct_label, v_correct_ar, v_correct_id, v_explanation
    from public.question_answer_keys ak
    join public.answer_options ao on ao.id = ak.correct_option_id
    where ak.question_id = v_question.id;

    if v_correct_option_id is null then raise exception 'Answer key missing for question %', v_question.id; end if;
    v_selected_correct := coalesce(v_selected_option_id = v_correct_option_id, false);
    if v_selected_correct then v_correct_count := v_correct_count + 1; end if;

    insert into public.attempt_answers (attempt_id, question_id, selected_option_id, is_correct)
    values (v_attempt_id, v_question.id, v_selected_option_id, v_selected_correct);

    v_review := v_review || jsonb_build_array(jsonb_build_object(
      'question_id', v_question.id,
      'prompt_ar', v_question.prompt_ar,
      'prompt_id', v_question.prompt_id,
      'is_correct', v_selected_correct,
      'selected_option', case when v_selected_option_id is null then null else jsonb_build_object('id', v_selected_option_id, 'label', v_selected_label, 'text_ar', v_selected_ar, 'text_id', v_selected_id) end,
      'correct_option', jsonb_build_object('id', v_correct_option_id, 'label', v_correct_label, 'text_ar', v_correct_ar, 'text_id', v_correct_id),
      'explanation', coalesce(v_explanation, '')
    ));
  end loop;

  v_score := round((v_correct_count::numeric / v_total::numeric) * 100, 2);
  update public.attempts set correct_answers = v_correct_count, score = v_score where id = v_attempt_id;

  return jsonb_build_object(
    'attempt_id', v_attempt_id,
    'total_questions', v_total,
    'correct_answers', v_correct_count,
    'wrong_answers', v_total - v_correct_count,
    'score', v_score,
    'review', v_review
  );
end;
$$;

revoke all on function public.submit_lesson_attempt(uuid, jsonb) from public;
grant execute on function public.submit_lesson_attempt(uuid, jsonb) to authenticated;
