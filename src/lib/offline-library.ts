export const LIBRARY_CACHE_KEY = "offline_library_cache";

export type LibraryCache = {
  games: unknown[];
  quizzes: unknown[];
  cachedAt: string;
};

function read(): LibraryCache {
  if (typeof window === "undefined") return { games: [], quizzes: [], cachedAt: "" };
  try {
    const raw = window.localStorage.getItem(LIBRARY_CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object") return { games: [], quizzes: [], cachedAt: "" };
    return {
      games: Array.isArray(parsed.games) ? parsed.games : [],
      quizzes: Array.isArray(parsed.quizzes) ? parsed.quizzes : [],
      cachedAt: typeof parsed.cachedAt === "string" ? parsed.cachedAt : "",
    };
  } catch {
    return { games: [], quizzes: [], cachedAt: "" };
  }
}

export function loadLibraryCache(): LibraryCache {
  return read();
}

export function cacheLibrarySection(section: "games" | "quizzes", rows: unknown[]) {
  if (typeof window === "undefined") return;
  const current = read();
  const next: LibraryCache = { ...current, [section]: rows, cachedAt: new Date().toISOString() };
  window.localStorage.setItem(LIBRARY_CACHE_KEY, JSON.stringify(next));
}

export function cachedGames(): unknown[] {
  return read().games;
}

export function cachedQuizzes(): unknown[] {
  return read().quizzes;
}

export function cachedQuizById(id: string): Record<string, unknown> | null {
  const found = read().quizzes.find(
    (q) => (q as { id?: string } | null)?.id === id,
  );
  return (found as Record<string, unknown>) ?? null;
}
