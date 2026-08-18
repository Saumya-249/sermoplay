import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadOfflineScores, loadResults, type QuizResult } from "@/lib/quiz-local";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard | Sermo Play" },
      { name: "description", content: "Offline classroom leaderboard of quiz and mini-game scores stored on this device." },
      { property: "og:title", content: "Leaderboard | Sermo Play" },
      { property: "og:description", content: "Offline classroom leaderboard of quiz and mini-game scores stored on this device." },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { t, lang } = useI18n();
  const [rows, setRows] = useState<QuizResult[]>([]);

  useEffect(() => {
    const all = [...loadResults(), ...loadOfflineScores()];
    setRows(all.sort((a, b) => b.score - a.score).slice(0, 25));
  }, []);

  const medal = (i: number) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`);

  return (
    <div key={lang} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">🏆 {t("lbTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("lbSub")}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("lbTopTitle")}</CardTitle>
          <CardDescription>{rows.length} {t("lbRecords")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {t("lbEmpty")}
            </p>
          )}
          {rows.map((r, i) => (
            <div
              key={`${r.quizId}-${r.completedAt}-${i}`}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border bg-card p-3"
            >
              <span className="w-8 shrink-0 text-lg font-bold">{medal(i)}</span>
              <div className="min-w-0">
                <p className="truncate font-medium">{r.quizTitle}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {new Date(r.completedAt).toLocaleString()}
                </p>
              </div>
              <Badge className="shrink-0">
                {r.correct}/{r.total} · {r.score}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
