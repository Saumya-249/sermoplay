import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const COLORS = [
  "hsl(var(--primary))",
  "#f59e0b",
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
];

export function Confetti({ pieces = 70 }: { pieces?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        drift: `${Math.round((Math.random() - 0.5) * 160)}px`,
        delay: `${Math.random() * 0.6}s`,
        duration: `${2 + Math.random() * 1.6}s`,
        color: COLORS[i % COLORS.length],
        rounded: i % 3 === 0,
      })),
    [pieces],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {bits.map((b) => (
        <span
          key={b.id}
          className="confetti-piece"
          style={{
            left: `${b.left}%`,
            background: b.color,
            borderRadius: b.rounded ? "50%" : undefined,
            animationDelay: b.delay,
            animationDuration: b.duration,
            ["--drift" as string]: b.drift,
          }}
        />
      ))}
    </div>
  );
}

/** Plays a short major-chord chime with the Web Audio API (no asset files). */
export function playRewardSound() {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.11;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.42);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.45);
    });
    window.setTimeout(() => void ctx.close(), 1400);
  } catch {
    /* audio unavailable — game stays fully playable */
  }
}

export function CelebrationSplash({
  open,
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  open: boolean;
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(open);
    if (open) playRewardSound();
  }, [open]);

  if (!open || !mounted) return null;

  return (
    <>
      <Confetti />
      <div className="fixed inset-0 z-[61] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
        <div className="splash-in w-full max-w-sm rounded-2xl border bg-card p-6 text-center shadow-xl">
          <p className="text-3xl font-bold">{title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <Button className="mt-5 w-full" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      </div>
    </>
  );
}