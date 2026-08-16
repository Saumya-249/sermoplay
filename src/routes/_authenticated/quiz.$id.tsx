import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { saveResult, loadResults } from "@/lib/quiz-local";
import { toast } from "sonner";
import { ArrowLeft, Check, X, Trophy, Sparkles, RotateCcw, HardDriveDownload } from "lucide-react";

export const Route = createFileRoute("/_authenticated/quiz/$id")({
  head: () => ({
    meta: [
      { title: "Quiz Player | Regional-Language Game Library" },
      {
        name: "description",
        content: "Play step-by-step classroom quizzes in Hindi or English with instant feedback and offline score saving.",
      },
      { property: "og:title", content: "Quiz Player | Regional-Language Game Library" },
      { property: "og:description", content: "A gamified bilingual quiz player for classrooms with offline results." },
    ],
  }),
  component: QuizPlayer,
});

type RawQuestion = {
  prompt?: string;
  prompt_en?: string;
  prompt_hi?: string;
  options?: string[];
  options_en?: string[];
  options_hi?: string[];
  answer: number;
};

type Lang = "en" | "hi";

const T = {
  en: {
    back: "Back to library",
    question: "Question",
    of: "of",
    correct: "Correct!",
    wrong: "Not quite",
    answerIs: "Correct answer",
    next: "Next question",
    finish: "See results",
    score: "Your score",
    again: "Play again",
    saved: "Saved on this device",
    streak: "Streak",
    done: "Quiz complete!",
    library: "Back to library",
    plays: "Local attempts",
  },
  hi: {
    back: "लाइब्रेरी पर लौटें",
    question: "प्रश्न",
    of: "में से",
    correct: "सही उत्तर!",
    wrong: "गलत उत्तर",
    answerIs: "सही उत्तर",
    next: "अगला प्रश्न",
    finish: "परिणाम देखें",
    score: "आपका स्कोर",
    again: "फिर से खेलें",
    saved: "इस डिवाइस पर सहेजा गया",
    streak: "लगातार सही",
    done: "क्विज़ पूरी हुई!",
    library: "लाइब्रेरी पर लौटें",
    plays: "स्थानीय प्रयास",
  },
} as const;

