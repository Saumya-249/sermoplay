import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/app-context";
import { useI18n } from "@/lib/i18n";
import { AdminAnalyticsBody } from "@/components/admin-analytics";
import {
  GLOBAL_ACCURACY,
  STUDENTS,
  TEACHERS,
  TOTAL_ASSETS,
} from "@/lib/school-data";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: ({ context }) => {
    if ((context as { role?: string }).role !== "admin") throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "School & Learning Management Panel | Sermo Play" },
      { name: "description", content: "Principal's command board: student registry, teacher workload, curriculum coverage audit and regional language engagement in seven Indian languages." },
      { property: "og:title", content: "School & Learning Management Panel | Sermo Play" },
      { property: "og:description", content: "Principal's command board: student registry, teacher workload, curriculum coverage audit and regional language engagement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function StatTile({ emoji, label, value, sub }: { emoji: string; label: string; value: string; sub: string }) {
  return (
    <Card className="border-2">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-start gap-2 text-xs font-medium leading-snug">
          <span aria-hidden className="text-base">{emoji}</span>
          <span className="min-w-0">{label}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tabular-nums">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

function AdminPage() {
  const { online } = useApp();
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">🏫 {t("adTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("adSubtitle")}</p>
        {!online && (
          <Badge variant="secondary" className="mt-2">{t("adOffline")}</Badge>
        )}
      </header>

      {/* Core overview tiles */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile emoji="👥" label={t("adStudents")} value={String(STUDENTS.length)} sub={t("adStudentsSub")} />
        <StatTile emoji="👩‍🏫" label={t("adTeachers")} value={String(TEACHERS.length)} sub={t("adTeachersSub")} />
        <StatTile emoji="📚" label={t("adAssets")} value={String(TOTAL_ASSETS)} sub={t("adAssetsSub")} />
        <StatTile emoji="📈" label={t("adAccuracy")} value={`${GLOBAL_ACCURACY}%`} sub={t("adAccuracySub")} />
      </section>

      <AdminAnalyticsBody />
    </div>
  );
}


