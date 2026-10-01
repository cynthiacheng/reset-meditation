"use client";

import { useEffect, useState } from "react";
import {
  FONT_SCALE_LEVELS,
  FONT_SCALE_STORAGE_KEY,
  DEFAULT_FONT_SCALE_INDEX,
  isValidFontScaleIndex,
} from "@/lib/fontScale";

function applyFontScale(index: number) {
  document.documentElement.style.fontSize = `${FONT_SCALE_LEVELS[index].percent}%`;
}

export function FontSizeControl() {
  const [index, setIndex] = useState(DEFAULT_FONT_SCALE_INDEX);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(FONT_SCALE_STORAGE_KEY));
    // Reading localStorage can only happen client-side after mount; the server
    // always renders the default level to keep hydration consistent.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isValidFontScaleIndex(stored)) setIndex(stored);
  }, []);

  function handleSelect(next: number) {
    setIndex(next);
    applyFontScale(next);
    try {
      window.localStorage.setItem(FONT_SCALE_STORAGE_KEY, String(next));
    } catch {
      // Private browsing / storage disabled — scale still applies for this visit.
    }
  }

  return (
    <div
      className="fixed right-4 top-4 z-50 flex items-center gap-1 rounded-full border border-sand/60
        bg-cream/90 px-2 py-1.5 shadow-sm backdrop-blur-sm dark:border-ink/60 dark:bg-ink/90"
      role="group"
      aria-label="調整字體大小"
    >
      {FONT_SCALE_LEVELS.map((level, i) => (
        <button
          key={level.label}
          type="button"
          aria-label={`字體大小：${level.label}`}
          aria-pressed={index === i}
          onClick={() => handleSelect(i)}
          className={`flex h-7 w-7 items-center justify-center rounded-full font-medium leading-none
            transition-colors duration-300 ${
              index === i
                ? "bg-moss text-cream dark:bg-sand dark:text-ink"
                : "text-ink/50 dark:text-cream/50"
            }`}
          style={{ fontSize: `${12 + i * 2.5}px` }}
        >
          A
        </button>
      ))}
    </div>
  );
}
