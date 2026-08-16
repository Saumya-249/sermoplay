import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-context";
import { LANGUAGES, SUBJECTS, CLASSES, DIFFICULTIES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { generateQuiz } from "@/lib/quiz-ai.functions";

export const Route = createFileRoute("/_authenticated/quiz-creator")({
  head: () => ({
    meta: [
      { title: "Quiz Creator | Regional-Language Game Library" },
      {
        name: "description",
        content: "Teachers build regional-language quizzes with multiple-choice questions, saved online or queued offline.",
      },
      { property: "og:title", content: "Quiz Creator | Regional-Language Game Library" },
      { property: "og:description", content: "Create classroom quizzes in Indian regional languages in minutes." },
    ],
  }),
  component: QuizCreator,
});

type Question = {
  prompt: string;
  options: string[];
  answer: number;
  prompt_hi?: string;
  options_hi?: string[];
};

const emptyQuestion = (): Question => ({ prompt: "", options: ["", "", "", ""], answer: 0 });

function QuizCreator() {
  const { userId, online } = useApp();
  const qc = useQueryClient();
  const runGenerate = useServerFn(generateQuiz);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<string>("Hindi");
  const [subject, setSubject] = useState<string>("Maths");
  const [classLevel, setClassLevel] = useState<string>("Class 5");
  const [difficulty, setDifficulty] = useState<string>("Easy");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(10);
  const [published, setPublished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([emptyQuestion()]);

  const myQuizzes = useQuery({
    queryKey: ["quizzes", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("created_by", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        language,
        subject,
        class_level: classLevel,
        difficulty,
        topic,
        duration_min: duration,
        is_published: published,
        questions: questions.map((q) => ({
          prompt: q.prompt,
          options: q.options,
          answer: q.answer,
          prompt_en: q.prompt,
          options_en: q.options,
          prompt_hi: q.prompt_hi ?? q.prompt,
          options_hi: q.options_hi ?? q.options,
        })),
        created_by: userId!,
      };
      if (!online) {
        const { error } = await supabase.from("sync_queue").insert({
          user_id: userId!,
          entity_type: "quiz",
          entity_label: title,
          action: "create",
          payload,
        });
        if (error) throw error;
        return "queued" as const;
      }
      const { error } = await supabase.from("quizzes").insert(payload);
      if (error) throw error;
      return "saved" as const;
    },
    onSuccess: (result) => {
      toast.success(result === "queued" ? "Saved offline — queued for sync" : "Quiz published to your library");
      setTitle("");
      setTopic("");
      setQuestions([emptyQuestion()]);
      qc.invalidateQueries({ queryKey: ["quizzes"] });
      qc.invalidateQueries({ queryKey: ["sync_queue"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const generate = useMutation({
    mutationFn: async () => {
      if (!topic.trim()) throw new Error("Add a topic first so the AI knows what to write about");
      return runGenerate({
        data: { topic, subject, classLevel, language, difficulty },
      });
    },
    onSuccess: (res) => {
      setQuestions(
        res.questions.map((q) => ({
          prompt: q.prompt_en,
          options: q.options_en,
          answer: q.answer ?? 0,
          prompt_hi: q.prompt_hi,
          options_hi: q.options_hi,
        })),
      );
      if (!title.trim()) setTitle(`${topic} — ${classLevel} ${subject} Quiz`);
      toast.success(res.simulated ? "Generated 5 sample questions" : "AI generated 5 questions");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function updateQuestion(i: number, patch: Partial<Question>) {
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }

  const valid = title.trim() !== "" && questions.every((q) => q.prompt.trim() !== "");

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Create a quiz</CardTitle>
            <CardDescription>No coding needed — works offline and syncs later.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz title</Label>
              <Input
                id="title"
                placeholder="e.g. मंडी में जोड़-घटाव"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Language">
                <Picker value={language} onChange={setLanguage} options={[...LANGUAGES]} />
              </Field>
              <Field label="Subject">
                <Picker value={subject} onChange={setSubject} options={[...SUBJECTS]} />
              </Field>
              <Field label="Class">
                <Picker value={classLevel} onChange={setClassLevel} options={[...CLASSES]} />
              </Field>
              <Field label="Difficulty">
                <Picker value={difficulty} onChange={setDifficulty} options={[...DIFFICULTIES]} />
              </Field>
              <Field label="Topic">
                <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Addition & money" />
              </Field>
              <Field label="Duration (minutes)">
                <Input
                  type="number"
                  min={5}
                  max={60}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </Field>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Share with other teachers</p>
                <p className="text-xs text-muted-foreground">Published quizzes appear in the shared library.</p>
              </div>
              <Switch checked={published} onCheckedChange={setPublished} />
            </div>
            <Button
              size="lg"
              className="w-full"
              disabled={generate.isPending}
              onClick={() => generate.mutate()}
            >
              {generate.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              AI Generate Quiz
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Questions</CardTitle>
              <CardDescription>{questions.length} question(s)</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setQuestions((q) => [...q, emptyQuestion()])}>
              <Plus className="size-4" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-5">
            {questions.map((q, i) => (
              <div key={i} className="space-y-3 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Q{i + 1}</Badge>
                  {questions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-destructive"
                      onClick={() => setQuestions((qs) => qs.filter((_, idx) => idx !== i))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
                <Textarea
                  placeholder="Question text in the chosen language"
                  value={q.prompt}
                  onChange={(e) => updateQuestion(i, { prompt: e.target.value })}
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`answer-${i}`}
                        checked={q.answer === oi}
                        onChange={() => updateQuestion(i, { answer: oi })}
                        className="size-4 accent-[var(--primary)]"
                        aria-label={`Mark option ${oi + 1} correct`}
                      />
                      <Input
                        placeholder={`Option ${oi + 1}`}
                        value={opt}
                        onChange={(e) =>
                          updateQuestion(i, {
                            options: q.options.map((o, idx) => (idx === oi ? e.target.value : o)),
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button className="w-full" disabled={!valid || save.isPending} onClick={() => save.mutate()}>
              {online ? "Save Quiz" : "Save offline & queue for sync"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>My quizzes</CardTitle>
          <CardDescription>Created by you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(myQuizzes.data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No quizzes yet — your first one appears here.</p>
          )}
          {(myQuizzes.data ?? []).map((q) => (
            <div key={q.id} className="rounded-lg border p-3">
              <p className="font-medium">{q.title}</p>
              <p className="text-xs text-muted-foreground">
                {q.language} · {q.class_level} · {Array.isArray(q.questions) ? q.questions.length : 0} questions
              </p>
              <Badge variant={q.is_published ? "default" : "secondary"} className="mt-2">
                {q.is_published ? "Shared" : "Private"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Picker({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}