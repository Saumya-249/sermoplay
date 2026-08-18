import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BAZAAR_ITEMS,
  CROPS,
  DENOMINATIONS,
  ECO_ACTIONS,
  GAME_CLASSES,
  GAME_LANGUAGES,
  GAME_SUBJECTS,
  T,
  type GameLanguage,
} from "@/lib/contextual-games";
import { CelebrationSplash } from "@/components/games/celebration";
import { useApp } from "@/lib/app-context";
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
import { Gamepad2, WifiOff } from "lucide-react";

export const Route = createFileRoute("/_authenticated/games")({
  head: () => ({
    meta: [
      { title: "Interactive Contextual Games Hub | Sermo Play" },
      {
        name: "description",
        content:
          "Play offline contextual classroom games — the Regional Bazaar currency counter and the Farmer's Ecosystem Balance simulator, in English and Hindi.",
      },
      { property: "og:title", content: "Interactive Contextual Games Hub | Sermo Play" },
      {
        property: "og:description",
        content:
          "Play offline contextual classroom games — the Regional Bazaar currency counter and the Farmer's Ecosystem Balance simulator, in English and Hindi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GamesHubPage,
});

function GamesHubPage() {
  const { registeredClass, classLocked } = useApp();
  const [language, setLanguage] = useState<GameLanguage>("English");
  const [subject, setSubject] = useState<string>("Math");
  const [classLevel, setClassLevel] = useState<string>(
    classLocked && registeredClass ? registeredClass : "Class 3",
  );
  useEffect(() => {
    if (classLocked && registeredClass) setClassLevel(registeredClass);
  }, [classLocked, registeredClass]);

  const showBazaar = subject === "Math";
  const crop = CROPS[classLevel] ?? CROPS["Class 3"]!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{T.hubTitle[language]}</h1>
        <p className="text-sm text-muted-foreground">
          {language === "Hindi"
            ? "बिना इंटरनेट चलने वाले चित्रात्मक कक्षा खेल।"
            : "Graphic-driven classroom games that run fully offline."}
        </p>
      </div>

      <Card>
        <CardContent className="grid gap-3 pt-6 sm:grid-cols-3">
          <Filter label={language === "Hindi" ? "भाषा" : "Language"} value={language} onChange={(v) => setLanguage(v as GameLanguage)} options={[...GAME_LANGUAGES]} />
          <Filter label={language === "Hindi" ? "विषय" : "Subject"} value={subject} onChange={setSubject} options={[...GAME_SUBJECTS]} />
          <Filter label={language === "Hindi" ? "कक्षा" : "Class"} value={classLevel} onChange={setClassLevel} options={[...GAME_CLASSES]} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary" className="gap-1">
          <WifiOff className="size-3" /> {language === "Hindi" ? "पूर्णतः ऑफलाइन" : "Fully offline"}
        </Badge>
        <Badge variant="outline" className="gap-1">
          <Gamepad2 className="size-3" /> {subject} · {classLevel} · {language}
        </Badge>
      </div>

      {showBazaar ? (
        <BazaarGame language={language} classLevel={classLevel} />
      ) : (
        <EcosystemGame language={language} crop={crop} />
      )}
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/* ---------------- Game 1: Regional Bazaar Currency Counter ---------------- */

function BazaarGame({ language, classLevel }: { language: GameLanguage; classLevel: string }) {
  const items = BAZAAR_ITEMS[classLevel] ?? BAZAAR_ITEMS["Class 3"]!;
  const [itemIndex, setItemIndex] = useState(0);
  const [tokens, setTokens] = useState<{ id: number; value: number; kind: "coin" | "note" }[]>([]);
  const [won, setWon] = useState(false);
  const { userId } = useApp();
  useEffect(() => {
    if (!won) return;
    void logGameSession({
      userId,
      moduleKey: "bazaar-currency-counter",
      moduleLabel: "Regional Bazaar Currency Counter",
      subject: "Math",
      classLevel,
      score: itemIndex + 1,
    });
  }, [won, userId, classLevel, itemIndex]);

  const item = items[Math.min(itemIndex, items.length - 1)]!;
  const target = item.unitPrice * item.quantity;
  const currentTotal = tokens.reduce((s, t) => s + t.value, 0);

  useEffect(() => {
    setTokens([]);
    setWon(false);
    setItemIndex(0);
  }, [classLevel]);

  useEffect(() => {
    if (currentTotal === target && tokens.length > 0) setWon(true);
  }, [currentTotal, target, tokens.length]);

  const addToken = (value: number, kind: "coin" | "note") =>
    setTokens((t) => [...t, { id: Date.now() + Math.random(), value, kind }]);

  const nextItem = () => {
    setTokens([]);
    setWon(false);
    setItemIndex((i) => (i + 1) % items.length);
  };

  const over = currentTotal > target;

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            🏪 {language === "Hindi" ? "क्षेत्रीय बाज़ार — मुद्रा गिनती" : "Regional Bazaar Currency Counter"}
          </CardTitle>
          <CardDescription>
            {language === "Hindi"
              ? "सही राशि बनाने के लिए सिक्के और नोट चुनें।"
              : "Pick coins and notes to build the exact amount."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="flex items-center gap-4 rounded-xl border-2 border-primary/30 bg-card p-4">
            <span className="text-5xl" aria-hidden>
              {item.emoji}
            </span>
            <div>
              <p className="text-lg font-bold">{item.name[language]}</p>
              <p className="text-sm text-muted-foreground">
                {T.price[language]}: ₹{item.unitPrice} x {item.quantity}
              </p>
            </div>
            <Badge className="ml-auto text-base">₹{target}</Badge>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">{T.yourAmount[language]}</p>
            <div className="flex min-h-28 flex-wrap content-start gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-muted/40 p-3">
              {tokens.length === 0 && (
                <p className="m-auto text-xs text-muted-foreground">{T.tapHint[language]}</p>
              )}
              {tokens.map((t) => (
                <span
                  key={t.id}
                  className={
                    t.kind === "coin"
                      ? "token-pop flex size-12 items-center justify-center rounded-full border-2 border-amber-500/60 bg-amber-400/30 text-sm font-bold"
                      : "token-pop flex h-12 w-20 items-center justify-center rounded-md border-2 border-emerald-600/60 bg-emerald-400/25 text-sm font-bold"
                  }
                >
                  ₹{t.value}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className={`text-lg font-bold ${over ? "text-destructive" : ""}`}>
              {T.total[language]}: ₹{currentTotal} / ₹{target}
            </p>
            <Button variant="outline" size="sm" onClick={() => { setTokens([]); setWon(false); }}>
              {T.reset[language]}
            </Button>
            {over && (
              <span className="text-xs text-destructive">
                {language === "Hindi" ? "राशि अधिक हो गई — हटाएँ दबाएँ।" : "Too much — tap reset."}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {DENOMINATIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => addToken(d.value, d.kind)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${
                  d.kind === "coin"
                    ? "border-amber-500/50 bg-amber-400/15"
                    : "border-emerald-600/50 bg-emerald-400/15"
                }`}
              >
                <span
                  className={
                    d.kind === "coin"
                      ? "flex size-10 items-center justify-center rounded-full border-2 border-amber-500/70 bg-amber-300/40 text-sm font-bold"
                      : "flex h-10 w-16 items-center justify-center rounded-md border-2 border-emerald-600/70 bg-emerald-300/35 text-sm font-bold"
                  }
                  aria-hidden
                >
                  ₹{d.value}
                </span>
                {d.label[language]}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <CelebrationSplash
        open={won}
        title={T.celebrate[language]}
        subtitle={T.celebrateSub[language]}
        actionLabel={language === "Hindi" ? "अगली वस्तु" : "Next item"}
        onAction={nextItem}
      />
    </>
  );
}

/* ---------------- Game 2: Farmer's Ecosystem Balance ---------------- */

type Metrics = { water: number; nutrients: number; pest: number };

function EcosystemGame({
  language,
  crop,
}: {
  language: GameLanguage;
  crop: (typeof CROPS)[string];
}) {
  const [metrics, setMetrics] = useState<Metrics>({ water: 0, nutrients: 0, pest: 0 });
  const [moves, setMoves] = useState(0);
  const { userId } = useApp();

  const balanced = useMemo(
    () => metrics.water === 100 && metrics.nutrients === 100 && metrics.pest === 100,
    [metrics],
  );

  useEffect(() => {
    if (!balanced) return;
    void logGameSession({
      userId,
      moduleKey: "farmer-ecosystem-balance",
      moduleLabel: "Farmer's Ecosystem Balance",
      subject: "Science",
      classLevel: "Class 3",
      score: Math.max(1, 30 - moves),
    });
  }, [balanced, userId, moves]);

  useEffect(() => {
    setMetrics({ water: 0, nutrients: 0, pest: 0 });
    setMoves(0);
  }, [crop.id]);

  const clamp = (n: number) => Math.max(0, Math.min(150, n));

  const apply = (effect: Metrics) => {
    setMetrics((m) => ({
      water: clamp(m.water + effect.water),
      nutrients: clamp(m.nutrients + effect.nutrients),
      pest: clamp(m.pest + effect.pest),
    }));
    setMoves((n) => n + 1);
  };

  const reset = () => {
    setMetrics({ water: 0, nutrients: 0, pest: 0 });
    setMoves(0);
  };

  return (
    <>
      <Card>
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            🚜 {language === "Hindi" ? "किसान का पारिस्थितिकी संतुलन" : "Farmer's Ecosystem Balance"}
          </CardTitle>
          <CardDescription>{T.goal[language]}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="flex items-center gap-4 rounded-xl border-2 border-primary/30 p-4">
            <span className="text-5xl" aria-hidden>
              {crop.emoji}
            </span>
            <div>
              <p className="text-lg font-bold">{crop.name[language]}</p>
              <p className="text-sm text-muted-foreground">{crop.hint[language]}</p>
            </div>
          </div>

          <div className="space-y-4">
            <MetricBar label={T.water[language]} value={metrics.water} tone="bg-sky-500" />
            <MetricBar label={T.nutrients[language]} value={metrics.nutrients} tone="bg-amber-600" />
            <MetricBar label={T.pest[language]} value={metrics.pest} tone="bg-emerald-600" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ECO_ACTIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => apply(a.effect)}
                className={`rounded-xl border-2 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${a.tone}`}
              >
                <span className="text-3xl" aria-hidden>
                  {a.emoji}
                </span>
                <p className="mt-2 text-sm font-semibold">{a.label[language]}</p>
                <p className="text-xs text-muted-foreground">{a.note[language]}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">
              {language === "Hindi" ? "चालें" : "Moves"}: {moves}
            </Badge>
            <Button variant="outline" size="sm" onClick={reset}>
              {T.reset[language]}
            </Button>
          </div>
        </CardContent>
      </Card>

      <CelebrationSplash
        open={balanced}
        title={T.balanced[language]}
        subtitle={
          language === "Hindi"
            ? `आपने ${moves} चालों में फसल को संतुलित किया।`
            : `You balanced the crop in ${moves} moves.`
        }
        actionLabel={T.playAgain[language]}
        onAction={reset}
      />
    </>
  );
}

function MetricBar({ label, value, tone }: { label: string; value: number; tone: string }) {
  const over = value > 100;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-medium">
        <span>{label}</span>
        <span className={over ? "text-destructive" : value === 100 ? "text-emerald-600" : ""}>
          {value}% / 100%
        </span>
      </div>
      <div className="h-4 w-full overflow-hidden rounded-full border bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-300 ${over ? "bg-destructive" : tone}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}