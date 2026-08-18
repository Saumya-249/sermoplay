import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CelebrationSplash } from "@/components/games/celebration";
import { ENGINES } from "@/components/arcade/engines";
import { generateArcadeRound } from "@/lib/arcade-ai.functions";
import {
  ARCADE_GAMES,
  ARCADE_SUBJECTS,
  getArcadeGame,
  type ArcadeData,
  type ArcadeGame,
} from "@/lib/arcade-catalog";
import { useApp } from "@/lib/app-context";
import { LANGUAGES, useI18n, type UiLang } from "@/lib/i18n";
import { localizeGameText } from "@/lib/game-i18n";
import { logGameSession } from "@/lib/telemetry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gamepad2, Loader2, LogOut, Sparkles, Timer, WifiOff } from "lucide-react";

export const Route = createFileRoute("/_authenticated/games")({
  head: () => ({
    meta: [
      { title: "Educational Arcade Arena | Sermo Play" },
      {
        name: "description",
        content:
          "Fifteen applied-learning arcade games — bazaar currency, fraction slicing, food webs, freedom timelines and more — with live AI content in seven Indian languages.",
      },
      { property: "og:title", content: "Educational Arcade Arena | Sermo Play" },
      {
        property: "og:description",
        content:
          "Fifteen applied-learning arcade games with live AI-generated content in seven Indian languages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArcadeArenaPage,
});

const LANG_NAME: Record<UiLang, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  kn: "Kannada",
  bn: "Bengali",
  mr: "Marathi",
  te: "Telugu",
};

function ArcadeArenaPage() {
  const { t, lang, setLang } = useI18n();
  const [subject, setSubject] = useState<string>("Math");
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const games = useMemo(() => ARCADE_GAMES.filter((g) => g.subject === subject), [subject]);
  const active = activeKey ? getArcadeGame(activeKey) : undefined;

  if (active) {
    return <ArcadeStage key={`${active.key}-${lang}`} game={active} onExit={() => setActiveKey(null)} />;
  }

  return (
    <div key={lang} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">🕹️ {t("arenaTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("arenaSub")}</p>
      </div>

      <Card>
        <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">{t("language")}</p>
            <Select value={lang} onValueChange={(v) => setLang(v as UiLang)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">{t("subjectLabel")}</p>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ARCADE_SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {localizeGameText(s, lang)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary" className="gap-1">
          <WifiOff className="size-3" /> {t("fullyOffline")}
        </Badge>
        <Badge variant="outline" className="gap-1">
          <Gamepad2 className="size-3" /> {games.length} {t("arenaGamesCount")}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {games.map((g) => (
          <GameToken key={g.key} game={g} onLaunch={() => setActiveKey(g.key)} />
        ))}
      </div>
    </div>
  );
}

function GameToken({ game, onLaunch }: { game: ArcadeGame; onLaunch: () => void }) {
  const { t, lang } = useI18n();
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-2 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg">
      <CardHeader className="bg-primary/5">
        <div className="flex items-start gap-3">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-card text-3xl shadow-sm" aria-hidden>
            {game.emoji}
          </span>
          <div className="min-w-0">
            <CardTitle className="text-base leading-snug">{localizeGameText(game.title, lang)}</CardTitle>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-[10px]">
                {localizeGameText(game.subject, lang)}
              </Badge>
              <Badge variant="outline" className="gap-1 text-[10px]">
                <Timer className="size-3" /> {game.seconds} {t("secondsShort")}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 pt-5">
        <CardDescription className="flex-1">{localizeGameText(game.description, lang)}</CardDescription>
        <Button className="w-full" onClick={onLaunch}>
          🎮 {t("launchGame")}
        </Button>
      </CardContent>
    </Card>
  );
}

/* --------------------------- Full-screen arcade --------------------------- */

function ArcadeStage({ game, onExit }: { game: ArcadeGame; onExit: () => void }) {
  const { t, lang } = useI18n();
  const { userId, online } = useApp();
  const synthesize = useServerFn(generateArcadeRound);

  const [data, setData] = useState<ArcadeData>(game.fallback);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [variant, setVariant] = useState(0);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState({ correct: 0, wrong: 0 });
  const [seconds, setSeconds] = useState(game.seconds);
  const [over, setOver] = useState(false);
  const [roundKey, setRoundKey] = useState(0);

  const load = useCallback(
    async (nextVariant: number) => {
      if (!online) {
        setLive(false);
        setData(game.fallback);
        return;
      }
      setLoading(true);
      try {
        const res = await synthesize({
          data: {
            gameKey: game.key,
            gameTitle: game.title,
            subject: game.subject,
            engine: game.engine,
            language: LANG_NAME[lang],
            variant: nextVariant,
          },
        });
        const payload = res.data as ArcadeData;
        const usable =
          (payload.rounds?.length ?? 0) > 0 ||
          (payload.tokens?.length ?? 0) > 0 ||
          (payload.fractions?.length ?? 0) > 0 ||
          (payload.items?.length ?? 0) > 0 ||
          (payload.sequence?.length ?? 0) > 0 ||
          Boolean(payload.crop);
        setData(usable ? payload : game.fallback);
        setLive(usable);
      } catch (e) {
        setData(game.fallback);
        setLive(false);
        toast.error(e instanceof Error ? e.message : "Live synthesis failed — offline pack loaded.");
      } finally {
        setLoading(false);
      }
    },
    [game, lang, online, synthesize],
  );

  useEffect(() => {
    void load(0);
  }, [load]);

  useEffect(() => {
    if (over || loading) return;
    const id = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          setOver(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [over, loading]);

  useEffect(() => {
    if (!over) return;
    void logGameSession({
      userId,
      moduleKey: game.key,
      moduleLabel: game.title,
      subject: game.subject,
      classLevel: "Class 5",
      score,
      durationSec: game.seconds - seconds,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over]);

  const restart = async (nextVariant: number) => {
    setVariant(nextVariant);
    setScore(0);
    setHits({ correct: 0, wrong: 0 });
    setSeconds(game.seconds);
    setOver(false);
    setRoundKey((k) => k + 1);
    await load(nextVariant);
  };

  const Engine = ENGINES[game.engine];
  const pct = Math.round((seconds / game.seconds) * 100);

  return (
    <div key={lang} className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-2xl" aria-hidden>
          {game.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold">{localizeGameText(game.title, lang)}</h1>
          <p className="truncate text-xs text-muted-foreground">
            {localizeGameText(game.subject, lang)} ·{" "}
            {live ? (
              <span className="text-primary">
                <Sparkles className="mr-1 inline size-3" />
                {t("livePack")}
              </span>
            ) : (
              t("offlinePack")
            )}
          </p>
        </div>
        <Button variant="destructive" onClick={onExit} className="gap-2">
          <LogOut className="size-4" /> 🚪 {t("quitArena")}
        </Button>
      </div>

      <Card className="overflow-hidden border-2">
        <CardHeader className="gap-3 bg-primary/5 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="text-sm">
              {t("scoreLabel")}: {score}
            </Badge>
            <Badge variant="secondary" className="gap-1 text-sm">
              <Timer className="size-3" /> {seconds}
              {t("secondsShort")}
            </Badge>
            <Badge variant="outline" className="text-xs">
              ✅ {hits.correct} · ❌ {hits.wrong}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto gap-1"
              disabled={loading}
              onClick={() => void restart(variant + 1)}
            >
              {loading ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
              {t("newAiRound")}
            </Button>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${pct < 25 ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm">{t("synthesizing")}</p>
            </div>
          ) : (
            <Engine
              key={`${game.key}-${roundKey}`}
              game={game}
              data={data}
              onScore={(points, correct) => {
                setScore((s) => s + points);
                setHits((h) => ({
                  correct: h.correct + (correct ? 1 : 0),
                  wrong: h.wrong + (correct ? 0 : 1),
                }));
              }}
              onFinish={() => setOver(true)}
            />
          )}
        </CardContent>
      </Card>

      <CelebrationSplash
        open={over}
        title={seconds === 0 ? `⏱️ ${t("timeUpLabel")}` : `🎉 ${t("arenaCleared")}`}
        subtitle={`${t("finalScore")}: ${score}`}
        actionLabel={t("playAgain")}
        onAction={() => void restart(variant + 1)}
      />
    </div>
  );
}
