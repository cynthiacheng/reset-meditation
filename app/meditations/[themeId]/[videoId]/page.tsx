import Link from "next/link";
import { notFound } from "next/navigation";
import { getVideo } from "@/lib/meditations";
import { PlayerControls } from "@/components/meditation/PlayerControls";
import { t } from "@/lib/i18n/strings";

export const dynamic = "force-dynamic";

export default async function VideoPlayerPage({
  params,
}: {
  params: Promise<{ themeId: string; videoId: string }>;
}) {
  const { themeId, videoId } = await params;
  const result = await getVideo(themeId, videoId);
  if (!result) notFound();
  const { theme, video } = result;

  return (
    <div className="pb-4">
      <div className="px-6 pb-2 pt-8">
        <Link href={`/meditations/${themeId}`} className="text-sm text-moss dark:text-sand">
          ← {t("meditation.backToVideos")}
        </Link>
      </div>
      <div className="px-4">
        {video.sourceType === "youtube" ? (
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
              title={video.title || theme.themeName}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="rounded-2xl bg-cream/85 p-6 shadow-sm backdrop-blur-sm dark:bg-ink/70">
            <audio controls src={video.audioUrl ?? undefined} className="w-full">
              您的瀏覽器不支援音訊播放。
            </audio>
          </div>
        )}
      </div>
      <div className="px-6 pt-4">
        <div className="rounded-2xl bg-cream/85 px-5 py-4 shadow-sm backdrop-blur-sm dark:bg-ink/70">
          <h1 className="font-heading text-xl text-ink dark:text-cream">
            {video.title || theme.themeName}
          </h1>
          <p className="mt-1 text-sm text-ink/70 dark:text-cream/70">
            {theme.themeName} · {video.durationMin} {t("meditation.minutesShort")}
          </p>
        </div>
        <PlayerControls themeId={themeId} themeName={theme.themeName} videoId={video.id} />
      </div>
    </div>
  );
}
