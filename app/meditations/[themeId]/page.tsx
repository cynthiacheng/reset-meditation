import Link from "next/link";
import { notFound } from "next/navigation";
import { getTheme } from "@/lib/meditations";
import { VideoListItem } from "@/components/meditation/VideoListItem";
import { t } from "@/lib/i18n/strings";

export const dynamic = "force-dynamic";

export default async function ThemeVideosPage({
  params,
}: {
  params: Promise<{ themeId: string }>;
}) {
  const { themeId } = await params;
  const theme = await getTheme(themeId);
  if (!theme) notFound();

  const playableVideos = theme.videos;

  return (
    <div>
      <div className="px-6 pb-2 pt-8">
        <Link href="/meditations" className="text-sm text-moss dark:text-sand">
          ← {t("meditation.backToThemes")}
        </Link>
      </div>
      <header className="animate-fade-in px-6 pb-4">
        <div className="rounded-2xl bg-cream/85 px-5 py-4 shadow-sm backdrop-blur-sm dark:bg-ink/70">
          <h1 className="font-heading text-2xl text-ink dark:text-cream">{theme.themeName}</h1>
          <p className="mt-1 text-sm text-ink/70 dark:text-cream/70">{theme.description}</p>
        </div>
      </header>
      <div className="space-y-3 px-6 pb-8">
        {playableVideos.length === 0 ? (
          <p className="text-sm text-ink/50 dark:text-cream/50">{t("meditation.noVideosYet")}</p>
        ) : (
          playableVideos.map((video) => (
            <VideoListItem key={video.id} themeId={theme.themeId} video={video} />
          ))
        )}
      </div>
    </div>
  );
}
