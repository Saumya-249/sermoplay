import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CelebrationSplash, playRewardSound } from "@/components/games/celebration";
import { useI18n, type UiLang } from "@/lib/i18n";
import { challengeText, gameText } from "@/lib/challenge-i18n";
import { saveOfflineScore } from "@/lib/quiz-local";
import { useApp } from "@/lib/app-context";
import { logGameSession } from "@/lib/telemetry";
import { useServerFn } from "@tanstack/react-start";
import { generateLiveQuiz } from "@/lib/live-quiz.functions";
import {
  CHALLENGE_GAMES,
  LANGUAGE_NAME,
  makeEcoRound,
  makeFractionRound,
  offlineQuestions,
  type ChallengeGame,
  type ChallengeQuestion,
  type FractionRound,
} from "@/lib/challenge-games";
import { ArrowLeft, Loader2, Sparkles, Timer } from "lucide-react";

export const Route = createFileRoute("/_authenticated/challenges")({
  head: () => ({
    meta: [
      { title: "Timed Challenge Games | Sermo Play" },
      {
        name: "description",
        content:
          "Launch 60-second classroom mini-games: Speed Addition Race, Fraction Pizza Slicer, Grammar Ninja, Shabd Khoj, Map Legend Detective and Eco-system Balancer.",
      },
      { property: "og:title", content: "Timed Challenge Games | Sermo Play" },
      {
        property: "og:description",
        content: "Six AI-powered 60-second mini-games across maths, language, science and general knowledge.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChallengesPage,
});

const ROUND_SECONDS = 60;

function useCountdown(running: boolean, onEnd: () => void) {
  const [left, setLeft] = useState(ROUND_SECONDS);
  const endRef = useRef(onEnd);
  endRef.current = onEnd;

  useEffect(() => {
    if (!running) return;
    setLeft(ROUND_SECONDS);
    const id = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          clearInterval(id);
          endRef.current();
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return left;
}

function Clock({ left, lang }: { left: number; lang: UiLang }) {
  const ct = challengeText(lang);
  const pct = (left / ROUND_SECONDS) * 100;
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-sm font-semibold">
        <span className="flex items-center gap-1">
          <Timer className="size-4" /> {left}s
        </span>
        <span className={left <= 10 ? "text-destructive" : "text-muted-foreground"}>
          {left <= 10 ? ct("hurry") : ct("roundBadge")}
        </span>
      </div>
      <Progress value={pct} className={left <= 10 ? "[&>div]:bg-destructive" : ""} />
    </div>
  );
}

/* ------------------------------- selection hub ------------------------------ */

function ChallengesPage() {
  const { lang } = useI18n();
  const ct = challengeText(lang);
  const [active, setActive] = useState<ChallengeGame | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{ct("pageTitle")}</h1>
        <p className="text-sm text-muted-foreground">{ct("pageSub")}</p>
      </div>

      {active === null ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CHALLENGE_GAMES.map((g) => {
            const gt = gameText(g.key, lang, { title: g.title, desc: g.desc, badge: g.badge });
            return (
            <Card key={g.key} className="flex flex-col transition-shadow hover:shadow-md">
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl" aria-hidden>
                    {g.emoji}
                  </span>
                  <Badge variant="secondary" className="shrink-0 text-[11px]">
                    {gt.badge}
                  </Badge>
                </div>
                <CardTitle className="text-base">{gt.title}</CardTitle>
                <CardDescription>{gt.desc}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <Timer className="size-3.5" /> {ct("roundLabel")}
                </p>
                <Button className="w-full" onClick={() => setActive(g)}>
                  🎮 {ct("launch")}
                </Button>
              </CardContent>
            </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setActive(null)}>
            <ArrowLeft className="mr-1 size-4" />
            {ct("back")}
          </Button>
          {active.kind === "fraction" ? (
            <FractionPizza key={`${active.key}-${lang}`} game={active} lang={lang} />
          ) : (
            <AiQuizGame key={`${active.key}-${lang}`} game={active} lang={lang} />
          )}
        </div>
      )}
    </div>
  );
}

/* --------------------------------- shell ---------------------------------- */

function GameShell({
  game,
  lang,
  left,
  score,
  running,
  loading,
  onRestart,
  children,
}: {
  game: ChallengeGame;
  lang: UiLang;
  left: number;
  score: number;
  running: boolean;
  loading?: boolean;
  onRestart: () => void;
  children: React.ReactNode;
}) {
  const ct = challengeText(lang);
  const gt = gameText(game.key, lang, { title: game.title, desc: game.desc, badge: game.badge });
  return (
    <Card className="animate-in fade-in slide-in-from-top-2 duration-300">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <CardTitle>
            {game.emoji} {gt.title}
          </CardTitle>
          <CardDescription>{gt.desc}</CardDescription>
        </div>
        <Badge variant="secondary" className="w-fit shrink-0">
          {gt.badge}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[180px] flex-1">
            <Clock left={left} lang={lang} />
          </div>
          <Badge className="text-sm">⭐ {score}</Badge>
          <Button size="sm" variant="outline" onClick={onRestart} disabled={loading}>
            {loading ? <Loader2 className="mr-1 size-4 animate-spin" /> : null}
            {running ? ct("restart") : ct("start")}
          </Button>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function useRoundTelemetry(done: boolean, score: number, game: ChallengeGame, classLevel: string) {
  const { userId } = useApp();
  const sent = useRef(false);
  useEffect(() => {
    if (!done) {
      sent.current = false;
      return;
    }
    if (sent.current) return;
    sent.current = true;
    void logGameSession({
      userId,
      moduleKey: game.key,
      moduleLabel: game.title,
      subject: game.subject,
      classLevel,
      score,
      durationSec: ROUND_SECONDS,
    });
    if (score > 0) {
      saveOfflineScore({
        quizId: game.key,
        quizTitle: game.title,
        score,
        correct: score,
        total: score,
        lang: "en",
        completedAt: new Date().toISOString(),
      });
    }
  }, [done, score, game, classLevel, userId]);
}

/* ------------------------- AI-streamed quiz games -------------------------- */

function AiQuizGame({ game, lang }: { game: ChallengeGame; lang: UiLang }) {
  const ct = challengeText(lang);
  const hi = lang === "hi";
  const { registeredClass } = useApp();
  const generate = useServerFn(generateLiveQuiz);
  const classLevel = registeredClass ?? game.classRange;

  const [questions, setQuestions] = useState<ChallengeQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [liveSource, setLiveSource] = useState<"ai" | "offline" | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const left = useCountdown(running, () => {
    setRunning(false);
    setDone(true);
  });

  useRoundTelemetry(done, score, game, classLevel);

  const start = useCallback(async () => {
    setLoading(true);
    setDone(false);
    setScore(0);
    setIdx(0);
    setPicked(null);
    setRunning(false);
    const language = game.forceLanguage ?? LANGUAGE_NAME[lang];
    let list: ChallengeQuestion[] = [];
    try {
      const res = await generate({
        data: {
          subject: game.subject,
          topic: `${game.topic} (game type: ${game.title})`,
          classLevel,
          language,
          difficulty: "Medium",
          variant: Math.floor(Math.random() * 100000),
          count: 10,
          mode: "single",
          rows: [],
        },
      });
      list = (res.questions ?? []) as ChallengeQuestion[];
    } catch {
      list = [];
    }
    if (list.length > 0) {
      setLiveSource("ai");
    } else {
      list = offlineQuestions(
        game.kind === "ecosystem" ? "eco" : game.key,
        hi || game.forceLanguage === "Hindi",
        10,
      );
      if (game.kind === "ecosystem") {
        list = Array.from({ length: 10 }, () => {
          const r = makeEcoRound(hi);
          return { q: r.prompt, options: r.options, correct: r.answer };
        });
      }
      setLiveSource("offline");
    }
    setQuestions(list);
    setLoading(false);
    setTimeout(() => setRunning(true), 0);
  }, [generate, game, classLevel, lang, hi]);

  useEffect(() => {
    void start();
    // launch immediately when the card is opened
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = questions[idx];

  function pick(i: number) {
    if (picked !== null || !q || !running) return;
    setPicked(i);
    if (i === q.correct) {
      playRewardSound();
      setScore((s) => s + 1);
    }
    setTimeout(() => {
      setPicked(null);
      setIdx((prev) => {
        const next = prev + 1;
        if (next >= questions.length) {
          setRunning(false);
          setDone(true);
          return prev;
        }
        return next;
      });
    }, 450);
  }

  return (
    <>
      <GameShell
        game={game}
        lang={lang}
        left={left}
        score={score}
        running={running}
        loading={loading}
        onRestart={() => void start()}
      >
        {loading && (
          <div className="flex items-center gap-2 rounded-xl border-2 border-dashed p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" />
            {ct("streaming")}
          </div>
        )}

        {!loading && q && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {ct("question")} {idx + 1}/{questions.length}
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="size-3.5 text-primary" />
                {liveSource === "ai" ? ct("liveAi") : ct("offlineSet")}
              </span>
            </div>
            <div className="rounded-xl border-2 border-dashed bg-muted/40 p-5 text-center text-lg font-semibold">
              {q.q}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, i) => (
                <Button
                  key={`${opt}-${i}`}
                  variant={picked === i ? (i === q.correct ? "default" : "destructive") : "outline"}
                  className="h-auto justify-start whitespace-normal py-3 text-left"
                  onClick={() => pick(i)}
                  disabled={!running}
                >
                  <span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </Button>
              ))}
            </div>
          </div>
        )}
      </GameShell>
      <CelebrationSplash
        open={done}
        title={ct("roundDone")}
        subtitle={ct("roundDoneSub", { score })}
        actionLabel={ct("playAgain")}
        onAction={() => void start()}
      />
    </>
  );
}

/* --------------------------- fraction pizza game --------------------------- */

function PizzaSvg({ num, den, size = 96 }: { num: number; den: number; size?: number }) {
  const r = size / 2;
  const slices = Array.from({ length: den }, (_, i) => {
    const a0 = (i / den) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / den) * Math.PI * 2 - Math.PI / 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const d = `M ${r} ${r} L ${r + r * Math.cos(a0)} ${r + r * Math.sin(a0)} A ${r} ${r} 0 ${large} 1 ${
      r + r * Math.cos(a1)
    } ${r + r * Math.sin(a1)} Z`;
    return { d, filled: i < num };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${num} of ${den}`}>
      {slices.map((s, i) => (
        <path
          key={i}
          d={s.d}
          className={s.filled ? "fill-primary" : "fill-muted"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />
      ))}
    </svg>
  );
}

function FractionPizza({ game, lang }: { game: ChallengeGame; lang: UiLang }) {
  const ct = challengeText(lang);
  const { registeredClass } = useApp();
  const classLevel = registeredClass ?? game.classRange;
  const [round, setRound] = useState<FractionRound>(() => makeFractionRound());
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"none" | "ok" | "no">("none");

  const left = useCountdown(running, () => {
    setRunning(false);
    setDone(true);
  });

  useRoundTelemetry(done, score, game, classLevel);

  const start = useCallback(() => {
    setScore(0);
    setDone(false);
    setFeedback("none");
    setRound(makeFractionRound());
    setRunning(false);
    setTimeout(() => setRunning(true), 0);
  }, []);

  useEffect(() => {
    start();
  }, [start]);

  function pick(i: number) {
    if (!running) return;
    if (i === round.correct) {
      playRewardSound();
      setScore((s) => s + 1);
      setFeedback("ok");
    } else {
      setFeedback("no");
    }
    setTimeout(() => {
      setFeedback("none");
      setRound(makeFractionRound());
    }, 350);
  }

  return (
    <>
      <GameShell game={game} lang={lang} left={left} score={score} running={running} onRestart={start}>
        <div
          className={`rounded-xl border-2 p-5 text-center transition-colors ${
            feedback === "ok"
              ? "border-emerald-500 bg-emerald-500/10"
              : feedback === "no"
                ? "border-destructive bg-destructive/10"
                : "border-dashed bg-muted/40"
          }`}
        >
          <p className="text-sm text-muted-foreground">
            {ct("fractionPrompt")}
          </p>
          <p className="text-4xl font-bold">
            {round.num}/{round.den}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {round.options.map((o, i) => (
            <Button
              key={`${o.num}-${o.den}-${i}`}
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => pick(i)}
              disabled={!running}
            >
              <PizzaSvg num={o.num} den={o.den} />
              <span className="text-sm font-bold">
                {o.num}/{o.den}
              </span>
            </Button>
          ))}
        </div>
      </GameShell>
      <CelebrationSplash
        open={done}
        title={ct("fractionDone")}
        subtitle={ct("fractionDoneSub", { score })}
        actionLabel={ct("playAgain")}
        onAction={start}
      />
    </>
  );
}
