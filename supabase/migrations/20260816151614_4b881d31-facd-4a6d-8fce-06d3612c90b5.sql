CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  name text NOT NULL DEFAULT 'Teacher',
  email text,
  school text,
  role text NOT NULL DEFAULT 'teacher',
  preferred_language text NOT NULL DEFAULT 'Hindi',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  language text NOT NULL,
  subject text NOT NULL,
  class_level text NOT NULL,
  topic text,
  difficulty text NOT NULL DEFAULT 'Easy',
  game_type text NOT NULL DEFAULT 'Quiz',
  duration_min integer NOT NULL DEFAULT 15,
  size_mb numeric NOT NULL DEFAULT 4.0,
  cover_emoji text NOT NULL DEFAULT '🎲',
  file_path text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.games TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.games TO authenticated;
GRANT ALL ON public.games TO service_role;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "games public read" ON public.games FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "games insert own" ON public.games FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "games update own" ON public.games FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "games delete own" ON public.games FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE TABLE public.quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  language text NOT NULL DEFAULT 'Hindi',
  subject text NOT NULL DEFAULT 'General',
  class_level text NOT NULL DEFAULT 'Class 5',
  topic text,
  difficulty text NOT NULL DEFAULT 'Easy',
  duration_min integer NOT NULL DEFAULT 10,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_published boolean NOT NULL DEFAULT false,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quizzes TO authenticated;
GRANT ALL ON public.quizzes TO service_role;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quizzes read published or own" ON public.quizzes FOR SELECT TO authenticated USING (is_published OR auth.uid() = created_by);
CREATE POLICY "quizzes insert own" ON public.quizzes FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "quizzes update own" ON public.quizzes FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "quizzes delete own" ON public.quizzes FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE TABLE public.downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  game_id uuid NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'downloaded',
  progress integer NOT NULL DEFAULT 100,
  downloaded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, game_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.downloads TO authenticated;
GRANT ALL ON public.downloads TO service_role;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "downloads own" ON public.downloads FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.sync_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entity_type text NOT NULL,
  entity_label text,
  action text NOT NULL DEFAULT 'create',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  synced_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sync_queue TO authenticated;
GRANT ALL ON public.sync_queue TO service_role;
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sync own" ON public.sync_queue FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.games (title, description, language, subject, class_level, topic, difficulty, game_type, duration_min, size_mb, cover_emoji) VALUES
('मंडी का गणित', 'Village market maths using local produce prices.', 'Hindi', 'Maths', 'Class 4', 'Addition & Money', 'Easy', 'Quiz', 15, 3.2, '🥭'),
('शब्द सीढ़ी', 'Word ladder game with everyday Hindi vocabulary.', 'Hindi', 'Language', 'Class 3', 'Vocabulary', 'Easy', 'Word Puzzle', 10, 2.4, '🪜'),
('பயிர் கணிதம்', 'Crop counting and multiplication with Tamil farm contexts.', 'Tamil', 'Maths', 'Class 5', 'Multiplication', 'Medium', 'Matching', 20, 4.1, '🌾'),
('விலங்குகள் விளையாட்டு', 'Match Tamil animal names with pictures and sounds.', 'Tamil', 'Science', 'Class 2', 'Animals', 'Easy', 'Flashcards', 12, 5.6, '🐘'),
('ಬೆಳೆ ವಿಜ್ಞಾನ', 'Kannada science game about soil, seeds and seasons.', 'Kannada', 'Science', 'Class 6', 'Plants & Soil', 'Medium', 'Quiz', 18, 3.9, '🌱'),
('ಸಂಖ್ಯೆ ಸೇತುವೆ', 'Kannada number bridge for fractions practice.', 'Kannada', 'Maths', 'Class 6', 'Fractions', 'Hard', 'Puzzle', 25, 4.8, '🌉'),
('গ্রামের গল্প', 'Bengali reading comprehension set in a village fair.', 'Bengali', 'Language', 'Class 5', 'Reading', 'Medium', 'Story Quiz', 20, 6.2, '📖'),
('নদী ও জলবায়ু', 'Bengali geography game on rivers and monsoon.', 'Bengali', 'Social Studies', 'Class 7', 'Rivers', 'Medium', 'Map Quiz', 22, 7.4, '🌊'),
('पीक आणि पाणी', 'Marathi true/false activity on irrigation and crops.', 'Marathi', 'Science', 'Class 5', 'Water Cycle', 'Easy', 'True/False', 12, 2.8, '💧'),
('गणित बाजार', 'Marathi shopkeeper maths with rupees and change.', 'Marathi', 'Maths', 'Class 3', 'Subtraction', 'Easy', 'Quiz', 15, 3.1, '🪙'),
('పంట పజిల్', 'Telugu crossword on crops, tools and seasons.', 'Telugu', 'Social Studies', 'Class 6', 'Agriculture', 'Hard', 'Crossword', 25, 5.0, '🧩'),
('తెలుగు అక్షరాలు', 'Telugu alphabet tracing and matching for early grades.', 'Telugu', 'Language', 'Class 1', 'Alphabet', 'Easy', 'Matching', 10, 2.2, '🔤');