import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CelebrationSplash, playRewardSound } from "@/components/games/celebration";
import { useI18n } from "@/lib/i18n";
import { saveOfflineScore } from "@/lib/quiz-local";
import { useApp } from "@/lib/app-context";
import { logGameSession } from "@/lib/telemetry";
import { useServerFn } from "@tanstack/react-start";
import { generateLiveQuiz } from "@/lib/live-quiz.functions";
import { Timer, Loader2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/challenges")({
  head: () => ({
    meta: [
      { title: "Timed Challenges | Sermo Play" },
      {
        name: "description",
        content:
          "Sixty-second classroom mini-games: Speed Addition Race, Ecosystem Balance Challenge and Map Legend Detective for Class 1 to 8.",
      },
      { property: "og:title", content: "Timed Challenges | Sermo Play" },
      {
        property: "og:description",
        content: "Sixty-second offline mini-games for Class 1 to 8 — maths, science and social science.",
      },
    ],
  }),
  component: ChallengesPage,
});

const ROUND_SECONDS = 60;

/** Push a finished round into the live telemetry stream powering the teacher analytics console. */
function useRoundTelemetry(
  done: boolean,
  score: number,
  moduleKey: string,
  moduleLabel: string,
  subject: string,
  classLevel: string,
) {
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
      moduleKey,
      moduleLabel,
      subject,
      classLevel,
      score,
      durationSec: ROUND_SECONDS,
    });
  }, [done, score, moduleKey, moduleLabel, subject, classLevel, userId]);
}

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

function Clock({ left }: { left: number }) {
  const pct = (left / ROUND_SECONDS) * 100;
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-sm font-semibold">
        <span className="flex items-center gap-1">
          <Timer className="size-4" /> {left}s
        </span>
        <span className={left <= 10 ? "text-destructive" : "text-muted-foreground"}>
          {left <= 10 ? "⏰ Hurry!" : "60s round"}
        </span>
      </div>
      <Progress value={pct} className={left <= 10 ? "[&>div]:bg-destructive" : ""} />
    </div>
  );
}

