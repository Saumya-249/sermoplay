import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-context";
import {
  WORKING_GAME_LIBRARY,
  SUBJECT_LIST,
  CLASS_LIST,
  LANGUAGE_LIST,
} from "@/lib/working-games";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Search, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cacheLibrarySection, cachedQuizzes } from "@/lib/offline-library";

export const Route = createFileRoute("/_authenticated/library")({
  head: () => ({
    meta: [
      { title: "Game Library | Sermo Play" },
      {
        name: "description",
        content: "Filter classroom games by language, subject and class, then download them for offline teaching.",
      },
      { property: "og:title", content: "Game Library | Sermo Play" },
      { property: "og:description", content: "Filter classroom games by language, subject and class, then download them for offline teaching." },
    ],
  }),
  component: LibraryPage,
});

const ALL = "all";

function LibraryPage() {
  const { online } = useApp();
  const [language, setLanguage] = useState<string>(ALL);
  const [subject, setSubject] = useState<string>(ALL);
  const [classLevel, setClassLevel] = useState<string>(ALL);
  const [search, setSearch] = useState("");

  const games = WORKING_GAME_LIBRARY;

  const quizzes = useQuery({
    queryKey: ["library-quizzes", online],
    queryFn: async () => {
      if (!online) return cachedQuizzes() as never[];
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      cacheLibrarySection("quizzes", data ?? []);
      return data;
    },
  });

  const filtered = useMemo(() => {
    return games.filter((g) => {
      if (language !== ALL && g.language !== language) return false;
      if (subject !== ALL && g.subject !== subject) return false;
      if (classLevel !== ALL && g.classLevel !== classLevel) return false;
      if (search && !`${g.title} ${g.topic}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [games, language, subject, classLevel, search]);

  const filteredQuizzes = useMemo(() => {
    return (quizzes.data ?? []).filter((q) => {
      if (language !== ALL && q.language !== language) return false;
      if (subject !== ALL && q.subject !== subject) return false;
      if (classLevel !== ALL && q.class_level !== classLevel) return false;
      if (search && !`${q.title} ${q.topic ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [quizzes.data, language, subject, classLevel, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Game library</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} of {games.length} playable games match your filters.
        </p>
      </div>

      {!online && (
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-300">
          📦 Serving cached games from local offline memory
        </div>
      )}

      <Card>
        <CardContent className="grid gap-3 pt-6 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search topic or title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <FilterSelect label="Language" value={language} onChange={setLanguage} options={[...LANGUAGE_LIST]} />
          <FilterSelect label="Subject" value={subject} onChange={setSubject} options={[...SUBJECT_LIST]} />
          <FilterSelect label="Class" value={classLevel} onChange={setClassLevel} options={[...CLASS_LIST]} />
        </CardContent>
      </Card>

      <Tabs defaultValue="games" className="space-y-4">
        <TabsList>
          <TabsTrigger value="games">Games ({filtered.length})</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes ({filteredQuizzes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="games">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((g) => (
            <Card key={g.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{g.emoji}</span>
                  <div className="min-w-0">
                    <CardTitle className="text-lg">{g.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {g.questions.length} questions · topic: {g.topic}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  <Badge>{g.language}</Badge>
                  <Badge variant="secondary">{g.subject}</Badge>
                  <Badge variant="secondary">{g.classLevel}</Badge>
                  <Badge variant="outline" className="gap-1">
                    <Check className="size-3" /> Offline ready
                  </Badge>
                </div>
                <Button asChild className="w-full">
                  <Link to="/quiz/$id" params={{ id: g.id }}>
                    <Play className="size-4" /> Play now
                  </Link>
                </Button>
              </CardContent>
            </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No games match these filters yet.</p>
        )}
      </div>
        </TabsContent>

        <TabsContent value="quizzes">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredQuizzes.map((q) => {
              const count = Array.isArray(q.questions) ? q.questions.length : 0;
              return (
                <Card key={q.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🧩</span>
                      <div className="min-w-0">
                        <CardTitle className="text-lg">{q.title}</CardTitle>
                        <CardDescription>
                          {count} questions · {q.duration_min} min
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge>{q.language}</Badge>
                      <Badge variant="secondary">{q.subject}</Badge>
                      <Badge variant="secondary">{q.class_level}</Badge>
                      <Badge variant="outline">{q.difficulty}</Badge>
                    </div>
                    <Button asChild className="w-full" disabled={count === 0}>
                      <Link to="/quiz/$id" params={{ id: q.id }}>
                        <Play className="size-4" /> Play quiz
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            {filteredQuizzes.length === 0 && (
              <p className="text-sm text-muted-foreground">No quizzes match these filters yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All {label.toLowerCase()}s</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}