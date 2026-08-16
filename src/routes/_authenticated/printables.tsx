import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cachedQuizzes, cacheLibrarySection } from "@/lib/offline-library";
import { useApp } from "@/lib/app-context";
import { Worksheet, type WorksheetQuiz } from "@/components/printables/worksheet";
import { Printer, FileText, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/printables")({
  head: () => ({
    meta: [
      { title: "Printable Hub | Regional-Language Game Library" },
      {
        name: "description",
        content:
          "Generate black-and-white A4 classroom worksheets with QR codes from any quiz, then print or save as PDF.",
      },
      { property: "og:title", content: "Printable Hub | Regional-Language Game Library" },
      {
        property: "og:description",
        content: "Game-to-worksheet printables with scannable QR codes for low-device classrooms.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Printables,
});

type RawQuestion = {
  prompt?: string;
  prompt_en?: string;
  prompt_hi?: string;
  options?: string[];
  options_en?: string[];
  options_hi?: string[];
};

type QuizRow = {
  id: string;
  title: string;
  subject: string;
  class_level: string;
  language: string;
  topic?: string | null;
  questions: unknown;
};

function normalize(row: QuizRow): WorksheetQuiz {
  const hindi = row.language?.toLowerCase().includes("hindi");
  const raw = Array.isArray(row.questions) ? (row.questions as RawQuestion[]) : [];
  return {
    id: row.id,
    title: row.title,
    subject: row.subject,
    class_level: row.class_level,
    language: row.language,
    topic: row.topic ?? null,
    questions: raw.map((q) => ({
      prompt: (hindi ? q.prompt_hi : q.prompt_en) ?? q.prompt ?? q.prompt_en ?? q.prompt_hi ?? "",
      options: ((hindi ? q.options_hi : q.options_en) ?? q.options ?? q.options_en ?? []).slice(0, 4),
    })),
  };
}

function Printables() {
  const { online } = useApp();
  const [active, setActive] = useState<WorksheetQuiz | null>(null);

  const quizzes = useQuery({
    queryKey: ["printable-quizzes", online],
    queryFn: async () => {
      if (!online) return cachedQuizzes() as QuizRow[];
      const { data, error } = await supabase.from("quizzes").select("*").order("title");
      if (error) return cachedQuizzes() as QuizRow[];
      cacheLibrarySection("quizzes", data ?? []);
      return (data ?? []) as unknown as QuizRow[];
    },
  });

  const rows = useMemo(() => (quizzes.data ?? []).map(normalize), [quizzes.data]);

  const previewUrl = (id: string) =>
    typeof window === "undefined" ? `/quiz/${id}` : `${window.location.origin}/quiz/${id}`;

  const dedicatedPrintView =
    active && typeof document !== "undefined"
      ? createPortal(
          <div id="dedicated-worksheet-print-view" className="hidden" aria-hidden="true">
            <Worksheet quiz={active} url={previewUrl(active.id)} />
          </div>,
          document.body,
        )
      : null;

  return (
    <>
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Printable hub</h1>
        <p className="text-sm text-muted-foreground">
          Turn any quiz into a clean black-and-white A4 worksheet with a scannable QR code.
        </p>
        {!online && (
          <Badge variant="secondary" className="mt-2">
            📦 Serving cached quizzes from local offline memory
          </Badge>
        )}
      </header>

      {quizzes.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading quizzes…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No quizzes yet — create one in the Quiz Creator to generate worksheets.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((quiz) => (
            <Card key={quiz.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-base">{quiz.title}</CardTitle>
                <CardDescription>
                  {quiz.questions.length} questions · {quiz.topic ?? quiz.subject}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  <Badge>{quiz.language}</Badge>
                  <Badge variant="secondary">{quiz.subject}</Badge>
                  <Badge variant="outline">{quiz.class_level}</Badge>
                </div>
                <Button className="w-full" onClick={() => setActive(quiz)}>
                  <FileText className="size-4" /> 📄 Generate Classroom Worksheet
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          className="max-h-[92vh] max-w-4xl overflow-y-auto bg-muted p-0"
        >
          <DialogTitle className="sr-only">Worksheet preview</DialogTitle>
          {active && (
            <>
              <div className="no-print sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-background px-4 py-3">
                <p className="text-sm font-medium">A4 worksheet preview · {active.title}</p>
                <div className="flex items-center gap-2">
                  <Button onClick={() => window.print()}>
                    <Printer className="size-4" /> 🖨️ Print / Save as PDF
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setActive(null)}>
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="shadow-lg">
                  <Worksheet quiz={active} url={previewUrl(active.id)} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
    {dedicatedPrintView}
    </>
  );
}
