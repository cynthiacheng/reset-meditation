"use client";

import { formatDateTime } from "@/lib/utils/date";
import { t } from "@/lib/i18n/strings";
import type { TimelineEntry } from "@/lib/journal";

export function TimelineItem({
  entry,
  onDelete,
}: {
  entry: TimelineEntry;
  onDelete: (entry: TimelineEntry) => void;
}) {
  return (
    <div
      className="flex items-start justify-between gap-3 rounded-xl border border-sand/50 bg-cream/60 p-4
        dark:border-ink/50 dark:bg-ink/40"
    >
      <div className="min-w-0 flex-1">
        <div className="text-xs text-ink/40 dark:text-cream/40">{formatDateTime(entry.timestamp)}</div>
        {entry.kind === "meditation" && (
          <p className="mt-1 text-sm text-ink dark:text-cream">
            {entry.themeName} · {t("journal.meditationDone")}
          </p>
        )}
        {entry.kind === "brain-dump" && (
          <p className="mt-1 truncate text-sm text-ink dark:text-cream">{entry.text}</p>
        )}
        {entry.kind === "card" && (
          <p className="mt-1 text-sm text-ink dark:text-cream">
            {entry.wordText}
            {entry.question ? ` · ${entry.question}` : ""}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDelete(entry)}
        className="shrink-0 text-xs text-ink/40 dark:text-cream/40"
      >
        {t("common.delete")}
      </button>
    </div>
  );
}
