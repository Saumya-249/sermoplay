import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { localizeGameText } from "@/lib/game-i18n";
import { pickLang, ECO_ACTIONS } from "@/lib/contextual-games";
import {
  CURRENCY_TOKENS,
  WEIGHT_TOKENS,
  type ArcadeData,
  type ArcadeGame,
} from "@/lib/arcade-catalog";

export type EngineProps = {
  game: ArcadeGame;
  data: ArcadeData;
  /** Award points and mark the pick correct/wrong for the HUD. */
  onScore: (points: number, correct: boolean) => void;
  onFinish: () => void;
};

const shuffle = <T,>(arr: T[]): T[] => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
};

function RoundStrip({ index, total }: { index: number; total: number }) {
  const { t } = useI18n();
  return (
    <Badge variant="secondary" className="text-xs">
      {t("roundLabel")} {Math.min(index + 1, total)} / {total}
    </Badge>
  );
}

/* ----------------------------- Choice engine ----------------------------- */

export function ChoiceEngine({ game, data, onScore, onFinish }: EngineProps) {
  const { lang } = useI18n();
  const rounds = data.rounds ?? [];
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const round = rounds[index];
  if (!round) return null;

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === round.correct;
    onScore(ok ? 10 : 0, ok);
    window.setTimeout(() => {
      setPicked(null);
      if (index + 1 >= rounds.length) onFinish();
      else setIndex((n) => n + 1);
    }, 750);
  };

  return (
    <div className="space-y-5">
      <RoundStrip index={index} total={rounds.length} />
      <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 text-center">
        <span className="text-4xl" aria-hidden>
          {game.emoji}
        </span>
        <p className="mt-3 text-xl font-bold leading-snug">{localizeGameText(round.q, lang)}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {round.options.map((o, i) => {
          const state =
            picked === null
              ? "border-border hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              : i === round.correct
                ? "border-emerald-500 bg-emerald-500/15"
                : i === picked
                  ? "border-destructive bg-destructive/10"
                  : "border-border opacity-60";
          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              className={`rounded-xl border-2 p-4 text-left text-base font-semibold transition ${state}`}
            >
              {localizeGameText(o, lang)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------- Tokens engine ----------------------------- */

export function TokensEngine({ game, data, onScore, onFinish }: EngineProps) {
  const { t, lang } = useI18n();
  const weight = game.tokenSet === "weight";
  const denominations = weight ? WEIGHT_TOKENS : CURRENCY_TOKENS;
  const rounds = data.tokens ?? [];
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<{ id: number; value: number }[]>([]);

  const round = rounds[index];
  const total = picks.reduce((s, p) => s + p.value, 0);
  const target = round?.target ?? 0;
  const matched = round ? Math.abs(total - target) < 0.001 && picks.length > 0 : false;
  const over = total > target + 0.001;

  useEffect(() => {
    if (!matched) return;
    onScore(15, true);
    const id = window.setTimeout(() => {
      setPicks([]);
      if (index + 1 >= rounds.length) onFinish();
      else setIndex((n) => n + 1);
    }, 900);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  if (!round) return null;
  const fmt = (n: number) => (weight ? `${n} kg` : `₹${n}`);

  return (
    <div className="space-y-5">
      <RoundStrip index={index} total={rounds.length} />
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-primary/30 bg-card p-4">
        <span className="text-5xl" aria-hidden>
          {round.emoji ?? game.emoji}
        </span>
        <p className="text-lg font-bold">{localizeGameText(round.label, lang)}</p>
        <Badge className="ml-auto text-base">
          {weight ? t("targetWeight") : t("targetAmount")}: {fmt(target)}
        </Badge>
      </div>

      <div className="flex min-h-24 flex-wrap content-start gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-muted/40 p-3">
        {picks.length === 0 && (
          <p className="m-auto text-xs text-muted-foreground">
            {weight ? t("weightHint") : t("tapCoinsHint")}
          </p>
        )}
        {picks.map((p) => (
          <span
            key={p.id}
            className="token-pop flex h-11 min-w-16 items-center justify-center rounded-lg border-2 border-emerald-600/60 bg-emerald-400/25 px-2 text-sm font-bold"
          >
            {fmt(p.value)}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p className={`text-lg font-bold ${over ? "text-destructive" : matched ? "text-emerald-600" : ""}`}>
          {t("yourTotal")}: {fmt(Number(total.toFixed(2)))} / {fmt(target)}
        </p>
        <Button variant="outline" size="sm" onClick={() => setPicks([])}>
          🔄 {t("resetLabel")}
        </Button>
        {over && <span className="text-xs text-destructive">{t("tooMuch")}</span>}
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {denominations.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setPicks((p) => [...p, { id: Date.now() + Math.random(), value: d }])}
            className="rounded-xl border-2 border-amber-500/50 bg-amber-400/15 p-3 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {fmt(d)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- Fraction engine ---------------------------- */

export function FractionEngine({ game, data, onScore, onFinish }: EngineProps) {
  const { t, lang } = useI18n();
  const rounds = data.fractions ?? [];
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);

  const round = rounds[index];
  const done = round ? selected.length === round.numerator : false;

  useEffect(() => {
    if (!done) return;
    onScore(15, true);
    const id = window.setTimeout(() => {
      setSelected([]);
      if (index + 1 >= rounds.length) onFinish();
      else setIndex((n) => n + 1);
    }, 900);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  if (!round) return null;
  const slices = Math.max(2, Math.min(12, round.denominator));

  return (
    <div className="space-y-5">
      <RoundStrip index={index} total={rounds.length} />
      <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 text-center">
        <span className="text-5xl" aria-hidden>
          {round.emoji ?? game.emoji}
        </span>
        <p className="mt-2 text-lg font-bold">{localizeGameText(round.label, lang)}</p>
        <p className="text-3xl font-black text-primary">
          {round.numerator}/{round.denominator}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{t("fractionHint")}</p>
      </div>

      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        {Array.from({ length: slices }, (_, i) => {
          const on = selected.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() =>
                setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))
              }
              className={`aspect-square rounded-xl border-2 text-2xl transition ${
                on
                  ? "border-amber-600 bg-amber-400/40 scale-95"
                  : "border-dashed border-muted-foreground/40 bg-muted/30 hover:border-primary"
              }`}
              aria-pressed={on}
            >
              {on ? "🍕" : ""}
            </button>
          );
        })}
      </div>
      <p className="text-center text-sm font-semibold">
        {selected.length} / {round.numerator}
      </p>
    </div>
  );
}

/* ------------------------------ Sort engine ------------------------------ */

export function SortEngine({ data, onScore, onFinish }: EngineProps) {
  const { t, lang } = useI18n();
  const bins = data.bins ?? [];
  const [pool, setPool] = useState(() => shuffle(data.items ?? []));
  const [active, setActive] = useState<number | null>(null);
  const [wrongBin, setWrongBin] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string[]>>({});

  const drop = (bin: string) => {
    if (active === null) return;
    const item = pool[active]!;
    if (item.bin === bin) {
      onScore(10, true);
      setPlaced((p) => ({ ...p, [bin]: [...(p[bin] ?? []), item.label] }));
      const rest = pool.filter((_, i) => i !== active);
      setPool(rest);
      setActive(null);
      if (rest.length === 0) window.setTimeout(onFinish, 600);
    } else {
      onScore(0, false);
      setWrongBin(bin);
      window.setTimeout(() => setWrongBin(null), 500);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">{t("tapBinHint")}</p>
      <div className="flex min-h-20 flex-wrap gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-muted/30 p-3">
        {pool.map((item, i) => (
          <button
            key={item.label + i}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
              active === i
                ? "border-primary bg-primary/15 scale-105"
                : "border-border bg-card hover:border-primary"
            }`}
          >
            {localizeGameText(item.label, lang)}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {bins.map((bin) => (
          <button
            key={bin}
            type="button"
            onClick={() => drop(bin)}
            className={`min-h-32 rounded-xl border-2 p-3 text-left transition ${
              wrongBin === bin
                ? "border-destructive bg-destructive/10"
                : "border-primary/40 bg-primary/5 hover:border-primary"
            }`}
          >
            <p className="text-sm font-bold">{localizeGameText(bin, lang)}</p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {(placed[bin] ?? []).map((l) => (
                <li key={l}>✅ {localizeGameText(l, lang)}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Order engine ----------------------------- */

export function OrderEngine({ data, onScore, onFinish }: EngineProps) {
  const { t, lang } = useI18n();
  const sequence = useMemo(() => [...(data.sequence ?? [])].sort((a, b) => a.order - b.order), [data]);
  const [pool, setPool] = useState(() => shuffle(sequence));
  const [step, setStep] = useState(0);
  const [line, setLine] = useState<string[]>([]);
  const [shake, setShake] = useState<string | null>(null);

  const tap = (label: string, order: number) => {
    const expected = sequence[step]?.order;
    if (order === expected) {
      onScore(10, true);
      setLine((l) => [...l, label]);
      const rest = pool.filter((x) => x.label !== label);
      setPool(rest);
      setStep((s) => s + 1);
      if (rest.length === 0) window.setTimeout(onFinish, 600);
    } else {
      onScore(0, false);
      setShake(label);
      window.setTimeout(() => setShake(null), 450);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">{t("tapOrderHint")}</p>
      <ol className="space-y-2">
        {line.map((l, i) => (
          <li
            key={l}
            className="rounded-lg border-2 border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-sm font-semibold"
          >
            {i + 1}. {localizeGameText(l, lang)}
          </li>
        ))}
        {pool.length > 0 && (
          <li className="rounded-lg border-2 border-dashed border-primary/40 px-3 py-2 text-xs text-muted-foreground">
            {line.length + 1}. …
          </li>
        )}
      </ol>
      <div className="grid gap-2 sm:grid-cols-2">
        {pool.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => tap(item.label, item.order)}
            className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary ${
              shake === item.label ? "border-destructive bg-destructive/10" : "border-border bg-card"
            }`}
          >
            🏷️ {localizeGameText(item.label, lang)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Meters engine ---------------------------- */

type Metrics = { water: number; nutrients: number; pest: number };

export function MetersEngine({ data, onScore, onFinish }: EngineProps) {
  const { t, lang } = useI18n();
  const [metrics, setMetrics] = useState<Metrics>({ water: 0, nutrients: 0, pest: 0 });
  const [moves, setMoves] = useState(0);
  const balanced = metrics.water === 100 && metrics.nutrients === 100 && metrics.pest === 100;

  useEffect(() => {
    if (!balanced) return;
    onScore(50, true);
    const id = window.setTimeout(onFinish, 800);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanced]);

  const clamp = (n: number) => Math.max(0, Math.min(150, n));
  const apply = (e: Metrics) => {
    setMetrics((m) => ({
      water: clamp(m.water + e.water),
      nutrients: clamp(m.nutrients + e.nutrients),
      pest: clamp(m.pest + e.pest),
    }));
    setMoves((n) => n + 1);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 rounded-2xl border-2 border-primary/30 p-4">
        <span className="text-5xl" aria-hidden>
          🌾
        </span>
        <div>
          <p className="text-lg font-bold">{localizeGameText(data.crop?.name ?? "Paddy field", lang)}</p>
          <p className="text-sm text-muted-foreground">
            {localizeGameText(data.crop?.hint ?? "Balance all three meters at 100%.", lang)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <MetricBar label={t("waterReq")} value={metrics.water} tone="bg-sky-500" />
        <MetricBar label={t("soilNutrients")} value={metrics.nutrients} tone="bg-amber-600" />
        <MetricBar label={t("pestProtection")} value={metrics.pest} tone="bg-emerald-600" />
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
            <p className="mt-2 text-sm font-semibold">{pickLang(a.label, lang)}</p>
            <p className="text-xs text-muted-foreground">{pickLang(a.note, lang)}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary">
          {t("movesLabel")}: {moves}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setMetrics({ water: 0, nutrients: 0, pest: 0 });
            setMoves(0);
          }}
        >
          🔄 {t("resetLabel")}
        </Button>
      </div>
    </div>
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

export const ENGINES: Record<ArcadeGame["engine"], (p: EngineProps) => React.ReactElement | null> = {
  choice: ChoiceEngine,
  tokens: TokensEngine,
  fraction: FractionEngine,
  sort: SortEngine,
  order: OrderEngine,
  meters: MetersEngine,
};
