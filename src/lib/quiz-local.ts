export type QuizResult = {
  quizId: string;
  quizTitle: string;
  score: number;
  correct: number;
  total: number;
  lang: "en" | "hi";
  completedAt: string;
};

const KEY = "rglb-quiz-results";

export function loadResults(): QuizResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QuizResult[]) : [];
  } catch {
    return [];
  }
}

export function saveResult(result: QuizResult): QuizResult[] {
  const next = [result, ...loadResults()].slice(0, 100);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
