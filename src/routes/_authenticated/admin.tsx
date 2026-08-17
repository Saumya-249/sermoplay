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
import {
  STUDENT_ROWS,
  TEACHER_ROWS,
  WEAK_SUBJECT_DISTRIBUTION,
  GLOBAL_AVG_SCORE,
  AVG_TIMED_GAME_SEC,
  TOTAL_LMS_MODULES,
  FALLBACK_QUIZ_COUNT,
} from "@/lib/admin-analytics";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: ({ context }) => {
    if ((context as { role?: string }).role !== "admin") throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Admin Analytics Dashboard | Sermo Play" },
      { name: "description", content: "Administrator analytics engine: student performance tracking, teacher activity monitoring, LMS deployment counters and global configuration." },
      { property: "og:title", content: "Admin Analytics Dashboard | Sermo Play" },
      { property: "og:description", content: "Administrator analytics engine: student performance tracking, teacher activity monitoring, LMS deployment counters and global configuration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function Bar({ value, tone = "primary" }: { value: number; tone?: "primary" | "warn" }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full border border-border bg-muted">
      <div
        className={`h-full rounded-full ${tone === "warn" ? "bg-amber-500" : "bg-primary"}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function StatCard({ emoji, label, value, sub }: { emoji: string; label: string; value: string; sub: string }) {
  return (
    <Card className="border-2">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-2 text-xs font-medium">
          <span aria-hidden>{emoji}</span>
          <span className="min-w-0 truncate">{label}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tabular-nums">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

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

  const quizCount = useQuery({
    queryKey: ["admin-quiz-count"],
    queryFn: async () => {
      const { count, error } = await supabase.from("quizzes").select("id", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  useEffect(() => {
    const queue = loadPendingQueue();
    setLogs([
      `[${new Date().toLocaleTimeString()}] Network mode: ${online ? "online" : "offline"}`,
      `[${new Date().toLocaleTimeString()}] Local sync queue: ${queue.length} record(s) pending`,
      `[${new Date().toLocaleTimeString()}] Analytics engine rendered from cached dataset`,
      `[${new Date().toLocaleTimeString()}] Admin console session opened`,
    ]);
  }, [online]);

  const teachers = (profiles.data ?? []).filter((p) => p.role === "teacher");
  const liveQuizzes = quizCount.data ?? 0;
  const totalQuizzes = (online ? liveQuizzes : 0) + FALLBACK_QUIZ_COUNT;
  const activeEducators = Math.max(teachers.length, TEACHER_ROWS.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{hi ? "🛡️ एडमिन एनालिटिक्स डैशबोर्ड" : "🛡️ Administrator Analytics Dashboard"}</h1>
        <p className="text-sm text-muted-foreground">
          {hi
            ? "छात्र प्रदर्शन, शिक्षक गतिविधि और वैश्विक कॉन्फ़िगरेशन का केंद्रीकृत दृश्य।"
            : "Centralized, data-driven view of student performance, teacher activity and global configuration."}
        </p>
        {!online && (
          <Badge variant="secondary" className="mt-2">
            {hi ? "ऑफ़लाइन — कैश्ड एनालिटिक्स" : "Offline — cached analytics snapshot"}
          </Badge>
        )}
      </div>

      {/* 3. Graphical summary counter cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          emoji="📊"
          label={hi ? "कुल एआई क्विज़ बनाए गए" : "Total AI Quizzes Generated"}
          value={String(totalQuizzes)}
          sub={online ? `${liveQuizzes} ${hi ? "लाइव" : "live"} + ${FALLBACK_QUIZ_COUNT} ${hi ? "संग्रह" : "archive"}` : hi ? "कैश्ड कुल" : "cached total"}
        />
        <StatCard
          emoji="📈"
          label={hi ? "वैश्विक छात्र औसत स्कोर" : "Global Student Avg Score"}
          value={`${GLOBAL_AVG_SCORE}%`}
          sub={`${STUDENT_ROWS.length} ${hi ? "ट्रैक किए गए छात्र" : "tracked students"}`}
        />
        <StatCard
          emoji="👩‍🏫"
          label={hi ? "कुल सक्रिय शिक्षक" : "Total Active Educators"}
          value={String(activeEducators)}
          sub={`${TEACHER_ROWS.reduce((a, t) => a + t.activeClasses, 0)} ${hi ? "सक्रिय कक्षाएँ" : "active classes"}`}
        />
        <StatCard
          emoji="⏱️"
          label={hi ? "टाइम्ड गेम्स में औसत समय" : "Avg Time Spent in Timed Games"}
          value={`${AVG_TIMED_GAME_SEC}s`}
          sub={hi ? "प्रति मिनी-गेम सत्र" : "per mini-game session"}
        />
      </div>

      {/* 1. Student performance tracking */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>{hi ? "🎓 छात्र प्रदर्शन ट्रैकिंग" : "🎓 Student Performance Tracking"}</CardTitle>
          <CardDescription>
            {hi
              ? "औसत स्कोर, प्रति मिनी-गेम समय, कक्षा-वार पूर्णता दर और कमज़ोर विषय।"
              : "Average quiz scores, time per mini-game, completion rates by grade and weakest subject areas."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted/60 text-left">
                  <th className="border-b p-3 font-semibold">{hi ? "छात्र" : "Student"}</th>
                  <th className="border-b p-3 font-semibold">{hi ? "कक्षा" : "Grade"}</th>
                  <th className="border-b p-3 font-semibold">{hi ? "औसत क्विज़ स्कोर" : "Avg Quiz Score"}</th>
                  <th className="border-b p-3 font-semibold">{hi ? "समय / मिनी-गेम" : "Time / Mini-Game"}</th>
                  <th className="border-b p-3 font-semibold">{hi ? "पूर्णता दर" : "Completion Rate"}</th>
                  <th className="border-b p-3 font-semibold">{hi ? "कमज़ोर विषय" : "Weakest Subject"}</th>
                </tr>
              </thead>
              <tbody>
                {STUDENT_ROWS.map((s) => (
                  <tr key={s.name} className="odd:bg-background even:bg-muted/20">
                    <td className="border-b p-3 font-medium">{hi ? s.nameHi : s.name}</td>
                    <td className="border-b p-3">{s.classLevel}</td>
                    <td className="border-b p-3">
                      <div className="flex items-center gap-2">
                        <span className="w-10 tabular-nums">{s.avgScore}%</span>
                        <Bar value={s.avgScore} />
                      </div>
                    </td>
                    <td className="border-b p-3 tabular-nums">{s.timePerGameSec}s</td>
                    <td className="border-b p-3">
                      <div className="flex items-center gap-2">
                        <span className="w-10 tabular-nums">{s.completionRate}%</span>
                        <Bar value={s.completionRate} />
                      </div>
                    </td>
                    <td className="border-b p-3">
                      <Badge variant="outline">
                        {hi ? s.weakestSubjectHi : s.weakestSubject} · {s.incorrectShare}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="mb-3 text-sm font-semibold">
                {hi ? "कक्षा 1–8 पूर्णता दर" : "Completion Rates by Grade Level (Class 1–8)"}
              </h3>
              <div className="space-y-2">
                {STUDENT_ROWS.map((s) => (
                  <div key={s.classLevel} className="grid grid-cols-[70px_1fr_44px] items-center gap-2 text-xs">
                    <span className="truncate">{s.classLevel}</span>
                    <Bar value={s.completionRate} />
                    <span className="text-right tabular-nums">{s.completionRate}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-3 text-sm font-semibold">
                {hi ? "गलत उत्तरों का विषय-वार वितरण" : "Weakest Areas — Incorrect Answer Distribution"}
              </h3>
              <div className="space-y-2">
                {WEAK_SUBJECT_DISTRIBUTION.map((w) => (
                  <div key={w.subject} className="grid grid-cols-[110px_1fr_44px] items-center gap-2 text-xs">
                    <span className="truncate">{hi ? w.subjectHi : w.subject}</span>
                    <Bar value={w.share} tone="warn" />
                    <span className="text-right tabular-nums">{w.share}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Teacher activity monitoring */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>{hi ? "👩‍🏫 शिक्षक गतिविधि निगरानी" : "👩‍🏫 Teacher Activity Monitoring"}</CardTitle>
          <CardDescription>
            {hi ? "बनाए गए क्विज़, प्रमुख विषय, सक्रिय कक्षाएँ और तैनात एलएमएस मॉड्यूल।" : "Quizzes generated, most used subjects, active classes and deployed LMS modules."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">{hi ? "एलएमएस मॉड्यूल तैनात" : "LMS Modules Deployed"}</p>
              <p className="text-2xl font-bold tabular-nums">{TOTAL_LMS_MODULES}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">{hi ? "कुल क्विज़ बनाए" : "Quizzes Generated"}</p>
              <p className="text-2xl font-bold tabular-nums">{TEACHER_ROWS.reduce((a, t) => a + t.quizzesGenerated, 0)}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">{hi ? "सक्रिय कक्षाएँ" : "Active Classes Managed"}</p>
              <p className="text-2xl font-bold tabular-nums">{TEACHER_ROWS.reduce((a, t) => a + t.activeClasses, 0)}</p>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted/60 text-left">
                  <th className="border-b p-3 font-semibold">{hi ? "शिक्षक" : "Teacher"}</th>
                  <th className="border-b p-3 font-semibold">{hi ? "कुल क्विज़" : "Total Quizzes Generated"}</th>
                  <th className="border-b p-3 font-semibold">{hi ? "सर्वाधिक उपयोग विषय" : "Most Used Subject"}</th>
                  <th className="border-b p-3 font-semibold">{hi ? "सक्रिय कक्षाएँ" : "Active Classes"}</th>
                  <th className="border-b p-3 font-semibold">{hi ? "एलएमएस मॉड्यूल" : "LMS Modules Deployed"}</th>
                </tr>
              </thead>
              <tbody>
                {TEACHER_ROWS.map((t) => (
                  <tr key={t.name} className="odd:bg-background even:bg-muted/20">
                    <td className="border-b p-3 font-medium">{hi ? t.nameHi : t.name}</td>
                    <td className="border-b p-3 tabular-nums">{t.quizzesGenerated}</td>
                    <td className="border-b p-3">
                      <Badge variant="secondary">{hi ? t.topSubjectHi : t.topSubject}</Badge>
                    </td>
                    <td className="border-b p-3 tabular-nums">{t.activeClasses}</td>
                    <td className="border-b p-3 tabular-nums">{t.lmsModules}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
            <pre className="max-h-64 overflow-auto rounded-lg border bg-muted p-3 text-xs leading-relaxed">
              {logs.join("\n")}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
