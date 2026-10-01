import Link from "next/link";
import { getThemes, hasPlayableVideos } from "@/lib/meditations";
import { PageHeader } from "@/components/ui/PageHeader";
import { t } from "@/lib/i18n/strings";

export const dynamic = "force-dynamic";

export default async function MeditationsPage() {
  const themes = await getThemes();

  return (
    <div>
      <PageHeader
        title={t("meditation.pageTitle")}
        description={t("meditation.pageDescription")}
      />
      <div className="grid grid-cols-2 gap-3 px-6 pb-8">
        {themes.map((theme, i) => (
          <Link
            key={theme.themeId}
            href={`/meditations/${theme.themeId}`}
            className="animate-fade-in rounded-2xl border border-sand/50 bg-cream/60 p-4 text-center shadow-sm
              transition-transform duration-300 hover:-translate-y-0.5 dark:border-ink/50 dark:bg-ink/40"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="font-heading text-sm text-ink dark:text-cream">{theme.themeName}</div>
            {!hasPlayableVideos(theme) && (
              <div className="mt-1 text-[10px] text-ink/40 dark:text-cream/40">即將上線</div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
