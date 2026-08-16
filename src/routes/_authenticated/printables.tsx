import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cachedQuizzes, cacheLibrarySection } from "@/lib/offline-library";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/_authenticated/printables")({
  head: () => ({
    meta: [
      { title: "Printable Hub | Regional-Language Game Library" },
      {
        name: "description",
        content:
          "Print or save clean black-and-white classroom worksheets from any generated quiz, in English or Hindi.",
      },
      { property: "og:title", content: "Printable Hub | Regional-Language Game Library" },
      {
        property: "og:description",
        content: "Game-to-worksheet printables for low-device classrooms.",
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

type PrintableQuiz = {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  language: string;
  topic: string;
  questions: { q: string; options: string[] }[];
};

function normalize(row: QuizRow): PrintableQuiz {
  const hindi = row.language?.toLowerCase().includes("hindi");
  const raw = Array.isArray(row.questions) ? (row.questions as RawQuestion[]) : [];
  return {
    id: row.id,
    title: row.title,
    subject: row.subject,
    classLevel: row.class_level,
    language: row.language,
    topic: row.topic ?? row.subject,
    questions: raw.map((q) => ({
      q: (hindi ? q.prompt_hi : q.prompt_en) ?? q.prompt ?? q.prompt_en ?? q.prompt_hi ?? "",
      options: ((hindi ? q.options_hi : q.options_en) ?? q.options ?? q.options_en ?? []).slice(0, 4),
    })),
  };
}

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

async function handleIsolatedPrint(quiz: PrintableQuiz) {
  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Student Worksheet</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2cm; padding: 0; background: #fff; color: #000; }
          .header { text-align: left; font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; }
          .subheader { font-size: 14px; color: #555; margin-bottom: 25px; }
          .student-meta { width: 100%; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 25px; display: flex; gap: 20px; }
          .meta-field { flex: 1; font-size: 14px; }
          .quiz-meta { font-size: 14px; font-weight: bold; margin-bottom: 25px; background: #f5f5f5; padding: 10px; border-radius: 4px; }
          .question-item { margin-bottom: 20px; page-break-inside: avoid; break-inside: avoid; }
          .question-text { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
          .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-left: 20px; }
          .option-box { font-size: 14px; display: flex; align-items: center; gap: 8px; }
          .checkbox-square { width: 14px; height: 14px; border: 1px solid #000; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="header">${esc(quiz.title)}</div>
        <div class="subheader">Regional-Language Game Library</div>

        <div style="float: right; text-align: center; margin-top: -50px;">
          <img id="print-qr-code" src="https://qrserver.com${encodeURIComponent(window.location.origin + '/play/' + quiz.id)}" alt="QR Code" style="width: 100px; height: 100px;" />
          <div style="font-size: 10px; margin-top: 4px; color: #555; max-width: 100px;">Scan to play digital version offline</div>
        </div>
        <div style="clear: both;"></div>

        <div class="student-meta">
          <div class="meta-field">Student Name: _______________________</div>
          <div class="meta-field">Roll No: ___________</div>
          <div class="meta-field">Date: ___________</div>
        </div>

        <div class="quiz-meta">
          Subject: ${esc(quiz.subject)} | Class: ${esc(quiz.classLevel)} | Language: ${esc(quiz.language)} | Topic: ${esc(quiz.topic)}
        </div>

        <div class="questions-list">
          ${quiz.questions
            .map(
              (q, idx) => `
            <div class="question-item">
              <div class="question-text">${idx + 1}. ${esc(q.q)}</div>
              <div class="options-grid">
                ${q.options
                  .map(
                    (opt) => `
                  <div class="option-box">
                    <span class="checkbox-square"></span> ${esc(opt)}
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();

  const qrImage = printWindow.document.getElementById("print-qr-code") as HTMLImageElement | null;

  if (qrImage) {
    qrImage.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    if (qrImage.complete) {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  } else {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
}

function Printables() {
  const { online } = useApp();

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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Printable hub</h1>
        <p className="text-sm text-muted-foreground">
          Print any quiz as a clean black-and-white student worksheet in a fresh, isolated window.
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
                  {quiz.questions.length} questions · {quiz.topic}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  <Badge>{quiz.language}</Badge>
                  <Badge variant="secondary">{quiz.subject}</Badge>
                  <Badge variant="outline">{quiz.classLevel}</Badge>
                </div>
                <Button className="w-full" onClick={() => handleIsolatedPrint(quiz)}>
                  📄 Print/Save Worksheet
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
