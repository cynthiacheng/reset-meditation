import { prisma } from "@/lib/prisma";
import type { MeditationTheme, MeditationVideo } from "@/types";

function mapVideo(
  video: Awaited<ReturnType<typeof prisma.meditationVideo.findFirstOrThrow>>
): MeditationVideo {
  return {
    id: video.id,
    sourceType: video.sourceType,
    youtubeId: video.youtubeId,
    audioUrl: video.audioUrl,
    title: video.title,
    durationMin: video.durationMin,
  };
}

// Route params arrive percent-encoded, which matters for theme ids that contain Chinese characters.
export function decodeRouteParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function getThemes(): Promise<MeditationTheme[]> {
  const themes = await prisma.meditationTheme.findMany({
    orderBy: { sortOrder: "asc" },
    include: { videos: { orderBy: { sortOrder: "asc" } } },
  });

  return themes.map((theme) => ({
    themeId: theme.id,
    themeName: theme.themeName,
    emoji: theme.emoji,
    description: theme.description,
    videos: theme.videos.map(mapVideo),
  }));
}

export async function getTheme(themeId: string): Promise<MeditationTheme | undefined> {
  const theme = await prisma.meditationTheme.findUnique({
    where: { id: themeId },
    include: { videos: { orderBy: { sortOrder: "asc" } } },
  });
  if (!theme) return undefined;

  return {
    themeId: theme.id,
    themeName: theme.themeName,
    emoji: theme.emoji,
    description: theme.description,
    videos: theme.videos.map(mapVideo),
  };
}

export async function getVideo(
  themeId: string,
  videoId: string
): Promise<{ theme: MeditationTheme; video: MeditationVideo } | undefined> {
  const theme = await getTheme(themeId);
  const video = theme?.videos.find((v) => v.id === videoId);
  if (!theme || !video) return undefined;
  return { theme, video };
}

export function hasPlayableVideos(theme: MeditationTheme): boolean {
  return theme.videos.length > 0;
}
