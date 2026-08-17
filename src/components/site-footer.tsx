import { Link } from "@tanstack/react-router";

const QUICK_LINKS = [
  { label: "Home", hash: "top" },
  { label: "AI Sandbox Demo", hash: "ai-sandbox" },
  { label: "Curriculum", hash: "curriculum" },
];

const HUBS = [
  { label: "Student Hub", role: "student" as const },
  { label: "Teacher Workspace", role: "teacher" as const },
  { label: "Admin Console", role: "admin" as const },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full border-t bg-muted/40 text-muted-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">Mission</h2>
          <p className="mt-2 text-sm">
            Sermo Play — An offline-first platform empowering students, teachers, and administrators with
            localized curriculum and gaming content.
          </p>
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">Quick Links</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <Link to="/" hash={l.hash} className="transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">Platform Hubs</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {HUBS.map((h) => (
              <li key={h.label}>
                <Link
                  to="/auth"
                  search={{ role: h.role }}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="transition-colors hover:text-foreground"
                >
                  {h.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t px-4 py-4 text-center text-xs">
        © 2026 Sermo Play. All Rights Reserved.
      </div>
    </footer>
  );
}
