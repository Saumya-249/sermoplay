import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { CloudUpload, WifiOff, Wifi, Trash2, PlusCircle, Loader2 } from "lucide-react";
import { removePendingQuiz } from "@/lib/pending-sync";

export const Route = createFileRoute("/_authenticated/sync")({
  beforeLoad: ({ context }) => {
    const role = (context as { role?: string }).role;
    if (role !== "teacher" && role !== "admin") throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Sync Panel | Sermo Play" },
      {
        name: "description",
        content: "Simulate offline mode, inspect the local data queue and push queued classroom records to the cloud.",
      },
      { property: "og:title", content: "Sync Panel | Sermo Play" },
      { property: "og:description", content: "Simulate offline mode, inspect the local data queue and push queued classroom records to the cloud." },
    ],
  }),
  component: SyncPanel,
});

const SAMPLE = [
  { entity_type: "score", label: "Class 5 – मंडी का गणित results" },
  { entity_type: "attendance", label: "Class 3 attendance" },
  { entity_type: "quiz", label: "Draft quiz: शब्द सीढ़ी" },
  { entity_type: "usage", label: "Session log – 22 students" },
];

function SyncPanel() {
  const { userId, online, setOnline, pendingQueue, syncing: localSyncing, syncNow } = useApp();
  const qc = useQueryClient();
  const [progress, setProgress] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const queue = useQuery({
    queryKey: ["sync_queue", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sync_queue")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const items = queue.data ?? [];
  const pending = items.filter((i) => i.status === "pending");

  async function addSample() {
    const sample = SAMPLE[Math.floor(Math.random() * SAMPLE.length)]!;
    const { error } = await supabase.from("sync_queue").insert({
      user_id: userId!,
      entity_type: sample.entity_type,
      entity_label: sample.label,
      action: "create",
      payload: { recorded_offline: !online, at: new Date().toISOString() },
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Record stored locally and queued");
    qc.invalidateQueries({ queryKey: ["sync_queue"] });
  }

  async function runSync() {
    if (!online) {
      toast.error("No connectivity — turn on the network to sync.");
      return;
    }
    if (pending.length === 0) {
      toast.info("Nothing to sync — everything is up to date.");
      return;
    }
    setSyncing(true);
    setProgress(0);
    for (let i = 0; i < pending.length; i++) {
      await new Promise((r) => setTimeout(r, 500));
      const item = pending[i]!;
      await supabase
        .from("sync_queue")
        .update({ status: "synced", synced_at: new Date().toISOString() })
        .eq("id", item.id);
      setProgress(Math.round(((i + 1) / pending.length) * 100));
      qc.invalidateQueries({ queryKey: ["sync_queue"] });
    }
    setSyncing(false);
    toast.success(`${pending.length} record(s) synced to the cloud`);
  }

  async function clearSynced() {
    const { error } = await supabase.from("sync_queue").delete().eq("status", "synced");
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["sync_queue"] });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Offline quiz queue (local storage)</CardTitle>
            <CardDescription>
              {pendingQueue.length === 0
                ? "No quizzes trapped locally."
                : `${pendingQueue.length} quiz(zes) waiting to reach the cloud.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingQueue.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Saved offline · {new Date(item.savedAt).toLocaleString()}
                  </p>
                </div>
                <Badge variant="secondary">pending</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  aria-label={`Discard ${item.title}`}
                  onClick={() => removePendingQuiz(item.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            {localSyncing && (
              <div className="flex items-center gap-3 rounded-lg border border-dashed p-3 text-sm font-medium">
                <Loader2 className="size-4 animate-spin text-primary" />
                Detecting network connection... Synchronizing local data to cloud repository...
              </div>
            )}
            {pendingQueue.length > 0 && (
              <Button onClick={() => void syncNow()} disabled={!online || localSyncing}>
                <CloudUpload className="size-4" /> Sync offline quizzes now
              </Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Local data queue</CardTitle>
            <CardDescription>
              {pending.length} pending · {items.length - pending.length} synced
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">
                The queue is empty. Record something offline to see it appear here.
              </p>
            )}
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.entity_label ?? item.entity_type}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.entity_type} · {item.action} · {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <Badge variant={item.status === "pending" ? "secondary" : "default"}>{item.status}</Badge>
              </div>
            ))}
            {syncing && <Progress value={progress} />}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={addSample}>
                <PlusCircle className="size-4" /> Record classroom data
              </Button>
              <Button onClick={runSync} disabled={syncing}>
                <CloudUpload className="size-4" /> Sync now
              </Button>
              <Button variant="ghost" onClick={clearSynced}>
                <Trash2 className="size-4" /> Clear synced
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Connectivity</CardTitle>
          <CardDescription>Simulate classroom network conditions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="flex items-center gap-2 text-sm font-medium">
              {online ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
              {online ? "Online" : "Offline mode"}
            </span>
            <Switch checked={online} onCheckedChange={setOnline} />
          </div>
          <p className="text-xs text-muted-foreground">
            In offline mode, downloads are blocked and new quizzes are stored in the local queue. When connectivity
            returns, press “Sync now” to upload every pending record.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}