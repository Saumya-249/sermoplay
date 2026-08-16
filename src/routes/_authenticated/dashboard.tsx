import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Download, HardDrive, CloudUpload, Gamepad2, Check } from "lucide-react";

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
  const qc = useQueryClient();

  const games = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data, error } = await supabase.from("games").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const downloads = useQuery({
    queryKey: ["downloads", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("downloads").select("*");
      if (error) throw error;
      return data;
    },
  });

  const pending = useQuery({
    queryKey: ["sync_queue", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("sync_queue").select("*").eq("status", "pending");
      if (error) throw error;
      return data;
    },
  });

  const download = useMutation({
    mutationFn: async (gameId: string) => {
      if (!online) throw new Error("You are offline — connect to download new games.");
      const { error } = await supabase
        .from("downloads")
        .insert({ user_id: userId!, game_id: gameId, status: "downloaded", progress: 100 });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Game downloaded for offline use");
      qc.invalidateQueries({ queryKey: ["downloads"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const downloadedIds = new Set((downloads.data ?? []).map((d) => d.game_id));
  const storageUsed = (games.data ?? [])
    .filter((g) => downloadedIds.has(g.id))
    .reduce((sum, g) => sum + Number(g.size_mb), 0);
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
        <Stat icon={<Gamepad2 className="size-4" />} label="Games in library" value={String(games.data?.length ?? 0)} />
        <Stat icon={<Download className="size-4" />} label="Downloaded offline" value={String(downloadedIds.size)} />
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
            <CardTitle>Available for download</CardTitle>
            <CardDescription>Regional-language games ready to store on this device.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(games.data ?? []).slice(0, 6).map((g) => {
              const done = downloadedIds.has(g.id);
              return (
                <div
                  key={g.id}
                  className="flex items-center gap-3 rounded-lg border bg-card p-3"
                >
                  <span className="text-2xl">{g.cover_emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{g.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {g.language} · {g.subject} · {g.class_level} · {Number(g.size_mb).toFixed(1)} MB
                    </p>
                  </div>
                  {done ? (
                    <Badge variant="secondary" className="gap-1">
                      <Check className="size-3" /> Offline
                    </Badge>
                  ) : (
                    <Button size="sm" onClick={() => download.mutate(g.id)} disabled={download.isPending}>
                      <Download className="size-4" /> Download
                    </Button>
                  )}
                </div>
              );
            })}
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