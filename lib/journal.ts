import { meditationRepository } from "@/lib/repositories/dexie/meditation-repository";
import { brainDumpRepository } from "@/lib/repositories/dexie/brain-dump-repository";
import { gratitudeRepository } from "@/lib/repositories/dexie/gratitude-repository";
import { cardRepository } from "@/lib/repositories/dexie/card-repository";
import { getWordCard } from "@/lib/cards";
import { todayDateKey } from "@/lib/utils/date";
import type { AiStatus } from "@/lib/db";

export interface CheckInSummary {
  completedDateKeys: Set<string>;
  totalCount: number;
  currentStreak: number;
}

function computeCurrentStreak(dateKeys: Set<string>, today: Date = new Date()): number {
  const cursor = new Date(today);
  if (!dateKeys.has(todayDateKey(cursor))) {
    // Haven't checked in yet today — don't let that alone zero out the streak,
    // start counting from yesterday instead.
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (dateKeys.has(todayDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export async function getCheckInSummary(): Promise<CheckInSummary> {
  // Use a high limit here (unlike the timeline's default) since check-in
  // totals and streaks should reflect full history, not just recent entries.
  const completions = await meditationRepository.listCompletions(3650);
  const completedDateKeys = new Set(completions.map((c) => c.dateKey));
  return {
    completedDateKeys,
    totalCount: completions.length,
    currentStreak: computeCurrentStreak(completedDateKeys),
  };
}

export type TimelineEntry =
  | {
      kind: "meditation";
      id: number;
      timestamp: number;
      themeName: string;
    }
  | {
      kind: "brain-dump";
      id: number;
      timestamp: number;
      text: string;
      aiStatus: AiStatus;
    }
  | {
      kind: "gratitude";
      id: number;
      timestamp: number;
      text: string;
    }
  | {
      kind: "card";
      id: number;
      timestamp: number;
      wordText: string;
      question?: string;
    };

export async function getTimelineEntries(): Promise<TimelineEntry[]> {
  const [completions, dumps, draws, gratitudes] = await Promise.all([
    meditationRepository.listCompletions(),
    brainDumpRepository.list(),
    cardRepository.list(),
    gratitudeRepository.list(),
  ]);

  const meditationEntries: TimelineEntry[] = completions.map((completion) => ({
    kind: "meditation",
    id: completion.id as number,
    timestamp: completion.completedAt,
    themeName: completion.themeName,
  }));

  const dumpEntries: TimelineEntry[] = dumps.map((dump) => ({
    kind: "brain-dump",
    id: dump.id as number,
    timestamp: dump.createdAt,
    text: dump.text,
    aiStatus: dump.aiStatus,
  }));

  const gratitudeEntries: TimelineEntry[] = gratitudes.map((entry) => ({
    kind: "gratitude",
    id: entry.id as number,
    timestamp: entry.createdAt,
    text: entry.text,
  }));

  const cardEntries: TimelineEntry[] = draws.map((draw) => ({
    kind: "card",
    id: draw.id as number,
    timestamp: draw.createdAt,
    wordText: getWordCard(draw.wordCardId)?.text ?? "",
    question: draw.question,
  }));

  return [...meditationEntries, ...dumpEntries, ...gratitudeEntries, ...cardEntries].sort(
    (a, b) => b.timestamp - a.timestamp
  );
}

export async function deleteTimelineEntry(entry: TimelineEntry): Promise<void> {
  if (entry.kind === "meditation") {
    await meditationRepository.removeCompletion(entry.id);
  } else if (entry.kind === "brain-dump") {
    await brainDumpRepository.remove(entry.id);
  } else if (entry.kind === "gratitude") {
    await gratitudeRepository.remove(entry.id);
  } else {
    await cardRepository.remove(entry.id);
  }
}
