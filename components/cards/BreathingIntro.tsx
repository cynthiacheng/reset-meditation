"use client";

import { useEffect, useState } from "react";
import { t } from "@/lib/i18n/strings";

export function BreathingIntro({ onContinue }: { onContinue: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  return (
    <div className="flex animate-fade-in flex-col items-center px-6 pb-8 pt-10 text-center">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <div className="animate-breathe absolute h-full w-full rounded-full bg-moss/30 dark:bg-sand/30" />
        <div className="absolute h-2/3 w-2/3 rounded-full bg-moss/40 dark:bg-sand/40" />
        <span className="relative font-heading text-lg text-ink dark:text-cream">
          {secondsLeft > 0 ? secondsLeft : "🌿"}
        </span>
      </div>
      <p className="mt-6 text-sm text-ink/60 dark:text-cream/60">{t("cards.breathingHint")}</p>
      <button
        type="button"
        onClick={onContinue}
        className="mt-8 rounded-full bg-moss px-8 py-2.5 text-sm text-cream transition-colors duration-300
          dark:bg-sand dark:text-ink"
      >
        {secondsLeft > 0 ? t("cards.skip") : t("cards.continue")}
      </button>
    </div>
  );
}
