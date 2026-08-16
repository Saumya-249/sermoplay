import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-context";
import { WORKING_GAME_LIBRARY } from "@/lib/working-games";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HardDrive, CloudUpload, Gamepad2, Play } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | Regional-Language Game Library" },
      {
        name: "description",
        content: "Download classroom games, track offline storage and monitor pending cloud sync.",
      },
      { property: "og:title", content: "Teacher Dashboard | Regional-Language Game Library" },
      { property: "og:description", content: "Downloads, offline storage and sync status in one place." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { userId, online } = useApp();
  const games = WORKING_GAME_LIBRARY;

  const pending = useQuery({
    queryKey: ["sync_queue", userId],
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
        <h1 className="text-2xl font-bold">Namaste, teacher 👋</h1>
        <p className="text-sm text-muted-foreground">
          Download once, teach anywhere — even without internet.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Gamepad2 className="size-4" />} label="Total games available" value={String(games.length)} />
        <Stat icon={<Play className="size-4" />} label="Playable questions" value={String(totalQuestions)} />
        <Stat
          icon={<HardDrive className="size-4" />}
          label="Local storage used"
          value={`${storageUsed.toFixed(1)} MB`}
        />
        <Stat
          icon={<CloudUpload className="size-4" />}
          label="Pending sync items"
          value={String(pending.data?.length ?? 0)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ready to play offline</CardTitle>
            <CardDescription>Every game is bundled on this device — tap play to start instantly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {games.slice(0, 6).map((g) => (
                <div
                  key={g.id}
                  className="flex items-center gap-3 rounded-lg border bg-card p-3"
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{g.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {g.language} · {g.subject} · {g.classLevel} · {g.questions.length} questions
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link to="/quiz/$id" params={{ id: g.id }}>
                      <Play className="size-4" /> Play
                    </Link>
                  </Button>
                </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/library">Browse full library</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Offline sync status</CardTitle>
            <CardDescription>{online ? "Connected to cloud" : "Working offline"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Device storage</span>
                <span>
                  {storageUsed.toFixed(1)} / {quota} MB
                </span>
              </div>
              <Progress value={(storageUsed / quota) * 100} />
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <p className="font-medium">{pending.data?.length ?? 0} records queued</p>
              <p className="text-xs text-muted-foreground">
                Scores, quizzes and downloads recorded offline upload automatically once connectivity returns.
              </p>
            </div>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/sync">Open sync panel</Link>
            </Button>
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