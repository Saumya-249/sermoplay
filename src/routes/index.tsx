import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { generateLiveQuiz } from "@/lib/live-quiz.functions";
import type { LiveQuestion } from "@/lib/ai-live";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CurriculumExplorer } from "@/components/curriculum-explorer";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Download, Library, FilePlus2, Printer, RefreshCw, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sermo Play — Regional-Language Learning Ecosystem" },
      {
        name: "description",
        content:
          "Offline-first regional-language learning ecosystem connecting students, teachers and administrators with games, quizzes and printable worksheets.",
      },
      { property: "og:title", content: "Sermo Play — Regional-Language Learning Ecosystem" },
      {
        property: "og:description",
        content:
          "Connecting students, teachers and administrators offline-first with regional-language games, quizzes and worksheets.",
      },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: Download, title: "Download & teach offline", text: "Games stay on the device when the network drops." },
  { icon: Library, title: "Filter by language, subject, class", text: "Six regional languages, Class 1 to 8." },
  { icon: FilePlus2, title: "AI quiz creator", text: "Build curriculum quizzes without any coding." },
  { icon: Printer, title: "Game-to-worksheet printables", text: "Turn any game into a paper activity PDF." },
  { icon: RefreshCw, title: "Offline queue & cloud sync", text: "Results upload automatically when back online." },
];

function Index() {
  return (
    <div className="surface-paper flex min-h-screen flex-col">
      <span id="top" />
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-6 pb-24">
        <section className="py-14 text-center md:py-20">
          <Badge variant="secondary" className="mb-4">
            ✨ Empowering Minds in Every Tongue, Learning Everywhere Offline-First
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Regional-Language Learning Ecosystem
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Connecting students, teachers and administrators offline-first — games, quizzes, study guides and
            printable worksheets in Hindi, Tamil, Kannada, Bengali, Marathi and Telugu, downloaded once, used
            offline, synced later.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/auth">Open the workspace</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/auth">Create an account</Link>
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button asChild variant="secondary">
              <Link to="/leaderboard">📊 View Live Leaderboard</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/lms">💡 Browse Flashcards</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/" hash="ai-sandbox">
                🛠️ Interactive Sandbox
              </Link>
            </Button>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 grid gap-4 md:grid-cols-3">
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
          <div id="ai-sandbox" className="scroll-mt-24">
            <AiSandbox />
          </div>
          <div id="curriculum" className="scroll-mt-24">
            <CurriculumExplorer />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function AiSandbox() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<LiveQuestion[] | null>(null);
  const runGenerate = useServerFn(generateLiveQuiz);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    const clean = topic.trim();
    if (!clean) {
      toast.error("Type a topic first");
      return;
    }
    setLoading(true);
    try {
      const res = await runGenerate({
        data: {
          subject: "General",
          topic: clean,
          classLevel: "Class 6",
          language,
          difficulty: "Medium",
          variant: 0,
          count: 3,
          mode: "single",
          rows: [],
        },
      });
      setPreview(res.questions);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">✨ Try Live AI Sandbox Demo</CardTitle>
        <CardDescription>
          Type any topic and get 3 real AI-generated curriculum questions instantly — no account needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-wrap gap-2" onSubmit={run}>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Geometry, Human Reproduction, Water Cycle"
            className="min-w-0 flex-1"
            aria-label="Topic"
          />
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32" aria-label="Language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Generating…" : "Preview questions"}
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
                        j === item.correct
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
              Live preview from the same AI engine the workspace uses. Sign in to generate full quizzes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
