import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { label: "Home", hash: "top" },
  { label: "AI Sandbox", hash: "ai-sandbox" },
  { label: "Curriculum Explorer", hash: "curriculum" },
  { label: "Features", hash: "features" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <a
            href="/"
            className="flex min-w-0 items-center gap-2 font-semibold"
            aria-label="Sermo Play home"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="size-5" />
            </span>
            <span className="truncate">Sermo Play</span>
          </a>
          <nav className="hidden items-center gap-5 text-sm font-medium text-muted-foreground lg:flex">
            {NAV.map((n) => (
              <Link key={n.label} to="/" hash={n.hash} className="transition-colors hover:text-foreground">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle className="size-8" />
          <Button asChild size="sm">
            <Link to="/auth">Sign In</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="size-8 lg:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <GraduationCap className="size-5 text-primary" /> Sermo Play
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 grid gap-1 px-4">
                {NAV.map((n) => (
                  <Link
                    key={n.label}
                    to="/"
                    hash={n.hash}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    {n.label}
                  </Link>
                ))}
                <Button asChild className="mt-3" onClick={() => setOpen(false)}>
                  <Link to="/auth">Sign In</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
