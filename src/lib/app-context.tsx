import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AppState = {
  online: boolean;
  setOnline: (v: boolean) => void;
  userId: string | null;
  userEmail: string | null;
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

  useEffect(() => {
    const stored = localStorage.getItem("rglb-online");
    if (stored !== null) setOnlineState(stored === "true");
  }, []);

  const value = useMemo<AppState>(
    () => ({
      online,
      setOnline: (v: boolean) => {
        setOnlineState(v);
        localStorage.setItem("rglb-online", String(v));
      },
      userId,
      userEmail,
    }),
    [online, userId, userEmail],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}