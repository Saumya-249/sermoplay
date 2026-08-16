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
  pendingQueue: PendingQuiz[];
  queueQuiz: (title: string, payload: Record<string, unknown>) => void;
  syncing: boolean;
  syncNow: () => Promise<void>;
};

const AppCtx = createContext<AppState | null>(null);

export function AppProvider({
  userId,
  userEmail,
  children,
}: {
  userId: string | null;
  userEmail: string | null;
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

  const value = useMemo<AppState>(
    () => ({ online, setOnline, userId, userEmail, pendingQueue, queueQuiz, syncing, syncNow }),
    [online, setOnline, userId, userEmail, pendingQueue, queueQuiz, syncing, syncNow],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
