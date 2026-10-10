import { brainDumpRepository } from "@/lib/repositories/dexie/brain-dump-repository";
import { gratitudeRepository } from "@/lib/repositories/dexie/gratitude-repository";
import { todayDateKey } from "@/lib/utils/date";

export type ExportKind = "freeTalk" | "gratitude";

export interface ExportEntry {
  kind: ExportKind;
  timestamp: number;
  text: string;
}

const KIND_LABEL: Record<ExportKind, string> = {
  freeTalk: "自由傾訴",
  gratitude: "感恩日記",
};

const ALL_ENTRIES_LIMIT = 100_000;

function startOfDay(dateKey: string): number {
  return new Date(`${dateKey}T00:00:00`).getTime();
}

function endOfDay(dateKey: string): number {
  return new Date(`${dateKey}T23:59:59.999`).getTime();
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatDateHeading(dateKey: string): string {
  return dateKey.replaceAll("-", "/");
}

export async function loadExportEntries(options: {
  kinds: ExportKind[];
  from?: string;
  to?: string;
}): Promise<ExportEntry[]> {
  const entries: ExportEntry[] = [];

  if (options.kinds.includes("freeTalk")) {
    const dumps = await brainDumpRepository.list(ALL_ENTRIES_LIMIT);
    for (const dump of dumps) {
      entries.push({ kind: "freeTalk", timestamp: dump.createdAt, text: dump.text });
    }
  }
  if (options.kinds.includes("gratitude")) {
    const items = await gratitudeRepository.list(ALL_ENTRIES_LIMIT);
    for (const item of items) {
      entries.push({ kind: "gratitude", timestamp: item.createdAt, text: item.text });
    }
  }

  const min = options.from ? startOfDay(options.from) : -Infinity;
  const max = options.to ? endOfDay(options.to) : Infinity;

  return entries
    .filter((entry) => entry.timestamp >= min && entry.timestamp <= max)
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function buildExportText(
  entries: ExportEntry[],
  range: { from?: string; to?: string }
): string {
  const rangeText =
    range.from || range.to
      ? `${range.from ? formatDateHeading(range.from) : "最早"} – ${range.to ? formatDateHeading(range.to) : "今天"}`
      : "全部";

  const lines: string[] = [
    "Reset · 內在對話匯出",
    `日期範圍：${rangeText}`,
    `匯出時間：${formatDateHeading(todayDateKey())}`,
    `共 ${entries.length} 則`,
  ];

  let currentDate = "";
  for (const entry of entries) {
    const dateKey = todayDateKey(new Date(entry.timestamp));
    if (dateKey !== currentDate) {
      currentDate = dateKey;
      lines.push("", `===== ${formatDateHeading(dateKey)} =====`);
    }
    lines.push("", `[${formatTime(entry.timestamp)}] ${KIND_LABEL[entry.kind]}`, entry.text);
  }

  // Leading BOM so Windows Notepad opens the Chinese text as UTF-8.
  return `﻿${lines.join("\n")}\n`;
}
