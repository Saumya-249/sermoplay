export type PendingQuiz = {
  id: string;
  title: string;
  savedAt: string;
  payload: Record<string, unknown>;
};

export const PENDING_KEY = "pending_sync_queue";

const listeners = new Set<() => void>();

export function subscribePendingQueue(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function emit() {
  listeners.forEach((l) => l());
}

export function loadPendingQueue(): PendingQuiz[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as PendingQuiz[]) : [];
  } catch {
    return [];
  }
}

export function savePendingQueue(items: PendingQuiz[]) {
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(items));
  emit();
}

export function enqueuePendingQuiz(title: string, payload: Record<string, unknown>): PendingQuiz[] {
  const item: PendingQuiz = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: title || "Untitled quiz",
    savedAt: new Date().toISOString(),
    payload,
  };
  const next = [item, ...loadPendingQueue()];
  savePendingQueue(next);
  return next;
}

export function clearPendingQueue() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_KEY);
  emit();
}

export function removePendingQuiz(id: string) {
  savePendingQueue(loadPendingQueue().filter((i) => i.id !== id));
}
