import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-context";
import { LANGUAGES, SUBJECTS, CLASSES } from "@/lib/constants";
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
import { toast } from "sonner";
import { Download, Check, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/library")({
  head: () => ({
    meta: [
      { title: "Game Library | Regional-Language Game Library" },
      {
        name: "description",
        content: "Filter classroom games by language, subject and class, then download them for offline teaching.",
      },
      { property: "og:title", content: "Game Library | Regional-Language Game Library" },
      { property: "og:description", content: "Browse and filter regional-language educational games." },
    ],
  }),
  component: LibraryPage,
});

const ALL = "all";

function LibraryPage() {
  const { userId, online } = useApp();
  const qc = useQueryClient();
  const [language, setLanguage] = useState<string>(ALL);
  const [subject, setSubject] = useState<string>(ALL);
  const [classLevel, setClassLevel] = useState<string>(ALL);
  const [search, setSearch] = useState("");

  const games = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data, error } = await supabase.from("games").select("*").order("title");
      if (error) throw error;
      return data;
    },
  });

  const downloads = useQuery({
    queryKey: ["downloads", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("downloads").select("*");
      if (error) throw error;
      return data;
    },
  });

  const download = useMutation({
    mutationFn: async (gameId: string) => {
      if (!online) throw new Error("You are offline — connect to download new games.");
      const { error } = await supabase.from("downloads").insert({ user_id: userId!, game_id: gameId });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saved for offline use");
      qc.invalidateQueries({ queryKey: ["downloads"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const downloadedIds = new Set((downloads.data ?? []).map((d) => d.game_id));

  const filtered = useMemo(() => {
    return (games.data ?? []).filter((g) => {
      if (language !== ALL && g.language !== language) return false;
      if (subject !== ALL && g.subject !== subject) return false;
      if (classLevel !== ALL && g.class_level !== classLevel) return false;
      if (search && !`${g.title} ${g.topic ?? ""} ${g.description ?? ""}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [games.data, language, subject, classLevel, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Game library</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} of {games.data?.length ?? 0} activities match your filters.
        </p>
      </div>

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
          <FilterSelect label="Language" value={language} onChange={setLanguage} options={[...LANGUAGES]} />
          <FilterSelect label="Subject" value={subject} onChange={setSubject} options={[...SUBJECTS]} />
          <FilterSelect label="Class" value={classLevel} onChange={setClassLevel} options={[...CLASSES]} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((g) => {
          const done = downloadedIds.has(g.id);
          return (
            <Card key={g.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{g.cover_emoji}</span>
                  <div className="min-w-0">
                    <CardTitle className="text-lg">{g.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{g.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  <Badge>{g.language}</Badge>
                  <Badge variant="secondary">{g.subject}</Badge>
                  <Badge variant="secondary">{g.class_level}</Badge>
                  <Badge variant="outline">{g.difficulty}</Badge>
                  <Badge variant="outline">{g.duration_min} min</Badge>
                </div>
                {done ? (
                  <Button variant="secondary" className="w-full" disabled>
                    <Check className="size-4" /> Available offline
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => download.mutate(g.id)} disabled={download.isPending}>
                    <Download className="size-4" /> Download {Number(g.size_mb).toFixed(1)} MB
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No games match these filters yet.</p>
        )}
      </div>
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