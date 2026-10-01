"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { meditationRepository } from "@/lib/repositories/dexie/meditation-repository";
import type { MeditationVideo } from "@/types";
import { t } from "@/lib/i18n/strings";

export function VideoListItem({
  themeId,
  video,
}: {
  themeId: string;
  video: MeditationVideo;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      meditationRepository.isFavorite(video.id),
      meditationRepository.isCompletedToday(video.id),
    ]).then(([fav, done]) => {
      if (!active) return;
      setIsFavorite(fav);
      setIsCompletedToday(done);
    });
    return () => {
      active = false;
    };
  }, [video.id]);

  return (
    <Link
      href={`/meditations/${themeId}/${video.id}`}
      className="flex items-center justify-between rounded-xl border border-sand/50 bg-cream/60 px-4 py-3
        transition-colors duration-300 dark:border-ink/50 dark:bg-ink/40"
    >
      <div>
        <div className="text-sm text-ink dark:text-cream">{video.title || "未命名冥想"}</div>
        <div className="mt-0.5 text-xs text-ink/50 dark:text-cream/50">
          {video.durationMin} {t("meditation.minutesShort")}
          {isCompletedToday ? ` · ${t("meditation.completedToday")}` : ""}
        </div>
      </div>
      <span aria-hidden className="text-lg text-wood">
        {isFavorite ? "★" : "☆"}
      </span>
    </Link>
  );
}