function ChallengesPage() {
  const { lang } = useI18n();
  const hi = lang === "hi";
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{hi ? "⏱️ समयबद्ध चुनौतियाँ" : "⏱️ Timed Challenge Games"}</h1>
        <p className="text-sm text-muted-foreground">
          {hi
            ? "60 सेकंड की दौड़ — कक्षा 1 से 8 तक, पूरी तरह ऑफ़लाइन।"
            : "Sixty-second races for Class 1 to 8 — fully offline, no network needed."}
        </p>
      </div>

      <Tabs defaultValue="a">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="a">🪙 {hi ? "तेज़ जोड़ दौड़" : "Speed Addition Race"}</TabsTrigger>
          <TabsTrigger value="b">🌾 {hi ? "पारिस्थितिकी संतुलन" : "Ecosystem Balance"}</TabsTrigger>
          <TabsTrigger value="c">🗺️ {hi ? "मानचित्र जासूस" : "Map Legend Detective"}</TabsTrigger>
          <TabsTrigger value="d">✨ {hi ? "एआई लॉजिक स्प्रिंट" : "AI Logic Sprint"}</TabsTrigger>
        </TabsList>
        <TabsContent value="a" className="pt-4">
          <SpeedAddition hi={hi} />
        </TabsContent>
        <TabsContent value="b" className="pt-4">
          <EcosystemChallenge hi={hi} />
        </TabsContent>
        <TabsContent value="c" className="pt-4">
          <MapDetective hi={hi} />
        </TabsContent>
        <TabsContent value="d" className="pt-4">
          <AiLogicSprint hi={hi} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GameShell({
  title,
  subtitle,
  badge,
  running,
  left,
  score,
  onStart,
  children,
}: {
  title: string;
  subtitle: string;
  badge: string;
  running: boolean;
  left: number;
  score: number;
  onStart: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <CardTitle className="truncate">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {badge}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[180px] flex-1">
            <Clock left={left} />
          </div>
          <Badge className="text-sm">⭐ {score}</Badge>
          <Button size="sm" onClick={onStart}>
            {running ? "🔄 Restart" : "▶️ Start"}
          </Button>
        </div>
        <fieldset disabled={!running} className="space-y-4 disabled:opacity-60">
          {children}
        </fieldset>
      </CardContent>
    </Card>
  );
}

const TOKENS = [1, 2, 5, 10, 20, 50];

function SpeedAddition({ hi }: { hi: boolean }) {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(12);
  const [total, setTotal] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const left = useCountdown(running, () => {
    setRunning(false);
    setDone(true);
  });

  const newTarget = useCallback(() => {
    setTarget(Math.floor(Math.random() * 46) + 5);
    setTotal(0);
    setPicked([]);
  }, []);

  function start() {
    setScore(0);
    setDone(false);
    setRunning(false);
    setTimeout(() => setRunning(true), 0);
    newTarget();
  }

  function add(v: number) {
    const next = total + v;
    setPicked((p) => [...p, v]);
    setTotal(next);
    if (next === target) {
      playRewardSound();
      setScore((s) => s + 1);
      newTarget();
    } else if (next > target) {
      setTotal(0);
      setPicked([]);
    }
  }

  useEffect(() => {
    if (done && score > 0) {
      saveOfflineScore({
        quizId: "speed-addition-race",
        quizTitle: "Speed Addition Race",
        score,
        correct: score,
        total: score,
        lang: hi ? "hi" : "en",
        completedAt: new Date().toISOString(),
      });
    }
  }, [done, score, hi]);

  useRoundTelemetry(done, score, "speed-addition-race", "Speed Addition Race", "Math", "Class 1-3");

  return (
    <>
      <GameShell
        title={hi ? "🪙 तेज़ जोड़ दौड़" : "🪙 Speed Addition Race"}
        subtitle={
          hi
            ? "सिक्के और नोट चुनकर लक्ष्य राशि 60 सेकंड में बार-बार बनाइए।"
            : "Tap coins and notes to hit the target amount as many times as you can in 60 seconds."
        }
        badge={hi ? "कक्षा 1-3 · गणित" : "Class 1-3 · Math"}
        running={running}
        left={left}
        score={score}
        onStart={start}
      >
        <div className="rounded-xl border-2 border-dashed bg-muted/40 p-4 text-center">
          <p className="text-sm text-muted-foreground">{hi ? "लक्ष्य राशि" : "Target amount"}</p>
          <p className="text-4xl font-bold">₹{target}</p>
          <p className="mt-2 text-sm font-semibold">
            {hi ? "कुल राशि" : "Your total"}: ₹{total} / ₹{target}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {picked.map((p, i) => (
              <span
                key={`${p}-${i}`}
                className="rounded-full border bg-card px-3 py-1 text-sm font-semibold shadow-sm"
              >
                {p >= 20 ? "💵" : "🪙"} ₹{p}
              </span>
            ))}
            {picked.length === 0 && (
              <span className="text-xs text-muted-foreground">{hi ? "कोई टोकन नहीं" : "No tokens yet"}</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {TOKENS.map((v) => (
            <Button key={v} variant="outline" className="h-16 flex-col gap-1" onClick={() => add(v)}>
              <span className="text-xl">{v >= 20 ? "💵" : "🪙"}</span>
              <span className="text-xs font-bold">₹{v}</span>
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setTotal(0);
            setPicked([]);
          }}
        >
          🔄 {hi ? "हटाएं" : "Clear"}
        </Button>
      </GameShell>
      <CelebrationSplash
        open={done}
        title={hi ? "🎉 अद्भुत कार्य!" : "🎉 Time's up — great work!"}
        subtitle={
          hi ? `आपने ${score} लक्ष्य पूरे किए।` : `You matched ${score} target amounts in 60 seconds.`
        }
        actionLabel={hi ? "फिर से खेलें" : "Play again"}
        onAction={start}
      />
    </>
  );
}

type Metric = { water: number; soil: number; pest: number };

const ACTIONS: { key: string; emoji: string; en: string; hi: string; delta: Metric }[] = [
  { key: "rain", emoji: "🌧️", en: "Rain Drop", hi: "वर्षा की बूँद", delta: { water: 25, soil: -5, pest: 0 } },
  { key: "compost", emoji: "🌱", en: "Organic Compost", hi: "जैविक खाद", delta: { water: -5, soil: 25, pest: 0 } },
  { key: "ladybug", emoji: "🐞", en: "Friendly Ladybugs", hi: "मित्र भृंग", delta: { water: 0, soil: 0, pest: 25 } },
  { key: "flood", emoji: "🚿", en: "Over-Watering", hi: "अधिक सिंचाई", delta: { water: 30, soil: -15, pest: -10 } },
];

function EcosystemChallenge({ hi }: { hi: boolean }) {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [m, setM] = useState<Metric>({ water: 40, soil: 35, pest: 30 });

  const left = useCountdown(running, () => {
    setRunning(false);
    setDone(true);
  });

  const balanced = m.water >= 95 && m.soil >= 95 && m.pest >= 95;

  function start() {
    setScore(0);
    setDone(false);
    setM({ water: 40, soil: 35, pest: 30 });
    setRunning(false);
    setTimeout(() => setRunning(true), 0);
  }

  function apply(delta: Metric) {
    setM((prev) => {
      const clamp = (n: number) => Math.max(0, Math.min(100, n));
      const next = {
        water: clamp(prev.water + delta.water),
        soil: clamp(prev.soil + delta.soil),
        pest: clamp(prev.pest + delta.pest),
      };
      if (next.water >= 95 && next.soil >= 95 && next.pest >= 95) {
        playRewardSound();
        setScore((s) => s + 1);
        return { water: 40, soil: 35, pest: 30 };
      }
      return next;
    });
  }

  useRoundTelemetry(done, score, "ecosystem-balance", "Ecosystem Balance Challenge", "Science", "Class 4-6");

  const bars = useMemo(
    () => [
      { label: hi ? "जल आवश्यकता" : "Water Requirement", value: m.water, emoji: "💧" },
      { label: hi ? "मिट्टी के पोषक तत्व" : "Soil Nutrients", value: m.soil, emoji: "🌿" },
      { label: hi ? "कीट सुरक्षा" : "Pest Protection", value: m.pest, emoji: "🛡️" },
    ],
    [m, hi],
  );

  return (
    <>
      <GameShell
        title={hi ? "🌾 पारिस्थितिकी संतुलन चुनौती" : "🌾 Ecosystem Balance Challenge"}
        subtitle={
          hi
            ? "60 सेकंड में तीनों मीटर 100% तक लाकर फसल उगाइए — जितनी बार हो सके।"
            : "Balance all three meters to 100% before the clock runs out — as many crops as you can."
        }
        badge={hi ? "कक्षा 4-5 · विज्ञान" : "Class 4-5 · Science"}
        running={running}
        left={left}
        score={score}
        onStart={start}
      >
        <div className="rounded-xl border bg-muted/40 p-4 text-center text-5xl">
          {balanced ? "🌾" : m.water > 90 ? "💦" : "🌱"}
        </div>
        <div className="space-y-3">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="mb-1 flex items-center justify-between text-xs font-medium">
                <span>
                  {b.emoji} {b.label}
                </span>
                <span>{b.value}%</span>
              </div>
              <Progress value={b.value} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ACTIONS.map((a) => (
            <Button key={a.key} variant="outline" className="h-20 flex-col gap-1" onClick={() => apply(a.delta)}>
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-center text-[11px] leading-tight">{hi ? a.hi : a.en}</span>
            </Button>
          ))}
        </div>
      </GameShell>
      <CelebrationSplash
        open={done}
        title={hi ? "🎉 अद्भुत कार्य!" : "🎉 Round complete!"}
        subtitle={hi ? `आपने ${score} फसलें उगाईं।` : `You grew ${score} healthy crops in 60 seconds.`}
        actionLabel={hi ? "फिर से खेलें" : "Play again"}
        onAction={start}
      />
    </>
  );
}

type MapQ = { prompt: string; promptHi: string; options: string[]; optionsHi: string[]; answer: number };

const MAP_QUESTIONS: MapQ[] = [
  {
    prompt: "🗺️ Which city is the capital of Rajasthan?",
    promptHi: "🗺️ राजस्थान की राजधानी कौन सा शहर है?",
    options: ["Jaipur", "Jodhpur", "Udaipur", "Ajmer"],
    optionsHi: ["जयपुर", "जोधपुर", "उदयपुर", "अजमेर"],
    answer: 0,
  },
  {
    prompt: "🏛️ In which year did India gain independence?",
    promptHi: "🏛️ भारत को स्वतंत्रता किस वर्ष मिली?",
    options: ["1930", "1942", "1947", "1950"],
    optionsHi: ["1930", "1942", "1947", "1950"],
    answer: 2,
  },
  {
    prompt: "🌊 Which river flows through Varanasi?",
    promptHi: "🌊 वाराणसी से कौन सी नदी बहती है?",
    options: ["Yamuna", "Ganga", "Godavari", "Narmada"],
    optionsHi: ["यमुना", "गंगा", "गोदावरी", "नर्मदा"],
    answer: 1,
  },
  {
    prompt: "⛰️ Which mountain range lies to the north of India?",
    promptHi: "⛰️ भारत के उत्तर में कौन सी पर्वत श्रृंखला है?",
    options: ["Aravalli", "Western Ghats", "Satpura", "Himalaya"],
    optionsHi: ["अरावली", "पश्चिमी घाट", "सतपुड़ा", "हिमालय"],
    answer: 3,
  },
  {
    prompt: "🧭 Kerala lies on which coast of India?",
    promptHi: "🧭 केरल भारत के किस तट पर स्थित है?",
    options: ["West coast", "East coast", "North coast", "Central plateau"],
    optionsHi: ["पश्चिमी तट", "पूर्वी तट", "उत्तरी तट", "मध्य पठार"],
    answer: 0,
  },
  {
    prompt: "📜 The Constitution of India came into force in which year?",
    promptHi: "📜 भारत का संविधान किस वर्ष लागू हुआ?",
    options: ["1947", "1948", "1950", "1952"],
    optionsHi: ["1947", "1948", "1950", "1952"],
    answer: 2,
  },
  {
    prompt: "🌾 Which state is the largest producer of tea in India?",
    promptHi: "🌾 भारत में चाय का सबसे बड़ा उत्पादक राज्य कौन सा है?",
    options: ["Assam", "Punjab", "Gujarat", "Bihar"],
    optionsHi: ["असम", "पंजाब", "गुजरात", "बिहार"],
    answer: 0,
  },
  {
    prompt: "🏙️ Which city is called the 'Gateway of India'?",
    promptHi: "🏙️ किस शहर को 'भारत का प्रवेश द्वार' कहा जाता है?",
    options: ["Chennai", "Mumbai", "Kolkata", "Kochi"],
    optionsHi: ["चेन्नई", "मुंबई", "कोलकाता", "कोच्चि"],
    answer: 1,
  },
];

function MapDetective({ hi }: { hi: boolean }) {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<"none" | "ok" | "no">("none");

  const left = useCountdown(running, () => {
    setRunning(false);
    setDone(true);
  });

  function start() {
    setScore(0);
    setDone(false);
    setIdx(Math.floor(Math.random() * MAP_QUESTIONS.length));
    setFeedback("none");
    setRunning(false);
    setTimeout(() => setRunning(true), 0);
  }

  useRoundTelemetry(done, score, "map-legend-detective", "Map Legend Detective", "Social Science", "Class 6-8");

  const q = MAP_QUESTIONS[idx]!;

  function pick(i: number) {
    if (i === q.answer) {
      playRewardSound();
      setScore((s) => s + 1);
      setFeedback("ok");
    } else {
      setFeedback("no");
    }
    setTimeout(() => {
      setFeedback("none");
      setIdx((prev) => (prev + 1 + Math.floor(Math.random() * 3)) % MAP_QUESTIONS.length);
    }, 450);
  }

  return (
    <>
      <GameShell
        title={hi ? "🗺️ मानचित्र जासूस" : "🗺️ Map Legend Detective"}
        subtitle={
          hi
            ? "60 सेकंड में अधिक से अधिक राज्य, राजधानी और तिथि कार्ड सही पहचानिए।"
            : "Identify as many states, capitals and timeline dates as you can before the clock hits zero."
        }
        badge={hi ? "कक्षा 6-8 · सामाजिक विज्ञान" : "Class 6-8 · Social Science"}
        running={running}
        left={left}
        score={score}
        onStart={start}
      >
        <div
          className={`rounded-xl border-2 p-5 text-center text-lg font-semibold transition-colors ${
            feedback === "ok"
              ? "border-emerald-500 bg-emerald-500/10"
              : feedback === "no"
                ? "border-destructive bg-destructive/10"
                : "border-dashed bg-muted/40"
          }`}
        >
          {hi ? q.promptHi : q.prompt}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {(hi ? q.optionsHi : q.options).map((opt, i) => (
            <Button key={opt} variant="outline" className="h-14 justify-start text-left" onClick={() => pick(i)}>
              <span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>
              <span className="truncate">{opt}</span>
            </Button>
          ))}
        </div>
      </GameShell>
      <CelebrationSplash
        open={done}
        title={hi ? "🎉 अद्भुत कार्य!" : "🎉 Detective round over!"}
        subtitle={hi ? `आपने ${score} सही उत्तर दिए।` : `You solved ${score} map clues in 60 seconds.`}
        actionLabel={hi ? "फिर से खेलें" : "Play again"}
        onAction={start}
      />
    </>
  );
}


const SPRINT_TOPICS = [
  { key: "Fractions", subject: "Math", classLevel: "Class 5" },
  { key: "Photosynthesis", subject: "Science", classLevel: "Class 7" },
  { key: "Indian Rivers", subject: "Social Science", classLevel: "Class 6" },
  { key: "Percentages", subject: "Math", classLevel: "Class 8" },
] as const;

type SprintQuestion = { prompt_en: string; prompt_hi: string; options_en: string[]; options_hi: string[]; answer: number };

function AiLogicSprint({ hi }: { hi: boolean }) {
  const generate = useServerFn(generateLiveQuiz);
  const [topic, setTopic] = useState<(typeof SPRINT_TOPICS)[number]>(SPRINT_TOPICS[0]);
  const [questions, setQuestions] = useState<SprintQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const left = useCountdown(running, () => {
    setRunning(false);
    setDone(true);
  });

  useRoundTelemetry(done, score, `ai-logic-sprint:${topic.key}`, `AI Logic Sprint — ${topic.key}`, topic.subject, topic.classLevel);

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDone(false);
    setScore(0);
    setIdx(0);
    setPicked(null);
    try {
      const res = await generate({
        data: {
          subject: topic.subject,
          topic: topic.key,
          classLevel: topic.classLevel,
          language: hi ? "Hindi" : "English",
          difficulty: "Medium",
          variant: Math.floor(Math.random() * 10000),
          count: 10,
          mode: "single",
          rows: [],
        },
      });
      const list = (res.questions ?? []) as SprintQuestion[];
      if (list.length === 0) throw new Error("empty");
      setQuestions(list);
      setRunning(false);
      setTimeout(() => setRunning(true), 0);
    } catch {
      setError(hi ? "एआई प्रश्न लोड नहीं हो सके। पुनः प्रयास करें।" : "Could not load fresh AI questions. Try again.");
    } finally {
      setLoading(false);
    }
  }, [generate, hi, topic]);

  const q = questions[idx];

  function pick(i: number) {
    if (picked !== null || !q) return;
    setPicked(i);
    if (i === q.answer) {
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
    }, 500);
  }

  return (
    <>
      <GameShell
        title={hi ? "✨ एआई लॉजिक स्प्रिंट" : "✨ AI Logic Sprint"}
        subtitle={
          hi
            ? "हर राउंड में एआई ताज़े, बिना दोहराव वाले शैक्षणिक प्रश्न बनाता है।"
            : "Every round asks the AI engine for a freshly randomized set of academic logic problems — never repeated dummy data."
        }
        badge={`${topic.classLevel} · ${topic.subject}`}
        running={running}
        left={left}
        score={score}
        onStart={() => void start()}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {SPRINT_TOPICS.map((tp) => (
              <Button
                key={tp.key}
                size="sm"
                variant={tp.key === topic.key ? "default" : "outline"}
                disabled={running || loading}
                onClick={() => setTopic(tp)}
              >
                {tp.key}
              </Button>
            ))}
          </div>

          {loading && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              {hi ? "एआई नए प्रश्न बना रहा है…" : "AI is synthesizing a fresh question set…"}
            </p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}

          {running && q && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {hi ? "प्रश्न" : "Question"} {idx + 1}/{questions.length}
              </p>
              <p className="text-lg font-semibold">{hi ? q.prompt_hi || q.prompt_en : q.prompt_en}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {(hi ? q.options_hi?.length ? q.options_hi : q.options_en : q.options_en).map((opt, i) => (
                  <Button
                    key={`${opt}-${i}`}
                    variant={picked === i ? (i === q.answer ? "default" : "destructive") : "outline"}
                    className="h-auto justify-start whitespace-normal py-3 text-left"
                    onClick={() => pick(i)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {!running && !loading && questions.length === 0 && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-primary" />
              {hi ? "शुरू करने पर एआई नए प्रश्न बनाएगा।" : "Press start and the AI will generate a brand-new question set."}
            </p>
          )}
        </div>
      </GameShell>
      <CelebrationSplash show={done && score > 0} label={`${score} ${hi ? "सही" : "correct"}`} />
    </>
  );
}
