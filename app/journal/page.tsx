"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TimelineItem } from "@/components/journal/TimelineItem";
import { ClearAllButton } from "@/components/journal/ClearAllButton";
import { CompletionCalendar } from "@/components/journal/CompletionCalendar";
import {
  getTimelineEntries,
  deleteTimelineEntry,
  getCheckInSummary,
  type TimelineEntry,
  type CheckInSummary,
} from "@/lib/journal";
import { t } from "@/lib/i18n/strings";
import { userLogoutAction } from "@/app/user-logout-action";

export default function JournalPage() {
  const [entries, setEntries] = useState<TimelineEntry[] | null>(null);
  const [checkIn, setCheckIn] = useState<CheckInSummary | null>(null);

  useEffect(() => {
    let active = true;
    getTimelineEntries().then((data) => {
      if (active) setEntries(data);
    });
    getCheckInSummary().then((data) => {
      if (active) setCheckIn(data);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(entry: TimelineEntry) {
    await deleteTimelineEntry(entry);
    setEntries((prev) => prev?.filter((e) => !(e.kind === entry.kind && e.id === entry.id)) ?? prev);
    if (entry.kind === "meditation") {
      getCheckInSummary().then(setCheckIn);
    }
  }

  function handleCleared() {
    setEntries([]);
    setCheckIn({ completedDateKeys: new Set(), totalCount: 0, currentStreak: 0 });
  }

  return (
    <div>
      <PageHeader title={t("journal.pageTitle")} description={t("journal.pageDescription")} />
      <div className="px-6 pb-3">
        {checkIn ? (
          <CompletionCalendar
            completedDateKeys={checkIn.completedDateKeys}
            totalCount={checkIn.totalCount}
            currentStreak={checkIn.currentStreak}
          />
        ) : null}
      </div>
      <div className="space-y-2 px-6 pb-3">
        <ClearAllButton onCleared={handleCleared} />
        <form action={userLogoutAction}>
          <button type="submit" className="block text-xs text-ink/50 dark:text-cream/50">
            {t("login.logout")}
          </button>
        </form>
      </div>
      <div className="space-y-3 px-6 pb-8">
        {entries === null ? (
          <p className="text-sm text-ink/50 dark:text-cream/50">{t("common.loading")}</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-ink/50 dark:text-cream/50">{t("journal.empty")}</p>
        ) : (
          entries.map((entry) => (
            <TimelineItem key={`${entry.kind}-${entry.id}`} entry={entry} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}
