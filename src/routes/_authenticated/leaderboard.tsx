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
  const { lang } = useI18n();
  const hi = lang === "hi";
  const [rows, setRows] = useState<QuizResult[]>([]);

  useEffect(() => {
    const all = [...loadResults(), ...loadOfflineScores()];
    setRows(all.sort((a, b) => b.score - a.score).slice(0, 25));
  }, []);

  const medal = (i: number) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{hi ? "🏆 लीडरबोर्ड" : "🏆 Leaderboard"}</h1>
        <p className="text-sm text-muted-foreground">
          {hi
            ? "इस डिवाइस पर सहेजे गए सभी क्विज़ और मिनी-गेम स्कोर।"
            : "Every quiz and mini-game score recorded offline on this device."}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{hi ? "शीर्ष प्रदर्शन" : "Top performances"}</CardTitle>
          <CardDescription>{rows.length} {hi ? "रिकॉर्ड" : "records"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {hi ? "अभी कोई स्कोर नहीं — कोई गेम खेलें!" : "No scores yet — play a game to get on the board!"}
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
