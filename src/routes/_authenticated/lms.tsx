import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  OFFLINE_LMS_RESOURCES,
  LMS_SUBJECTS,
  LMS_CLASSES,
  LMS_LANGUAGES,
  type LmsResource,
} from "@/lib/offline-lms";
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
import { ArrowLeft, ArrowRight, RotateCw, BookOpen, WifiOff } from "lucide-react";

export const Route = createFileRoute("/_authenticated/lms")({
  head: () => ({
    meta: [
      { title: "Offline LMS & Flashcard Hub | Regional-Language Game Library" },
      {
        name: "description",
        content:
          "Offline study summaries and flip-card decks for Math, Science and Social Science in English and Hindi, Class 1 to 5.",
      },
      { property: "og:title", content: "Offline LMS & Flashcard Hub" },
      {
        property: "og:description",
        content: "Bilingual lesson summaries and gamified flashcard decks that work with zero network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LmsHubPage,
});

const ALL = "all";

function LmsHubPage() {
  const [language, setLanguage] = useState<string>("English");
  const [classLevel, setClassLevel] = useState<string>(ALL);
  const [subject, setSubject] = useState<string>(ALL);

  const filtered = useMemo(
    () =>
      OFFLINE_LMS_RESOURCES.filter(
        (r) =>
          (language === ALL || r.language === language) &&
          (classLevel === ALL || r.classLevel === classLevel) &&
          (subject === ALL || r.subject === subject),
      ),
    [language, classLevel, subject],
  );

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">📖 Offline LMS &amp; Flashcard Hub</h1>
        <p className="text-sm text-muted-foreground">
          Pre-loaded lesson summaries and flip-card decks. Everything below is stored in the app —
          filters run instantly with no network requests.
        </p>
      </header>

      <Card className="no-print">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filter study material</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <WifiOff className="size-3.5" /> 100% offline · {OFFLINE_LMS_RESOURCES.length} resources bundled
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <FilterSelect label="Language" value={language} onChange={setLanguage} options={[...LMS_LANGUAGES]} allLabel="All languages" />
          <FilterSelect label="Class" value={classLevel} onChange={setClassLevel} options={[...LMS_CLASSES]} allLabel="All classes" />
          <FilterSelect label="Subject" value={subject} onChange={setSubject} options={[...LMS_SUBJECTS]} allLabel="All subjects" />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> study guides
      </p>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No study material matches these filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {filtered.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  allLabel: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
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

function ResourceCard({ resource }: { resource: LmsResource }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{resource.subject}</Badge>
          <Badge variant="outline">{resource.classLevel}</Badge>
          <Badge variant="outline">{resource.language}</Badge>
        </div>
        <CardTitle className="mt-2 flex items-center gap-2 text-lg">
          <span aria-hidden>{resource.emoji}</span>
          {resource.title}
        </CardTitle>
        <CardDescription>{resource.topic}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <section className="rounded-lg border bg-muted/40 p-4">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <BookOpen className="size-4 text-primary" /> Core summary
          </h3>
          <ul className="space-y-2 text-sm leading-relaxed">
            {resource.summary.map((point, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary" aria-hidden>
                  •
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <FlashcardDeck resource={resource} />
      </CardContent>
    </Card>
  );
}

function FlashcardDeck({ resource }: { resource: LmsResource }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const cards = resource.flashcards;

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [resource.id]);

  const card = cards[index]!;

  const go = (delta: number) => {
    setFlipped(false);
    setIndex((i) => (i + delta + cards.length) % cards.length);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">🃏 Flashcard deck</h3>
        <span className="text-xs font-medium text-muted-foreground">
          Card {index + 1} of {cards.length}
        </span>
      </div>

      <div className="flip-scene h-44 sm:h-40">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? "Show question" : "Show answer"}
          className={`flip-card h-full cursor-pointer rounded-xl text-left ${flipped ? "is-flipped" : ""}`}
        >
          <div className="flip-face rounded-xl border-2 border-primary/40 bg-primary/5 p-5 text-center">
            <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">
              Question
            </span>
            <p className="text-base font-semibold leading-snug">{card.front}</p>
            <span className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <RotateCw className="size-3" /> Tap to flip
            </span>
          </div>
          <div className="flip-face flip-face-back rounded-xl border-2 border-accent/50 bg-accent/10 p-5 text-center">
            <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-accent-foreground/70">
              Answer
            </span>
            <p className="text-base font-medium leading-snug">{card.back}</p>
            <span className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <RotateCw className="size-3" /> Tap to flip back
            </span>
          </div>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => go(-1)}>
          <ArrowLeft className="size-4" /> ⬅️ Previous Card
        </Button>
        <Button variant="outline" size="sm" onClick={() => go(1)}>
          ➡️ Next Card <ArrowRight className="size-4" />
        </Button>
        <div className="ml-auto flex gap-1">
          {cards.map((_, i) => (
            <span
              key={i}
              className={`size-1.5 rounded-full ${i === index ? "bg-primary" : "bg-muted-foreground/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
