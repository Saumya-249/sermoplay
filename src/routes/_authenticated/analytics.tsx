import { createFileRoute, redirect } from "@tanstack/react-router";
import { TeacherAnalytics } from "@/components/teacher-analytics";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/analytics")({
  beforeLoad: ({ context }) => {
    const role = (context as { role?: string }).role;
    if (role !== "teacher" && role !== "admin") throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Teacher Analytics | Sermo Play" },
      {
        name: "description",
        content:
          "Live classroom telemetry for teachers: most active modules, weekly student completions and accuracy by topic.",
      },
      { property: "og:title", content: "Teacher Analytics | Sermo Play" },
      {
        property: "og:description",
        content: "Live classroom telemetry: active modules, weekly completions and accuracy curves.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { t, lang } = useI18n();
  return (
    <div key={lang} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">📊 {t("anPageTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("anPageSub")}</p>
      </div>
      <TeacherAnalytics />
    </div>
  );
}
