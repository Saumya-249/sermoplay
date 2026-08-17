import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/app-context";
import { useI18n } from "@/lib/i18n";
import { loadPendingQueue } from "@/lib/pending-sync";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: ({ context }) => {
    if ((context as { role?: string }).role !== "admin") throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Admin Console | Sermo Play" },
      { name: "description", content: "Administrator console: teacher approval queue, system logs and global configuration switches." },
      { property: "og:title", content: "Admin Console | Sermo Play" },
      { property: "og:description", content: "Administrator console: teacher approval queue, system logs and global configuration switches." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { online } = useApp();
  const { lang } = useI18n();
  const hi = lang === "hi";
  const [logs, setLogs] = useState<string[]>([]);
  const [flags, setFlags] = useState({ aiGeneration: true, offlineDownloads: true, publicLibrary: true });

  const profiles = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, role, school, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const queue = loadPendingQueue();
    setLogs([
      `[${new Date().toLocaleTimeString()}] Network mode: ${online ? "online" : "offline"}`,
      `[${new Date().toLocaleTimeString()}] Local sync queue: ${queue.length} record(s) pending`,
      `[${new Date().toLocaleTimeString()}] Offline caches loaded from browser storage`,
      `[${new Date().toLocaleTimeString()}] Admin console session opened`,
    ]);
  }, [online]);

  const teachers = (profiles.data ?? []).filter((p) => p.role === "teacher");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{hi ? "🛡️ एडमिन कंसोल" : "🛡️ Administrator Console"}</h1>
        <p className="text-sm text-muted-foreground">
          {hi ? "पूर्ण पढ़ने/लिखने की पहुँच, लॉग और वैश्विक सेटिंग्स।" : "Full read/write visibility, logs and global configuration."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{hi ? "शिक्षक अनुमोदन कतार" : "Teacher approval queue"}</CardTitle>
            <CardDescription>{teachers.length} {hi ? "शिक्षक खाते" : "teacher accounts"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {profiles.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {teachers.length === 0 && !profiles.isLoading && (
              <p className="text-sm text-muted-foreground">{hi ? "कोई प्रतीक्षारत खाता नहीं।" : "No pending accounts."}</p>
            )}
            {teachers.map((p) => (
              <div key={p.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.email}</p>
                </div>
                <Badge variant="secondary" className="shrink-0">{p.role}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{hi ? "वैश्विक कॉन्फ़िगरेशन" : "Global configuration"}</CardTitle>
            <CardDescription>{hi ? "सिस्टम-व्यापी स्विच" : "System-wide switches"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(
              [
                ["aiGeneration", hi ? "एआई क्विज़ जनरेशन" : "AI quiz generation"],
                ["offlineDownloads", hi ? "ऑफ़लाइन डाउनलोड" : "Offline downloads"],
                ["publicLibrary", hi ? "सार्वजनिक लाइब्रेरी" : "Public game library"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor={key}>{label}</Label>
                <Switch
                  id={key}
                  checked={flags[key]}
                  onCheckedChange={(v) => setFlags((f) => ({ ...f, [key]: v }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{hi ? "सिस्टम लॉग" : "System logs"}</CardTitle>
            <CardDescription>{hi ? "इस सत्र की गतिविधि" : "Activity from this session"}</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="max-h-64 overflow-auto rounded-lg bg-muted p-3 text-xs leading-relaxed">
              {logs.join("\n")}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
