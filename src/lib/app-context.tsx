import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/lib/roles";
import {
  clearPendingQueue,
  enqueuePendingQuiz,
  loadPendingQueue,
  subscribePendingQueue,
  type PendingQuiz,
} from "@/lib/pending-sync";

type AppState = {
  online: boolean;
  setOnline: (v: boolean) => void;
  userId: string | null;
  userEmail: string | null;
  role: AppRole;
  guest: boolean;
  /** Class the student registered with; null for staff accounts. */
  registeredClass: string | null;
  /** True when the signed-in account may only see its own registered class. */
  classLocked: boolean;
  pendingQueue: PendingQuiz[];
  queueQuiz: (title: string, payload: Record<string, unknown>) => void;
  syncing: boolean;
  syncNow: () => Promise<void>;
};

// Route code-splitting can evaluate this module more than once (main graph +
// `?tsr-split=component` chunk). Keep a single context instance on globalThis
// so provider and consumer always match.
const g = globalThis as typeof globalThis & {
  __rglbAppCtx?: React.Context<AppState | null>;
};
const AppCtx = (g.__rglbAppCtx ??= createContext<AppState | null>(null));

export function AppProvider({
  userId,
  userEmail,
  role = "teacher",
  guest = false,
  registeredClass = null,
  children,
}: {
  userId: string | null;
  userEmail: string | null;
  role?: AppRole;
  guest?: boolean;
  registeredClass?: string | null;
  children: ReactNode;
}) {
  const [online, setOnlineState] = useState(true);
  const [pendingQueue, setPendingQueue] = useState<PendingQuiz[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("rglb-online");
    if (stored !== null) setOnlineState(stored === "true");
    setPendingQueue(loadPendingQueue());
    return subscribePendingQueue(() => setPendingQueue(loadPendingQueue()));
  }, []);

  const syncNow = useCallback(async () => {
    const items = loadPendingQueue();
    if (items.length === 0 || syncing) return;
    setSyncing(true);
    try {
      for (const item of items) {
        const { error } = await supabase.from("quizzes").insert(item.payload as never);
        if (error) throw error;
      }
      clearPendingQueue();
      toast.success("🎉 Data Synchronization Successful! Cloud and Local systems are perfectly aligned.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sync failed — records kept locally.");
    } finally {
      setSyncing(false);
    }
  }, [syncing]);

  const setOnline = useCallback(
    (v: boolean) => {
      setOnlineState(v);
      localStorage.setItem("rglb-online", String(v));
      if (v) void syncNow();
    },
    [syncNow],
  );

  const queueQuiz = useCallback((title: string, payload: Record<string, unknown>) => {
    enqueuePendingQuiz(title, payload);
  }, []);

  const classLocked = role === "student" && Boolean(registeredClass);

  const value = useMemo<AppState>(
    () => ({
      online,
      setOnline,
      userId,
      userEmail,
      role,
      guest,
      registeredClass,
      classLocked,
      pendingQueue,
      queueQuiz,
      syncing,
      syncNow,
    }),
    [online, setOnline, userId, userEmail, role, guest, registeredClass, classLocked, pendingQueue, queueQuiz, syncing, syncNow],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
