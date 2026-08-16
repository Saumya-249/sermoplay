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
import { AppProvider, useApp } from "@/lib/app-context";
import {
  LayoutDashboard,
  Library,
  FilePlus2,
  Printer,
  RefreshCw,
  LogOut,
  Wifi,
  WifiOff,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AppLayout,
});

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/library", label: "Game Library", icon: Library },
  { to: "/quiz-creator", label: "Quiz Creator", icon: FilePlus2 },
  { to: "/printables", label: "Printable Hub", icon: Printer },
  { to: "/sync", label: "Sync Panel", icon: RefreshCw },
] as const;

function AppLayout() {
  const { user } = Route.useRouteContext();
  return (
    <AppProvider userId={user.id} userEmail={user.email ?? null}>
      <SidebarProvider>
        <Shell />
      </SidebarProvider>
    </AppProvider>
  );
}

function Shell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { online, setOnline, userEmail } = useApp();

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="px-3 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-lg">
              📚
            </span>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold">Game Library</p>
              <p className="truncate text-xs text-sidebar-foreground/60">Regional-language</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Classroom</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={pathname === item.to} tooltip={item.label}>
                      <Link to={item.to}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="gap-2 group-data-[collapsible=icon]:hidden">
          <p className="truncate px-2 text-xs text-sidebar-foreground/60">{userEmail}</p>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
          >
            <LogOut className="size-4" /> Sign out
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="surface-paper">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
          <h2 className="text-base font-semibold">
            {NAV.find((n) => n.to === pathname)?.label ??
              (pathname.startsWith("/quiz/") ? "Quiz Player" : "Dashboard")}
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant={online ? "default" : "secondary"} className="gap-1">
              {online ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
              {online ? "Online" : "Offline"}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setOnline(!online)}>
              {online ? "Go offline" : "Go online"}
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </>
  );
}