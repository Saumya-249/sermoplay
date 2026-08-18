import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-context";
import { useI18n } from "@/lib/i18n";
import { canAccess } from "@/lib/roles";
import { localizeGameText } from "@/lib/game-i18n";
import { WORKING_GAME_LIBRARY } from "@/lib/working-games";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HardDrive, CloudUpload, Gamepad2, Play } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | Sermo Play" },
      {
        name: "description",
        content: "Download classroom games, track offline storage and monitor pending cloud sync.",
      },
      { property: "og:title", content: "Teacher Dashboard | Sermo Play" },
      { property: "og:description", content: "Download classroom games, track offline storage and monitor pending cloud sync." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { userId, online, role, guest } = useApp();
  const { t, lang } = useI18n();
  const showSync = canAccess(role, "/sync");
  const games = WORKING_GAME_LIBRARY;

  const pending = useQuery({
    queryKey: ["sync_queue", userId],
    enabled: Boolean(userId) && showSync,
    queryFn: async () => {
      const { data, error } = await supabase.from("sync_queue").select("*").eq("status", "pending");
      if (error) throw error;
      return data;
    },
  });

  const totalQuestions = games.reduce((sum, g) => sum + g.questions.length, 0);
  const storageUsed = Math.round(totalQuestions * 0.02 * 10) / 10;
  const quota = 128;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {t("greeting")} {guest ? t("guest") : role === "admin" ? t("administrator") : role === "teacher" ? t("teacher") : t("student")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("greetingSub")}</p>
        {guest && (
          <p className="mt-2 inline-block rounded-md bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">
            {t("guestBanner")}
          </p>
        )}
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Gamepad2 className="size-4" />} label={t("totalGames")} value={String(games.length)} />
        <Stat icon={<Play className="size-4" />} label={t("playableQuestions")} value={String(totalQuestions)} />
        <Stat
          icon={<HardDrive className="size-4" />}
          label={t("storageUsed")}
          value={`${storageUsed.toFixed(1)} MB`}
        />
        {showSync && (
          <Stat
            icon={<CloudUpload className="size-4" />}
            label={t("pendingItems")}
            value={String(pending.data?.length ?? 0)}
          />
        )}
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("readyOffline")}</CardTitle>
            <CardDescription className="text-balance">{t("readyOfflineSub")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {games.slice(0, 6).map((g) => (
                <div
                  key={g.id}
                  className="flex items-center gap-3 rounded-lg border bg-card p-3"
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{localizeGameText(g.title, lang)}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {localizeGameText(
                        `${g.language} · ${g.subject} · ${g.classLevel} · ${g.questions.length} questions`,
                        lang,
                      )}
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link to="/quiz/$id" params={{ id: g.id }}>
                      <Play className="size-4" /> {t("play")}
                    </Link>
                  </Button>
                </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/library">{t("browseLibrary")}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>{t("syncStatus")}</CardTitle>
            <CardDescription>{online ? t("connectedCloud") : t("workingOffline")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>{t("deviceStorage")}</span>
                <span>
                  {storageUsed.toFixed(1)} / {quota} MB
                </span>
              </div>
              <Progress value={(storageUsed / quota) * 100} />
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <p className="font-medium">{pending.data?.length ?? 0} {t("recordsQueued")}</p>
              <p className="text-xs text-muted-foreground">
                {t("syncNote")}
              </p>
            </div>
            {showSync && (
              <Button asChild variant="secondary" className="w-full">
                <Link to="/sync">{t("openSyncPanel")}</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {icon}
          {label}
        </div>
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}