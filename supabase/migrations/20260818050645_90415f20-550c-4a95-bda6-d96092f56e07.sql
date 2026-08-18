CREATE TABLE public.student_game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_key text NOT NULL,
  module_label text NOT NULL,
  subject text NOT NULL DEFAULT 'General',
  class_level text NOT NULL DEFAULT 'Class 1',
  score integer NOT NULL DEFAULT 0,
  duration_sec integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.student_game_sessions TO authenticated;
GRANT ALL ON public.student_game_sessions TO service_role;
ALTER TABLE public.student_game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessions insert own" ON public.student_game_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sessions read own" ON public.student_game_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "sessions read staff" ON public.student_game_sessions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.quiz_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  quiz_id text NOT NULL,
  quiz_title text NOT NULL,
  subject text NOT NULL DEFAULT 'General',
  topic text,
  class_level text NOT NULL DEFAULT 'Class 1',
  correct_count integer NOT NULL DEFAULT 0,
  total_count integer NOT NULL DEFAULT 0,
  accuracy integer NOT NULL DEFAULT 0,
  duration_sec integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.quiz_submissions TO authenticated;
GRANT ALL ON public.quiz_submissions TO service_role;
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "submissions insert own" ON public.quiz_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "submissions read own" ON public.quiz_submissions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "submissions read staff" ON public.quiz_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));