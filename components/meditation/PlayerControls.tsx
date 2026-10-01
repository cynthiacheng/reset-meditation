"use client";

import { useEffect, useState } from "react";
import { meditationRepository } from "@/lib/repositories/dexie/meditation-repository";
import { t } from "@/lib/i18n/strings";

export function PlayerControls({
  themeId,
  themeName,
  videoId,
}: {
  themeId: string;
  themeName: string;
  videoId: string;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      meditationRepository.isFavorite(videoId),
      meditationRepository.isCompletedToday(videoId),
    ]).then(([fav, done]) => {
      if (!active) return;
      setIsFavorite(fav);
      setIsCompletedToday(done);
    });
    return () => {
      active = false;
    };
  }, [videoId]);

  async function handleToggleFavorite() {
    const next = await meditationRepository.toggleFavorite(videoId, themeId);
    setIsFavorite(next);
  }

  async function handleComplete() {
    if (isCompletedToday) return;
    await meditationRepository.logCompletion(videoId, themeId, themeName);
    setIsCompletedToday(true);
  }

  return (
    <div className="mt-4 flex gap-3">
      <button
        type="button"
        onClick={handleToggleFavorite}
        className="flex-1 rounded-full border border-sand/60 py-2.5 text-sm text-ink transition-colors
          duration-300 dark:border-ink/60 dark:text-cream"
      >
        {isFavorite ? `★ ${t("meditation.unfavorite")}` : `☆ ${t("meditation.favorite")}`}
      </button>
      <button
        type="button"
        onClick={handleComplete}
        disabled={isCompletedToday}
        className="flex-1 rounded-full bg-moss py-2.5 text-sm text-cream transition-colors duration-300
          disabled:opacity-60 dark:bg-sand dark:text-ink"
      >
        {isCompletedToday ? t("meditation.completedToday") : t("meditation.markComplete")}
      </button>
    </div>
  );
}
