import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronDown } from "lucide-react";
import {
  EXPLORER_CLASSES,
  SUBJECT_HI,
  getSyllabus,
  getSubtopics,
  isCurated,
  subjectsForClass,
  type ExplorerLanguage,
} from "@/lib/ncert-syllabus";
import { cn } from "@/lib/utils";

const LANGUAGES: { value: ExplorerLanguage; label: string }[] = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "हिंदी (Hindi)" },
];

type Result = { classLevel: number; subject: string; language: ExplorerLanguage; chapters: string[] };

export function CurriculumExplorer() {
  const [language, setLanguage] = useState<ExplorerLanguage | null>("English");
  const [classLevel, setClassLevel] = useState<number | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [openChapter, setOpenChapter] = useState<number | null>(null);

  const subjects = useMemo(() => (classLevel ? subjectsForClass(classLevel) : []), [classLevel]);
  const ready = Boolean(language && classLevel && subject);
  const hi = language === "Hindi";

  function pickClass(c: number) {
    setClassLevel(c);
    setSubject(null);
    setResult(null);
    setOpenChapter(null);
  }

  function show() {
    if (!language || !classLevel || !subject) return;
    setResult(null);
    setOpenChapter(null);
    setResult({ classLevel, subject, language, chapters: getSyllabus(classLevel, subject, language) });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">📚 Public Curriculum Explorer</CardTitle>
        <CardDescription>
          Pick a class, subject and language to view the prescribed NCERT-aligned chapter index — free and read-only.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[30rem] space-y-6 overflow-y-auto pr-1">
        <section>
          <h3 className="text-sm font-semibold">1. Class levels</h3>
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {EXPLORER_CLASSES.map((c) => (
              <Button
                key={c}
                type="button"
                size="sm"
                variant={classLevel === c ? "default" : "outline"}
                onClick={() => pickClass(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold">2. Subjects</h3>
          {classLevel === null ? (
            <p className="mt-2 rounded-md border border-dashed p-3 text-xs text-muted-foreground">
              Select a class first to load its NCERT subject track.
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {subjects.map((s) => (
                <Button
                  key={s}
                  type="button"
                  size="sm"
                  variant={subject === s ? "default" : "outline"}
                  onClick={() => {
                    setSubject(s);
                    setResult(null);
                  }}
                >
                  {hi ? (SUBJECT_HI[s] ?? s) : s}
                </Button>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-sm font-semibold">3. Language</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <Button
                key={l.value}
                type="button"
                size="sm"
                variant={language === l.value ? "default" : "outline"}
                onClick={() => {
                  setLanguage(l.value);
                  setResult(null);
                }}
              >
                {l.label}
              </Button>
            ))}
          </div>
        </section>

        <Button className="w-full" disabled={!ready} onClick={show}>
          <BookOpen className="size-4" /> 📖 Show Prescribed NCERT Syllabus
        </Button>

        {result && (
          <section className="rounded-xl border bg-muted/30 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Class {result.classLevel}</Badge>
              <Badge variant="secondary">
                {result.language === "Hindi" ? (SUBJECT_HI[result.subject] ?? result.subject) : result.subject}
              </Badge>
              <Badge variant="outline">{result.language === "Hindi" ? "हिंदी" : "English"}</Badge>
              {!isCurated(result.classLevel, result.subject) && (
                <Badge variant="outline">Indicative index</Badge>
              )}
            </div>
            <h4 className="mt-3 text-sm font-semibold">
              {result.language === "Hindi" ? "पाठ्यक्रम — अध्याय सूची" : "Prescribed syllabus — chapter index"}
            </h4>
            <ol className="mt-3 grid gap-2 sm:grid-cols-2">
              {result.chapters.map((ch, i) => {
                const open = openChapter === i;
                return (
                  <li key={ch} className="rounded-lg border bg-card text-sm">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenChapter(open ? null : i)}
                      className="flex w-full items-start gap-2 px-3 py-2 text-left"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="flex-1 leading-snug text-card-foreground">{ch}</span>
                      <ChevronDown
                        className={cn(
                          "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform",
                          open && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-out",
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <ul className="mx-3 mb-3 space-y-1 rounded-md border border-primary/20 bg-primary/5 p-3 text-xs text-foreground">
                          {getSubtopics(result.classLevel, result.subject, i, ch, result.language).map((s) => (
                            <li key={s} className="flex gap-2 leading-snug">
                              <span className="text-primary">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
