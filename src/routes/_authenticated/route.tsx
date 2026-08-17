import { createFileRoute, Outlet, redirect, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AppProvider, useApp } from "@/lib/app-context";
import { I18nProvider, useI18n, type I18nKey } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { canAccess, exitGuestMode, isGuestMode, roleLabel, type AppRole } from "@/lib/roles";
import {
  LayoutDashboard,
  Library,
  FilePlus2,
  Printer,
  RefreshCw,
  GraduationCap,
  Gamepad2,
  Timer,
  Trophy,
  ShieldCheck,
  LogOut,
  Wifi,
  WifiOff,
  Loader2,
  Languages,
  Moon,
  Sun,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      if (isGuestMode()) {
        return { user: null, role: "student" as AppRole, guest: true };
      }
      throw redirect({ to: "/auth" });
    }
    let role: AppRole = "student";
    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const roles = (roleRows ?? []).map((r) => r.role as AppRole);
    if (roles.includes("admin")) role = "admin";
    else if (roles.includes("teacher")) role = "teacher";
    else if (roles.includes("student")) role = "student";
    else role = (data.user.user_metadata?.["role"] as AppRole) ?? "teacher";
    return { user: data.user, role, guest: false };
  },
  component: AppLayout,
});

const NAV: { to: string; key: I18nKey; icon: typeof LayoutDashboard }[] = [
  { to: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { to: "/library", key: "library", icon: Library },
  { to: "/lms", key: "lms", icon: GraduationCap },
  { to: "/games", key: "games", icon: Gamepad2 },
  { to: "/challenges", key: "challenges", icon: Timer },
  { to: "/leaderboard", key: "leaderboard", icon: Trophy },
  { to: "/quiz-creator", key: "quizCreator", icon: FilePlus2 },
  { to: "/printables", key: "printables", icon: Printer },
  { to: "/sync", key: "sync", icon: RefreshCw },
  { to: "/admin", key: "admin", icon: ShieldCheck },
];

function AppLayout() {
  const { user, role, guest } = Route.useRouteContext();
  return (
    <I18nProvider>
      <AppProvider
        userId={user?.id ?? null}
        userEmail={user?.email ?? null}
        role={role}
        guest={guest}
      >
        <SidebarProvider>
          <Shell />
        </SidebarProvider>
      </AppProvider>
    </I18nProvider>
  );
}

function Shell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { online, setOnline, userEmail, pendingQueue, syncing, role, guest } = useApp();
  const { t, lang, toggleLang } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const items = NAV.filter((n) => canAccess(role, n.to));
  const activeKey = items.find((n) => n.to === pathname)?.key;

  async function handleLogout() {
    exitGuestMode();
    await supabase.auth.signOut();
    localStorage.removeItem("sermo-lang");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="gap-3 px-3 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-lg">
              📚
            </span>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold">{t("appName")}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {guest ? t("guest") : roleLabel(role)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <Button variant="outline" size="sm" className="h-8 flex-1 gap-1" onClick={toggleLang}>
              <Languages className="size-3.5" />
              {lang === "en" ? "EN · अ" : "अ · EN"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={toggleTheme}
              aria-label={t("theme")}
            >
              {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t("classroom")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={pathname === item.to} tooltip={t(item.key)}>
                      <Link to={item.to}>
                        <item.icon />
                        <span>{t(item.key)}</span>
                        {item.to === "/sync" && pendingQueue.length > 0 && (
                          <Badge className="ml-auto">{pendingQueue.length}</Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="gap-2 group-data-[collapsible=icon]:hidden">
          <p className="truncate px-2 text-xs text-sidebar-foreground/60">
            {guest ? t("guestBanner") : userEmail}
          </p>
          <Button variant="destructive" size="sm" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="size-4" /> 🚪 {t("signOut")}
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="surface-paper w-full max-w-full overflow-x-hidden">
        <div
          className={`flex w-full flex-wrap items-center justify-between gap-2 border-b px-4 py-2 text-sm ${
            online
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "bg-amber-500/15 text-amber-800 dark:text-amber-300"
          }`}
        >
          <span className="flex min-w-0 items-center gap-2 font-medium">
            🌐 {t("networkStatus")}
            <Switch checked={online} onCheckedChange={setOnline} aria-label={t("networkStatus")} />
          </span>
          <span className="flex items-center gap-2 rounded-full border border-current/30 px-3 py-1 text-xs font-semibold">
            {online ? (
              <>
                <span className="relative flex size-2 shrink-0">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                🟢 {t("onlineFull")}
              </>
            ) : (
              <>🟡 {t("offlineFull")}</>
            )}
          </span>
          {pendingQueue.length > 0 && canAccess(role, "/sync") && (
            <Link to="/sync">
              <Badge variant="secondary">
                {pendingQueue.length} {t("itemsPendingSync")}
              </Badge>
            </Link>
          )}
        </div>
        {syncing && (
          <div className="flex items-center gap-3 border-b bg-background/90 px-4 py-3 text-sm font-medium">
            <Loader2 className="size-4 animate-spin text-primary" />
            {t("syncing")}
          </div>
        )}
        <header className="sticky top-0 z-10 w-full border-b bg-background/80 px-4 py-2 backdrop-blur">
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <SidebarTrigger className="shrink-0" />
              <h2 className="truncate text-base font-semibold">
                {activeKey
                  ? t(activeKey)
                  : pathname.startsWith("/quiz/")
                    ? t("quizPlayer")
                    : t("dashboard")}
              </h2>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Badge variant={online ? "default" : "secondary"} className="gap-1">
                {online ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
                {online ? t("online") : t("offline")}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setOnline(!online)}>
                {online ? t("goOffline") : t("goOnline")}
              </Button>
              <Button variant="ghost" size="icon" className="size-8" onClick={toggleTheme} aria-label={t("theme")}>
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            </div>
          </div>
        </header>
        <main className="w-full flex-1 px-4 py-4 md:px-6 md:py-6">
          <Outlet />
        </main>
      </SidebarInset>
    </>
  );
}
