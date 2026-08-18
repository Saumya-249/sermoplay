import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/app-context";
import { useI18n, type I18nKey } from "@/lib/i18n";
import {
  CURRICULUM_AUDIT,
  LANGUAGE_ENGAGEMENT,
  OPS_LOG,
  STUDENTS,
  TEACHERS,
  TOTAL_ASSESSMENTS,
} from "@/lib/school-data";

export function AdminAnalyticsBody() {
  const { online } = useApp();
  const { lang, t } = useI18n();
  const [query, setQuery] = useState("");

  const cls = (n: number) => t("adClassFmt", { n });
  const ago = (d: number) => (d === 0 ? t("adToday") : d === 1 ? t("adYesterday") : t("adDaysAgo", { n: d }));

  const curriculumData = useMemo(
    () =>
      CURRICULUM_AUDIT.map((c) => ({
        name: t(c.subject as I18nKey),
        chapters: c.chapters,
        quizzes: c.quizzes,
        coverage: Math.round((c.quizzes / c.chapters) * 100),
      })),
    [lang, t],
  );

  const langData = useMemo(
    () => LANGUAGE_ENGAGEMENT.map((l) => ({ name: t(l.key as I18nKey), value: l.share, color: l.color })),
    [lang, t],
  );

  const best = [...curriculumData].sort((a, b) => b.coverage - a.coverage)[0];
  const worst = [...curriculumData].sort((a, b) => a.coverage - b.coverage)[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STUDENTS;
    return STUDENTS.filter(
      (s) => s.name.toLowerCase().includes(q) || cls(s.classNo).toLowerCase().includes(q) || String(s.classNo) === q,
    );
  }, [query, lang]);

  return (
    <div key={lang} className="space-y-6">
      <div id="curriculum" className="grid scroll-mt-24 gap-6 xl:grid-cols-2">
        {/* Curriculum audit */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">📊 {t("adCurriculumTitle")}</CardTitle>
            <CardDescription>{t("adCurriculumDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={curriculumData} margin={{ top: 8, right: 8, left: -18, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="chapters" name={t("adChapters")} fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="quizzes" name={t("adQuizzes")} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {curriculumData.map((c) => (
                <div key={c.name} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="truncate">{c.name}</span>
                    <span className="tabular-nums">{c.coverage}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${c.coverage}%` }} />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground tabular-nums">
                    {c.quizzes} / {c.chapters} · {t("adCoverage")}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">✅ {t("adStrongest")}: {best?.name}</Badge>
              <Badge variant="secondary">⚠️ {t("adWeakest")}: {worst?.name}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Language engagement */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">🗣️ {t("adLangTitle")}</CardTitle>
            <CardDescription>{t("adLangDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={langData} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="80%" paddingAngle={2}>
                    {langData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number, n: string) => [`${v}%`, n]}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {langData.map((d) => (
                <div key={d.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-xs">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: d.color }} />
                    <span className="truncate">{d.name}</span>
                  </div>
                  <span className="tabular-nums font-medium">{d.value}%</span>
                </div>
              ))}
              <p className="pt-1 text-[11px] text-muted-foreground tabular-nums">
                {TOTAL_ASSESSMENTS} {t("adAssessments")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student registry */}
      <Card id="students" className="scroll-mt-24 border-2">
        <CardHeader>
          <CardTitle className="text-lg">🎓 {t("adRegistryTitle")}</CardTitle>
          <CardDescription>{t("adRegistryDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("adSearch")}
            aria-label={t("adSearch")}
            className="max-w-sm"
          />
          <p className="text-xs text-muted-foreground">
            {t("adShowing", { count: filtered.length, total: STUDENTS.length })}
          </p>
          <div className="max-h-[420px] w-full overflow-auto rounded-lg border">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-muted">
                <tr className="text-left">
                  <th className="border-b p-3 font-semibold">{t("adColStudent")}</th>
                  <th className="border-b p-3 font-semibold">{t("adColClass")}</th>
                  <th className="border-b p-3 font-semibold">{t("adColAvg")}</th>
                  <th className="border-b p-3 font-semibold">{t("adColGames")}</th>
                  <th className="border-b p-3 font-semibold">{t("adColLastActive")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="odd:bg-background even:bg-muted/20">
                    <td className="border-b p-3 font-medium">{s.name}</td>
                    <td className="border-b p-3">{cls(s.classNo)}</td>
                    <td className="border-b p-3">
                      <div className="flex items-center gap-2">
                        <span className="w-10 tabular-nums">{s.avgScore}%</span>
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${s.avgScore >= 75 ? "bg-primary" : "bg-amber-500"}`}
                            style={{ width: `${s.avgScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="border-b p-3 tabular-nums">{s.gamesPlayed}</td>
                    <td className="border-b p-3 text-muted-foreground">{ago(s.lastActiveDays)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">
                      {t("adNoResults")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Teacher workload */}
      <Card id="teachers" className="scroll-mt-24 border-2">
        <CardHeader>
          <CardTitle className="text-lg">👩‍🏫 {t("adWorkloadTitle")}</CardTitle>
          <CardDescription>{t("adWorkloadDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="border-b p-3 font-semibold">{t("adColTeacher")}</th>
                  <th className="border-b p-3 font-semibold">{t("adColSubject")}</th>
                  <th className="border-b p-3 font-semibold">{t("adColQuizzes")}</th>
                  <th className="border-b p-3 font-semibold">{t("adColDecks")}</th>
                  <th className="border-b p-3 font-semibold">{t("adColWorksheets")}</th>
                </tr>
              </thead>
              <tbody>
                {TEACHERS.map((tr) => (
                  <tr key={tr.id} className="odd:bg-background even:bg-muted/20">
                    <td className="border-b p-3 font-medium">{tr.name}</td>
                    <td className="border-b p-3">
                      <Badge variant="outline">{t(tr.subject as I18nKey)}</Badge>
                    </td>
                    <td className="border-b p-3 tabular-nums">{tr.quizzes}</td>
                    <td className="border-b p-3 tabular-nums">{tr.decks}</td>
                    <td className="border-b p-3 tabular-nums">{tr.worksheets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Operations log */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">🕒 {t("adLogTitle")}</CardTitle>
          <CardDescription>{t("adLogDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {OPS_LOG.map((entry) => {
              const vars: Record<string, string | number> = { name: entry.name };
              if ("cls" in entry) vars["cls"] = cls(entry.cls);
              if ("subject" in entry) vars["subject"] = t(entry.subject as I18nKey);
              if ("topic" in entry) vars["topic"] = t(entry.topic as I18nKey);
              if ("score" in entry) vars["score"] = entry.score;
              if ("game" in entry) vars["game"] = t(entry.game as I18nKey);
              return (
                <li key={entry.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-lg border p-3">
                  <span aria-hidden className="mt-0.5 text-base">
                    {entry.kind === "adLogScore" ? "🏅" : entry.kind === "adLogJoined" ? "✨" : "📝"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm leading-snug">{t(entry.kind as I18nKey, vars)}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{ago(entry.days)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