function QuizPlayer() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>("hi");
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState(() => loadResults());

  const t = T[lang];

  const quiz = useQuery({
    queryKey: ["quiz", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("quizzes").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const questions = useMemo<RawQuestion[]>(
    () => (Array.isArray(quiz.data?.questions) ? (quiz.data!.questions as unknown as RawQuestion[]) : []),
    [quiz.data],
  );

  if (quiz.isLoading) return <p className="text-sm text-muted-foreground">Loading quiz…</p>;
  if (!quiz.data) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">This quiz is not available.</p>
        <Button asChild variant="outline">
          <Link to="/library">
            <ArrowLeft className="size-4" /> {t.back}
          </Link>
        </Button>
      </div>
    );
  }

  const total = questions.length;
  const q = questions[step];
  const prompt = (lang === "hi" ? q?.prompt_hi : q?.prompt_en) ?? q?.prompt ?? "";
  const options = (lang === "hi" ? q?.options_hi : q?.options_en) ?? q?.options ?? [];
  const correct = questions.reduce((n, _, i) => n + (answers[i] ? 1 : 0), 0);

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === q.answer;
    setAnswers((a) => {
      const next = [...a];
      next[step] = ok;
      return next;
    });
    setStreak((s) => (ok ? s + 1 : 0));
  };

  const advance = () => {
    if (step + 1 < total) {
      setStep(step + 1);
      setPicked(null);
      return;
    }
    const finalCorrect = questions.reduce((n, _, i) => n + (answers[i] ? 1 : 0), 0);
    const score = total ? Math.round((finalCorrect / total) * 100) : 0;
    const next = saveResult({
      quizId: quiz.data!.id,
      quizTitle: quiz.data!.title,
      score,
      correct: finalCorrect,
      total,
      lang,
      completedAt: new Date().toISOString(),
    });
    setHistory(next);
    setFinished(true);
    toast.success("Saved to local storage", {
      description: `${finalCorrect}/${total} · ${score}% — ${t.saved}`,
    });
  };

  const restart = () => {
    setStep(0);
    setPicked(null);
    setAnswers([]);
    setStreak(0);
    setFinished(false);
  };

  const score = total ? Math.round((correct / total) * 100) : 0;
  const attempts = history.filter((h) => h.quizId === quiz.data!.id).length;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/library" })}>
          <ArrowLeft className="size-4" /> {t.back}
        </Button>
        <div className="ml-auto inline-flex rounded-full border bg-card p-1">
          {(["hi", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cn(
                "rounded-full px-4 py-1 text-sm font-medium transition-colors",
                lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l === "hi" ? "हिंदी" : "English"}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-primary/10 px-6 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{quiz.data.subject}</Badge>
            <Badge variant="secondary">{quiz.data.class_level}</Badge>
            <Badge variant="outline">{quiz.data.difficulty}</Badge>
            {attempts > 0 && (
              <Badge variant="outline" className="gap-1">
                <HardDriveDownload className="size-3" /> {t.plays}: {attempts}
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-xl font-bold md:text-2xl">{quiz.data.title}</h1>
        </div>

        {!finished ? (
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {t.question} {step + 1} {t.of} {total}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="size-3.5 text-primary" /> {t.streak}: {streak}
                </span>
              </div>
              <Progress value={total ? ((step + (picked !== null ? 1 : 0)) / total) * 100 : 0} />
            </div>

            <h2 className="text-lg font-semibold leading-snug md:text-xl">{prompt}</h2>

            <div className="grid gap-3">
              {options.map((opt, i) => {
                const isAnswer = i === q.answer;
                const chosen = picked === i;
                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    disabled={picked !== null}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-base transition-all",
                      picked === null && "hover:-translate-y-0.5 hover:border-primary hover:shadow-md",
                      picked !== null && isAnswer && "border-primary bg-primary/10",
                      picked !== null && chosen && !isAnswer && "border-destructive bg-destructive/10",
                      picked !== null && !chosen && !isAnswer && "opacity-60",
                    )}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {picked !== null && isAnswer && <Check className="size-5 text-primary" />}
                    {picked !== null && chosen && !isAnswer && <X className="size-5 text-destructive" />}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/60 p-4">
                <p className="text-sm font-medium">
                  {picked === q.answer ? `🎉 ${t.correct}` : `${t.wrong} — ${t.answerIs}: ${options[q.answer]}`}
                </p>
                <Button className="ml-auto" onClick={advance}>
                  {step + 1 < total ? t.next : t.finish}
                </Button>
              </div>
            )}
          </CardContent>
        ) : (
          <CardContent className="space-y-5 pt-8 text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/15">
              <Trophy className="size-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t.done}</h2>
              <p className="mt-1 text-4xl font-extrabold text-primary">{score}%</p>
              <p className="text-sm text-muted-foreground">
                {t.score}: {correct}/{total}
              </p>
            </div>
            <div className="grid gap-2 text-left sm:grid-cols-2">
              {questions.map((qq, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                  {answers[i] ? (
                    <Check className="size-4 shrink-0 text-primary" />
                  ) : (
                    <X className="size-4 shrink-0 text-destructive" />
                  )}
                  <span className="line-clamp-1">
                    {(lang === "hi" ? qq.prompt_hi : qq.prompt_en) ?? qq.prompt}
                  </span>
                </div>
              ))}
            </div>
            <Badge variant="secondary" className="gap-1">
              <HardDriveDownload className="size-3" /> {t.saved}
            </Badge>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={restart} variant="outline">
                <RotateCcw className="size-4" /> {t.again}
              </Button>
              <Button asChild>
                <Link to="/library">{t.library}</Link>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
