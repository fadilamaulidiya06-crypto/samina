-- Contoh materi awal Sami'na: التَّعَارُفُ
-- Jalankan setelah schema.sql.

insert into public.lessons (id, title, slug, topic, description, script_ar, script_id, voice_locale, speech_rate, order_index, is_published)
values (
  '11111111-1111-4111-8111-111111111111',
  'Latihan Istima’ 1 — Perkenalan',
  'taaruf',
  'التَّعَارُفُ',
  'Dengarkan percakapan Ahmad dan Ali, kemudian jawab pertanyaan berdasarkan informasi yang kamu dengar.',
  E'أَحْمَدُ: السَّلَامُ عَلَيْكُمْ، مَا اسْمُكَ؟\nعَلِيٌّ: وَعَلَيْكُمُ السَّلَامُ، اسْمِي عَلِيٌّ.\nأَحْمَدُ: مِنْ أَيْنَ أَنْتَ؟\nعَلِيٌّ: أَنَا مِنْ إِنْدُونِيسِيَا.',
  E'Ahmad: Assalamu’alaikum, siapa namamu?\nAli: Wa’alaikumussalam, namaku Ali.\nAhmad: Dari mana asalmu?\nAli: Saya dari Indonesia.',
  'ar-SA', 0.85, 1, true
)
on conflict (slug) do nothing;

insert into public.questions (id, lesson_id, prompt_ar, prompt_id, order_index) values
('22222222-2222-4222-8222-222222222221', '11111111-1111-4111-8111-111111111111', 'مَا اسْمُ الْفَتَى الَّذِي أَجَابَ أَحْمَدَ؟', 'Siapakah nama anak laki-laki yang menjawab Ahmad?', 1),
('22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', 'مِنْ أَيْنَ عَلِيٌّ؟', 'Dari mana Ali berasal?', 2),
('22222222-2222-4222-8222-222222222223', '11111111-1111-4111-8111-111111111111', 'مَاذَا سَأَلَ أَحْمَدُ فِي بِدَايَةِ الْحِوَارِ؟', 'Apa yang ditanyakan Ahmad kepada Ali pada awal percakapan?', 3)
on conflict (id) do nothing;

insert into public.answer_options (id, question_id, label, text_ar, text_id, order_index) values
('33333333-3333-4333-8333-333333333331', '22222222-2222-4222-8222-222222222221', 'A', 'أَحْمَدُ', 'Ahmad', 1),
('33333333-3333-4333-8333-333333333332', '22222222-2222-4222-8222-222222222221', 'B', 'عَلِيٌّ', 'Ali', 2),
('33333333-3333-4333-8333-333333333333', '22222222-2222-4222-8222-222222222221', 'C', 'مُحَمَّدٌ', 'Muhammad', 3),
('33333333-3333-4333-8333-333333333334', '22222222-2222-4222-8222-222222222221', 'D', 'حَسَنٌ', 'Hasan', 4),
('33333333-3333-4333-8333-333333333335', '22222222-2222-4222-8222-222222222222', 'A', 'مِنْ مِصْرَ', 'Dari Mesir', 1),
('33333333-3333-4333-8333-333333333336', '22222222-2222-4222-8222-222222222222', 'B', 'مِنَ الْمَالِيزِيَا', 'Dari Malaysia', 2),
('33333333-3333-4333-8333-333333333337', '22222222-2222-4222-8222-222222222222', 'C', 'مِنْ إِنْدُونِيسِيَا', 'Dari Indonesia', 3),
('33333333-3333-4333-8333-333333333338', '22222222-2222-4222-8222-222222222222', 'D', 'مِنَ السُّعُودِيَّةِ', 'Dari Arab Saudi', 4),
('33333333-3333-4333-8333-333333333339', '22222222-2222-4222-8222-222222222223', 'A', 'عَنْ اسْمِ عَلِيٍّ', 'Tentang nama Ali', 1),
('33333333-3333-4333-8333-333333333340', '22222222-2222-4222-8222-222222222223', 'B', 'عَنْ عُمْرِ عَلِيٍّ', 'Tentang umur Ali', 2),
('33333333-3333-4333-8333-333333333341', '22222222-2222-4222-8222-222222222223', 'C', 'عَنْ هِوَايَةِ عَلِيٍّ', 'Tentang hobi Ali', 3),
('33333333-3333-4333-8333-333333333342', '22222222-2222-4222-8222-222222222223', 'D', 'عَنْ مَكَانِ سَكَنِ عَلِيٍّ', 'Tentang tempat tinggal Ali', 4)
on conflict (id) do nothing;

insert into public.question_answer_keys (question_id, correct_option_id, explanation) values
('22222222-2222-4222-8222-222222222221', '33333333-3333-4333-8333-333333333332', 'Ali memperkenalkan dirinya dengan mengatakan اسْمِي عَلِيٌّ yang berarti “Namaku Ali”.'),
('22222222-2222-4222-8222-222222222222', '33333333-3333-4333-8333-333333333337', 'Ali mengatakan أَنَا مِنْ إِنْدُونِيسِيَا yang berarti “Saya dari Indonesia”.'),
('22222222-2222-4222-8222-222222222223', '33333333-3333-4333-8333-333333333339', 'Ahmad membuka percakapan dengan pertanyaan مَا اسْمُكَ؟ yang berarti “Siapa namamu?”.')
on conflict (question_id) do nothing;
