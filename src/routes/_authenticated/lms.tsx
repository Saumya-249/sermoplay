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
import { useI18n, type UiLang } from "@/lib/i18n";
import { localizeGameText } from "@/lib/game-i18n";

export const Route = createFileRoute("/_authenticated/lms")({
  head: () => ({
    meta: [
      { title: "Offline LMS & Flashcard Hub | Sermo Play" },
      {
        name: "description",
        content:
          "Offline study summaries and flip-card decks for Math, Science and Social Science in English and Hindi, Class 1 to 5.",
      },
      { property: "og:title", content: "Offline LMS & Flashcard Hub | Sermo Play" },
      {
        property: "og:description",
        content: "Offline study summaries and flip-card decks for Math, Science and Social Science in English and Hindi, Class 1 to 5.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LmsHubPage,
});

import { useApp } from "@/lib/app-context";

const ALL = "all";

function LmsHubPage() {
  const { t, lang } = useI18n();
  const L = (s: string) => localizeGameText(s, lang);
  const [language, setLanguage] = useState<string>(lang === "hi" ? "Hindi" : "English");

  // Content language follows the global UI language so cards never lag behind.
  useEffect(() => {
    setLanguage(lang === "hi" ? "Hindi" : "English");
  }, [lang]);
  const { registeredClass, classLocked } = useApp();
  const lockedClass = classLocked ? registeredClass : null;
  const [classLevel, setClassLevel] = useState<string>(ALL);
  const [subject, setSubject] = useState<string>(ALL);

  const filtered = useMemo(
    () =>
      OFFLINE_LMS_RESOURCES.filter(
        (r) =>
          (language === ALL || r.language === language) &&
          (!lockedClass || r.classLevel === lockedClass) &&
          (classLevel === ALL || r.classLevel === classLevel) &&
          (subject === ALL || r.subject === subject),
      ),
    [language, classLevel, subject, lockedClass],
  );

  return (
    <div key={lang} className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">📖 {t("lmsTitle")}</h1>
        {lockedClass && (
          <p className="inline-block rounded-md bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">
            🔒 {t("lmsLockedTo")} {L(lockedClass)} {t("lmsLockedSuffix")}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {t("lmsSub")}
        </p>
      </header>

      <Card className="no-print">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("lmsFilterTitle")}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <WifiOff className="size-3.5" /> {t("lmsOfflinePrefix")} {OFFLINE_LMS_RESOURCES.length}{" "}
            {t("lmsResourcesBundled")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <FilterSelect
            label={t("language")}
            value={language}
            onChange={setLanguage}
            options={[...LMS_LANGUAGES]}
            allLabel={t("allLanguages")}
            lang={lang}
          />
          <FilterSelect
            label={t("classLabel")}
            value={classLevel}
            onChange={setClassLevel}
            options={[...LMS_CLASSES]}
            allLabel={t("allClasses")}
            lang={lang}
          />
          <FilterSelect
            label={t("subjectLabel")}
            value={subject}
            onChange={setSubject}
            options={[...LMS_SUBJECTS]}
            allLabel={t("allSubjects")}
            lang={lang}
          />
        </CardContent>
      </Card>

      <p className="text-sm font-medium text-muted-foreground">
        {t("lmsShowingGuides", { count: filtered.length })}
      </p>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {t("lmsNoMatch")}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {filtered.map((res) => (
            <ResourceCard key={`${res.id}-${lang}`} resource={res} />
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
  lang,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  allLabel: string;
  lang: UiLang;
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
              {localizeGameText(o, lang)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ResourceCard({ resource }: { resource: LmsResource }) {
  const { t, lang } = useI18n();
  const L = (s: string) => localizeGameText(s, lang);
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{L(resource.subject)}</Badge>
          <Badge variant="outline">{L(resource.classLevel)}</Badge>
          <Badge variant="outline">{L(resource.language)}</Badge>
        </div>
        <CardTitle className="mt-2 flex items-center gap-2 text-lg">
          <span aria-hidden>{resource.emoji}</span>
          {L(resource.title)}
        </CardTitle>
        <CardDescription>{L(resource.topic)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <section className="rounded-lg border bg-muted/40 p-4">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <BookOpen className="size-4 text-primary" /> {t("coreSummary")}
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
  const { t, lang } = useI18n();
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
        <h3 className="text-sm font-semibold">🃏 {t("flashcardDeck")}</h3>
        <span className="text-xs font-medium text-muted-foreground">
          {t("cardLabel")} {index + 1} {t("ofLabel")} {cards.length}
        </span>
      </div>

      <div className="flip-scene h-44 sm:h-40">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? t("questionLabel") : t("answerLabel")}
          className={`flip-card h-full cursor-pointer rounded-xl text-left ${flipped ? "is-flipped" : ""}`}
        >
          <div className="flip-face rounded-xl border-2 border-primary/40 bg-primary/5 p-5 text-center">
            <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">
              {t("questionLabel")}
            </span>
            <p className="text-base font-semibold leading-snug">{card.front}</p>
            <span className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <RotateCw className="size-3" /> {t("tapToFlip")}
            </span>
          </div>
          <div className="flip-face flip-face-back rounded-xl border-2 border-accent/50 bg-accent/10 p-5 text-center">
            <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-accent-foreground/70">
              {t("answerLabel")}
            </span>
            <p className="text-base font-medium leading-snug">{card.back}</p>
            <span className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <RotateCw className="size-3" /> {t("tapToFlipBack")}
            </span>
          </div>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => go(-1)}>
          <ArrowLeft className="size-4" /> {t("previousCard")}
        </Button>
        <Button variant="outline" size="sm" onClick={() => go(1)}>
          {t("nextCard")} <ArrowRight className="size-4" />
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
