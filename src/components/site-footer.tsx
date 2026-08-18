import { Link } from "@tanstack/react-router";
import { useI18n, type I18nKey } from "@/lib/i18n";

const QUICK_LINKS: { key: I18nKey; hash: string }[] = [
  { key: "navHome", hash: "top" },
  { key: "sandboxDemo", hash: "ai-sandbox" },
  { key: "curriculumLink", hash: "curriculum" },
];

const HUBS: { key: I18nKey; role: "student" | "teacher" | "admin" }[] = [
  { key: "studentHub", role: "student" },
  { key: "teacherWorkspace", role: "teacher" },
  { key: "adminConsoleLink", role: "admin" },
];

export function SiteFooter() {
  const { t, lang } = useI18n();
  return (
    <footer key={lang} className="mt-auto w-full border-t bg-muted/40 text-muted-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">{t("missionTitle")}</h2>
          <p className="mt-2 text-sm">{t("missionText")}</p>
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">{t("quickLinks")}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.key}>
                <Link to="/" hash={l.hash} className="transition-colors hover:text-foreground">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">{t("platformHubs")}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {HUBS.map((h) => (
              <li key={h.key}>
                <Link
                  to="/auth"
                  search={{ role: h.role }}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="transition-colors hover:text-foreground"
                >
                  {t(h.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t px-4 py-4 text-center text-xs">
        {t("rightsReserved")}
      </div>
    </footer>
  );
}
