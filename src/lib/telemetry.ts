import { supabase } from "@/integrations/supabase/client";

/** Live datastream logging — every completed quiz and mini-game round. */

export async function logQuizSubmission(row: {
  userId: string | null;
  quizId: string;
  quizTitle: string;
  subject?: string;
  topic?: string | null;
  classLevel?: string;
  correct: number;
  total: number;
  durationSec?: number;
}) {
  if (!row.userId) return;
  const accuracy = row.total > 0 ? Math.round((row.correct / row.total) * 100) : 0;
  await supabase.from("quiz_submissions").insert({
    user_id: row.userId,
    quiz_id: row.quizId,
    quiz_title: row.quizTitle,
    subject: row.subject ?? "General",
    topic: row.topic ?? null,
    class_level: row.classLevel ?? "Class 1",
    correct_count: row.correct,
    total_count: row.total,
    accuracy,
    duration_sec: row.durationSec ?? 0,
  });
}

export async function logGameSession(row: {
  userId: string | null;
  moduleKey: string;
  moduleLabel: string;
  subject?: string;
  classLevel?: string;
  score: number;
  durationSec?: number;
}) {
  if (!row.userId) return;
  await supabase.from("student_game_sessions").insert({
    user_id: row.userId,
    module_key: row.moduleKey,
    module_label: row.moduleLabel,
    subject: row.subject ?? "General",
    class_level: row.classLevel ?? "Class 1",
    score: row.score,
    duration_sec: row.durationSec ?? 0,
  });
}
