"use client";

import { useMemo, useState } from "react";

const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

function dateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

interface DayCell {
  key: string;
  day: number;
  inMonth: boolean;
}

export function CompletionCalendar({
  completedDateKeys,
  totalCount,
  currentStreak,
}: {
  completedDateKeys: Set<string>;
  totalCount: number;
  currentStreak: number;
}) {
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const todayKey = useMemo(() => {
    const now = new Date();
    return dateKey(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const weeks = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startWeekday = new Date(year, month, 1).getDay();

    const cells: DayCell[] = [];
    for (let i = 0; i < startWeekday; i++) {
      cells.push({ key: `blank-start-${i}`, day: 0, inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ key: dateKey(year, month, d), day: d, inMonth: true });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ key: `blank-end-${cells.length}`, day: 0, inMonth: false });
    }

    const rows: DayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }
    return rows;
  }, [year, month]);

  return (
    <div className="rounded-2xl bg-cream/85 px-4 py-4 shadow-sm backdrop-blur-sm dark:bg-ink/70">
      <div className="flex items-center justify-around text-center">
        <div>
          <div className="font-heading text-2xl text-moss dark:text-sand">{currentStreak}</div>
          <div className="mt-0.5 text-xs text-ink/60 dark:text-cream/60">連續天數</div>
        </div>
        <div className="h-8 w-px bg-sand/50 dark:bg-cream/20" />
        <div>
          <div className="font-heading text-2xl text-moss dark:text-sand">{totalCount}</div>
          <div className="mt-0.5 text-xs text-ink/60 dark:text-cream/60">累積次數</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          aria-label="上個月"
          className="px-2 py-1 text-sm text-ink/50 transition-colors duration-300 dark:text-cream/50"
        >
          ←
        </button>
        <div className="text-sm text-ink dark:text-cream">
          {year}年{month + 1}月
        </div>
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          aria-label="下個月"
          className="px-2 py-1 text-sm text-ink/50 transition-colors duration-300 dark:text-cream/50"
        >
          →
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[11px] text-ink/40 dark:text-cream/40">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="mt-1 space-y-1">
        {weeks.map((row, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {row.map((cell) => {
              if (!cell.inMonth) return <div key={cell.key} className="aspect-square" />;
              const isCompleted = completedDateKeys.has(cell.key);
              const isToday = cell.key === todayKey;
              return (
                <div
                  key={cell.key}
                  className={`flex aspect-square items-center justify-center rounded-full text-xs
                    transition-colors duration-300 ${
                      isCompleted
                        ? "bg-moss text-cream dark:bg-sand dark:text-ink"
                        : "text-ink/50 dark:text-cream/50"
                    } ${isToday ? "ring-1 ring-wood" : ""}`}
                >
                  {cell.day}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
