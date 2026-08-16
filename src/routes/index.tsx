import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Library, FilePlus2, Printer, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Regional-Language Game Library for Indian Classrooms" },
      {
        name: "description",
        content:
          "Offline-first library of regional-language educational games, quizzes and printable worksheets for teachers in low-connectivity schools.",
      },
      { property: "og:title", content: "Regional-Language Game Library" },
      {
        property: "og:description",
        content: "Download once, teach offline, sync when the internet returns.",
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
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 font-semibold">
          <span className="text-2xl">📚</span> Game Library
        </span>
        <Button asChild size="sm">
          <Link to="/auth">Teacher sign in</Link>
        </Button>
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
      </main>
    </div>
  );
}
