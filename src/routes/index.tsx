import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Download, Library, FilePlus2, Printer, RefreshCw, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sermo Play for Indian Classrooms" },
      {
        name: "description",
        content:
          "Offline-first library of regional-language educational games, quizzes and printable worksheets for teachers in low-connectivity schools.",
      },
      { property: "og:title", content: "Sermo Play" },
      {
        property: "og:description",
        content: "Offline-first library of regional-language educational games, quizzes and printable worksheets for teachers in low-connectivity schools.",
      },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: Download, title: "Download & teach offline", text: "Games stay on the device when the network drops." },
  { icon: Library, title: "Filter by language, subject, class", text: "Six regional languages, Class 1 to 8." },
  { icon: FilePlus2, title: "Teacher quiz creator", text: "Build classroom quizzes without any coding." },
  { icon: Printer, title: "Game-to-worksheet printables", text: "Turn any game into a paper activity PDF." },
  { icon: RefreshCw, title: "Offline queue & cloud sync", text: "Results upload automatically when back online." },
];

function Index() {
  return (
    <div className="surface-paper min-h-screen">
      <header className="sticky top-0 z-20 w-full border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 md:px-6">
        <span className="flex items-center gap-2 font-semibold">
          <span className="text-2xl">📚</span> Sermo Play
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <ThemeToggle className="size-8" />
          <Button asChild size="sm">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <section className="py-14 text-center md:py-20">
          <Badge variant="secondary" className="mb-4">
            Smart India Hackathon 2026 prototype
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Regional-language classroom games that work without internet
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            A teacher-first library of games, quizzes and printable worksheets in Hindi, Tamil, Kannada, Bengali,
            Marathi and Telugu — downloaded once, used offline, synced later.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/auth">Open the teacher app</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/auth">Create an account</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <CardContent className="pt-6">
                <f.icon className="size-5 text-primary" />
                <h2 className="mt-3 text-lg font-semibold">{f.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <AiSandbox />
          <CurriculumExplorer />
        </section>
      </main>
    </div>
  );
}

function mockPreview(topic: string) {
  const clean = topic.trim() || "Fractions";
  return [
    {
      q: `Which statement best describes ${clean}?`,
      options: [`A core idea of ${clean}`, "An unrelated fact", "A random guess", "None of these"],
      answer: 0,
    },
    {
      q: `A class is studying ${clean}. Which example fits it?`,
      options: ["A cooking recipe", `A classroom activity on ${clean}`, "A sports score", "A bus timetable"],
      answer: 1,
    },
    {
      q: `Why is ${clean} useful in everyday life?`,
      options: ["It is never used", "Only in exams", `It helps solve real problems using ${clean}`, "It is decorative"],
      answer: 2,
    },
  ];
}

function AiSandbox() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<ReturnType<typeof mockPreview> | null>(null);

  function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setPreview(mockPreview(topic));
      setLoading(false);
    }, 500);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">✨ Try Live AI Sandbox Demo</CardTitle>
        <CardDescription>
          Type any topic and preview 3 sample questions instantly — no account needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-wrap gap-2" onSubmit={run}>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Fractions, Water Cycle, Indian Democracy"
            className="min-w-0 flex-1"
            aria-label="Topic"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Preview questions
          </Button>
        </form>

        {preview && (
          <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
            {preview.map((item, i) => (
              <div key={i} className="rounded-lg border bg-card p-3">
                <p className="text-sm font-medium">
                  {i + 1}. {item.q}
                </p>
                <ul className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                  {item.options.map((opt, j) => (
                    <li
                      key={j}
                      className={
                        j === item.answer
                          ? "rounded-md bg-primary/10 px-2 py-1 font-medium text-foreground"
                          : "px-2 py-1"
                      }
                    >
                      {String.fromCharCode(65 + j)}. {opt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              This is a demo preview. Sign in to generate full curriculum-aligned quizzes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const EXPLORER_LANGUAGES = ["English", "हिंदी (Hindi)"];
const EXPLORER_SUBJECTS = ["Math", "Science", "Social Science"];
const EXPLORER_CLASSES = Array.from({ length: 8 }, (_, i) => `Class ${i + 1}`);

function CurriculumExplorer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">📚 Public Curriculum Explorer</CardTitle>
        <CardDescription>Everything Sermo Play covers today — read-only, open to all.</CardDescription>
      </CardHeader>
      <CardContent className="max-h-80 space-y-5 overflow-y-auto pr-1">
        <div>
          <h3 className="text-sm font-semibold">Languages</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXPLORER_LANGUAGES.map((l) => (
              <Badge key={l} variant="secondary">
                {l}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Subjects</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXPLORER_SUBJECTS.map((s) => (
              <Badge key={s} variant="outline">
                {s}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Class levels</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {EXPLORER_CLASSES.map((c) => (
              <div key={c} className="rounded-md border bg-card px-2 py-2 text-center text-xs font-medium">
                {c}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
