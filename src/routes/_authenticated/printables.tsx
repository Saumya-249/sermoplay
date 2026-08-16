import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, FileDown } from "lucide-react";

export const Route = createFileRoute("/_authenticated/printables")({
  head: () => ({
    meta: [
      { title: "Printable Hub | Regional-Language Game Library" },
      {
        name: "description",
        content: "Convert any classroom game into a printable worksheet and generate a ready-to-print PDF.",
      },
      { property: "og:title", content: "Printable Hub | Regional-Language Game Library" },
      { property: "og:description", content: "Game-to-worksheet generation for low-device classrooms." },
    ],
  }),
  component: Printables,
});

type Sheet = "Worksheet" | "Flashcards" | "Crossword";

function Printables() {
  const [gameId, setGameId] = useState<string>("");
  const [sheet, setSheet] = useState<Sheet>("Worksheet");

  const games = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data, error } = await supabase.from("games").select("*").order("title");
      if (error) throw error;
      return data;
    },
  });

  const game = (games.data ?? []).find((g) => g.id === gameId) ?? games.data?.[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Printable hub</h1>
        <p className="text-sm text-muted-foreground">
          Turn a downloaded game into paper activities for classrooms with few devices.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit print:hidden">
          <CardHeader>
            <CardTitle>Generate</CardTitle>
            <CardDescription>Pick a game and a sheet format.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={game?.id ?? ""} onValueChange={setGameId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a game" />
              </SelectTrigger>
              <SelectContent>
                {(games.data ?? []).map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.cover_emoji} {g.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sheet} onValueChange={(v) => setSheet(v as Sheet)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Worksheet">Worksheet</SelectItem>
                <SelectItem value="Flashcards">Flashcards</SelectItem>
                <SelectItem value="Crossword">Crossword</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full" onClick={() => window.print()}>
              <Printer className="size-4" /> Print / Save as PDF
            </Button>
            <p className="text-xs text-muted-foreground">
              <FileDown className="mr-1 inline size-3" />
              Uses the browser print dialog — choose “Save as PDF” to store it offline.
            </p>
          </CardContent>
        </Card>

        <Card className="print:border-0 print:shadow-none">
          <CardContent className="p-8">
            {game ? (
              <article className="mx-auto max-w-2xl space-y-6">
                <header className="border-b pb-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {sheet} · {game.language}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    {game.cover_emoji} {game.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-1.5 print:hidden">
                    <Badge variant="secondary">{game.subject}</Badge>
                    <Badge variant="secondary">{game.class_level}</Badge>
                    <Badge variant="outline">{game.difficulty}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <p>Name: ______________________</p>
                    <p>Date: ______________________</p>
                  </div>
                </header>
                <section className="space-y-4 text-sm leading-relaxed">
                  <p className="text-muted-foreground">{game.description}</p>
                  {sheet === "Worksheet" &&
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <p className="font-medium">
                          {i + 1}. {game.topic ?? game.subject} practice question
                        </p>
                        <div className="h-8 border-b border-dashed" />
                      </div>
                    ))}
                  {sheet === "Flashcards" && (
                    <div className="grid grid-cols-2 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex h-28 items-center justify-center rounded-lg border border-dashed text-muted-foreground"
                        >
                          Card {i + 1}
                        </div>
                      ))}
                    </div>
                  )}
                  {sheet === "Crossword" && (
                    <div className="grid grid-cols-8 gap-0.5">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className="aspect-square border" />
                      ))}
                    </div>
                  )}
                </section>
                <footer className="border-t pt-4 text-xs text-muted-foreground">
                  Regional-Language Game Library · {game.duration_min} minute classroom activity
                </footer>
              </article>
            ) : (
              <p className="text-sm text-muted-foreground">Loading games…</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}