import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Activity } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Session = {
  module_key: string;
  module_label: string;
  subject: string;
  class_level: string;
  score: number;
  duration_sec: number;
  user_id: string;
  created_at: string;
};

type Submission = {
  quiz_title: string;
  subject: string;
  topic: string | null;
  class_level: string;
  correct_count: number;
  total_count: number;
  accuracy: number;
  user_id: string;
  created_at: string;
};

function HBar({ value, label, right }: { value: number; label: string; right: string }) {
  return (
    <div className="grid grid-cols-[minmax(90px,140px)_1fr_52px] items-center gap-2 text-xs">
      <span className="truncate" title={label}>
        {label}
      </span>
      <div className="h-2.5 w-full overflow-hidden rounded-full border border-border bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(100, Math.max(2, value))}%` }}
        />
      </div>
      <span className="text-right tabular-nums">{right}</span>
    </div>
  );
}

function Sparkline({ points }: { points: { label: string; value: number }[] }) {
  if (points.length === 0) return null;
  const w = 100;
  const h = 36;
  const step = points.length > 1 ? w / (points.length - 1) : w;
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(2)},${(h - (p.value / 100) * h).toFixed(2)}`)
    .join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-24 w-full rounded-lg border bg-muted/30">
        <polyline points={`0,${h} ${points.map((p, i) => `${i * step},${h - (p.value / 100) * h}`).join(" ")} ${w},${h}`} className="fill-primary/15 stroke-none" />
        <path d={path} className="fill-none stroke-primary" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        {points.map((p) => (
          <span key={p.label}>{p.label}</span>
        ))}
      </div>
    </div>
  );
}

export function TeacherAnalytics({ hi = false }: { hi?: boolean }) {
  void hi;
  const { t, lang } = useI18n();
  const sessions = useQuery({
    queryKey: ["telemetry-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_game_sessions")
        .select("module_key, module_label, subject, class_level, score, duration_sec, user_id, created_at")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return (data ?? []) as Session[];
    },
    refetchInterval: 30_000,
  });

  const submissions = useQuery({
    queryKey: ["telemetry-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_submissions")
        .select("quiz_title, subject, topic, class_level, correct_count, total_count, accuracy, user_id, created_at")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return (data ?? []) as Submission[];
    },
    refetchInterval: 30_000,
  });

  const stats = useMemo(() => {
    const s = sessions.data ?? [];
    const q = submissions.data ?? [];
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const moduleCounts = new Map<string, number>();
    for (const row of s) moduleCounts.set(row.module_label, (moduleCounts.get(row.module_label) ?? 0) + 1);
    for (const row of q) moduleCounts.set(row.quiz_title, (moduleCounts.get(row.quiz_title) ?? 0) + 1);
    const modules = [...moduleCounts.entries()].sort((a, b) => b[1] - a[1]);
    const maxModule = modules[0]?.[1] ?? 0;

    const weeklyUsers = new Set<string>();
    for (const row of [...s, ...q]) {
      if (new Date(row.created_at).getTime() >= weekAgo) weeklyUsers.add(row.user_id);
    }

    const topicAgg = new Map<string, { correct: number; total: number }>();
    for (const row of q) {
      const key = row.topic?.trim() || row.subject || "General";
      const cur = topicAgg.get(key) ?? { correct: 0, total: 0 };
      cur.correct += row.correct_count;
      cur.total += row.total_count;
      topicAgg.set(key, cur);
    }
    const topics = [...topicAgg.entries()]
      .map(([topic, v]) => ({ topic, accuracy: v.total ? Math.round((v.correct / v.total) * 100) : 0, attempts: v.total }))
      .sort((a, b) => b.attempts - a.attempts);

    const days: { label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - i);
      const next = day.getTime() + 24 * 60 * 60 * 1000;
      const dayRows = q.filter((r) => {
        const t = new Date(r.created_at).getTime();
        return t >= day.getTime() && t < next;
      });
      const totalQ = dayRows.reduce((a, r) => a + r.total_count, 0);
      const correctQ = dayRows.reduce((a, r) => a + r.correct_count, 0);
      days.push({
        label: day.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2),
        value: totalQ ? Math.round((correctQ / totalQ) * 100) : 0,
      });
    }

    const totalAccuracy = (() => {
      const total = q.reduce((a, r) => a + r.total_count, 0);
      const correct = q.reduce((a, r) => a + r.correct_count, 0);
      return total ? Math.round((correct / total) * 100) : 0;
    })();

    const avgDuration = s.length ? Math.round(s.reduce((a, r) => a + r.duration_sec, 0) / s.length) : 0;

    return {
      modules,
      maxModule,
      mostActive: modules[0]?.[0] ?? null,
      mostActivePlays: modules[0]?.[1] ?? 0,
      weeklyStudents: weeklyUsers.size,
      topics,
      days,
      totalAccuracy,
      avgDuration,
      totalEvents: s.length + q.length,
    };
  }, [sessions.data, submissions.data]);

  const loading = sessions.isLoading || submissions.isLoading;
  const error = sessions.error || submissions.error;

  if (loading) {
    return (
      <Card className="border-2">
        <CardContent className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> {t("anLoading")}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-destructive/40">
        <CardContent className="py-8 text-sm text-destructive">
          {t("anError")}
        </CardContent>
      </Card>
    );
  }

  return (
    <div key={lang} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">🔥 {t("anMostActive")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="truncate text-lg font-bold">{stats.mostActive ?? t("anNoActivity")}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.mostActivePlays} {t("anRecordedSessions")}
            </p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">👥 {t("anWeeklyStudents")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{stats.weeklyStudents}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("anUniqueLearners")}</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">🎯 {t("anAvgAccuracy")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{stats.totalAccuracy}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.topics.length} {t("anTopicsTracked")}
            </p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">⏱️ {t("anAvgDuration")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{stats.avgDuration}s</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.totalEvents} {t("anTelemetryEvents")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base">
              📶 {t("anTopNodes")}
            </CardTitle>
            <CardDescription>{t("anTopNodesSub")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.modules.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {t("anNoSessions")}
              </p>
            )}
            {stats.modules.slice(0, 8).map(([label, count]) => (
              <HBar
                key={label}
                label={label}
                value={stats.maxModule ? (count / stats.maxModule) * 100 : 0}
                right={String(count)}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base">
              📈 {t("anWeeklyCurve")}
            </CardTitle>
            <CardDescription>{t("anWeeklyCurveSub")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Sparkline points={stats.days} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-base">
            🧮 {t("anTopicAccuracy")}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Activity className="size-3.5" />
            {t("anAutoRefresh")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {stats.topics.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {t("anNoSubmissions")}
            </p>
          )}
          {stats.topics.slice(0, 10).map((row) => (
            <div key={row.topic} className="grid grid-cols-[minmax(90px,160px)_1fr_auto] items-center gap-2 text-xs">
              <span className="truncate">{row.topic}</span>
              <div className="h-2.5 w-full overflow-hidden rounded-full border border-border bg-muted">
                <div
                  className={`h-full rounded-full ${row.accuracy >= 70 ? "bg-emerald-500" : row.accuracy >= 45 ? "bg-amber-500" : "bg-destructive"}`}
                  style={{ width: `${Math.min(100, Math.max(2, row.accuracy))}%` }}
                />
              </div>
              <Badge variant="outline" className="tabular-nums">
                {row.accuracy}% · {row.attempts}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
