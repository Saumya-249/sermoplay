DROP POLICY "sessions read staff" ON public.student_game_sessions;
DROP POLICY "submissions read staff" ON public.quiz_submissions;
CREATE POLICY "sessions read staff" ON public.student_game_sessions FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('teacher','admin')));
CREATE POLICY "submissions read staff" ON public.quiz_submissions FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('teacher','admin')));