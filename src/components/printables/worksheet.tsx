import { QrCode } from "./qr-code";

export type WorksheetQuestion = {
  prompt: string;
  options: string[];
};

export type WorksheetQuiz = {
  id: string;
  title: string;
  subject: string;
  class_level: string;
  language: string;
  topic?: string | null;
  questions: WorksheetQuestion[];
};

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function Worksheet({ quiz, url }: { quiz: WorksheetQuiz; url: string }) {
  return (
    <div
      id="worksheet-print"
      className="mx-auto w-full max-w-[794px] bg-white p-8 text-black"
      style={{ fontFamily: "'Baloo 2', system-ui, sans-serif" }}
    >
      <div className="flex items-start justify-between gap-6 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-2xl font-extrabold uppercase tracking-[0.2em] text-black">
            Student Worksheet
          </h2>
          <p className="mt-1 text-xs uppercase tracking-widest text-black">
            Regional-Language Game Library
          </p>
        </div>
        <div className="text-center">
          <QrCode value={url} size={90} />
          <p className="mt-1 max-w-[110px] text-[9px] leading-tight text-black">
            Scan to play the digital game
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-black sm:grid-cols-3">
        <p>Student Name: ___________</p>
        <p>Roll No: ___________</p>
        <p>Date: ___________</p>
      </div>

      <div className="mt-4 border-y border-black py-3 text-black">
        <p className="text-lg font-bold">{quiz.title}</p>
        <p className="text-sm font-bold">
          Subject: {quiz.subject} &nbsp;|&nbsp; Class: {quiz.class_level} &nbsp;|&nbsp; Language:{" "}
          {quiz.language}
          {quiz.topic ? <> &nbsp;|&nbsp; Topic: {quiz.topic}</> : null}
        </p>
      </div>

      <ol className="mt-5 space-y-5 text-black">
        {quiz.questions.map((q, i) => (
          <li key={i} className="break-inside-avoid">
            <p className="text-sm font-semibold">
              {i + 1}. {q.prompt}
            </p>
            <div className="mt-2 grid gap-1.5 pl-4 sm:grid-cols-2">
              {q.options.map((opt, oi) => (
                <p key={oi} className="flex items-center gap-2 text-sm">
                  <span className="inline-block size-3.5 shrink-0 border border-black" />
                  <span>
                    {LETTERS[oi]}. {opt}
                  </span>
                </p>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 border-t border-black pt-3 text-[10px] text-black">
        Total questions: {quiz.questions.length} · Teacher signature: ______________ · {url}
      </div>
    </div>
  );
}
