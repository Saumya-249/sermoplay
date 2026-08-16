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

export const OFFLINE_SCORE_KEY = "offline_score_history";

export function loadOfflineScores(): QuizResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(OFFLINE_SCORE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as QuizResult[]) : [];
  } catch {
    return [];
  }
}

export function saveOfflineScore(result: QuizResult): QuizResult[] {
  const next = [result, ...loadOfflineScores()].slice(0, 100);
  window.localStorage.setItem(OFFLINE_SCORE_KEY, JSON.stringify(next));
  return next;
}
