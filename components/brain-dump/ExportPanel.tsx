"use client";

import { useState } from "react";
import { buildExportText, loadExportEntries, type ExportKind } from "@/lib/export/innerDialogueExport";
import { downloadTextFile } from "@/lib/share/webShare";
import { todayDateKey } from "@/lib/utils/date";
import { t } from "@/lib/i18n/strings";

const inputClass =
  "w-full rounded-xl border border-sand/60 bg-cream/70 px-3 py-2 text-sm text-ink outline-none " +
  "focus:border-moss dark:border-ink/60 dark:bg-ink/40 dark:text-cream";

export function ExportPanel() {
  const [open, setOpen] = useState(false);
  const [kinds, setKinds] = useState<Set<ExportKind>>(new Set(["freeTalk", "gratitude"]));
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function toggleKind(kind: ExportKind) {
    setKinds((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });
  }

  async function handleExport() {
    if (kinds.size === 0) {
      setMessage(t("export.noKind"));
      return;
    }
    if (from && to && from > to) {
      setMessage(t("export.badRange"));
      return;
    }

    const entries = await loadExportEntries({
      kinds: [...kinds],
      from: from || undefined,
      to: to || undefined,
    });
    if (entries.length === 0) {
      setMessage(t("export.empty"));
      return;
    }

    const text = buildExportText(entries, { from: from || undefined, to: to || undefined });
    downloadTextFile(text, `reset-內在對話-${todayDateKey()}.txt`);
    setMessage(`${t("export.done")}（${entries.length}）`);
  }

  return (
    <div className="px-6 pb-8">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="w-full rounded-full border border-sand/60 py-2.5 text-xs text-ink dark:border-ink/60 dark:text-cream"
      >
        {t("export.toggle")}
      </button>

      {open && (
        <div className="mt-3 animate-fade-in space-y-4 rounded-2xl border border-sand/50 bg-cream/60 p-4
          dark:border-ink/50 dark:bg-ink/40">
          <fieldset>
            <legend className="mb-2 text-xs text-ink/60 dark:text-cream/60">{t("export.kindLabel")}</legend>
            <div className="flex gap-4 text-sm text-ink dark:text-cream">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={kinds.has("freeTalk")} onChange={() => toggleKind("freeTalk")} />
                {t("innerDialogue.tabFreeTalk")}
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={kinds.has("gratitude")} onChange={() => toggleKind("gratitude")} />
                {t("innerDialogue.tabGratitude")}
              </label>
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-ink/60 dark:text-cream/60">
              {t("export.from")}
              <input
                type="date"
                value={from}
                max={to || undefined}
                onChange={(event) => setFrom(event.target.value)}
                className={`${inputClass} mt-1`}
              />
            </label>
            <label className="text-xs text-ink/60 dark:text-cream/60">
              {t("export.to")}
              <input
                type="date"
                value={to}
                min={from || undefined}
                onChange={(event) => setTo(event.target.value)}
                className={`${inputClass} mt-1`}
              />
            </label>
          </div>
          <p className="text-xs text-ink/40 dark:text-cream/40">{t("export.rangeHint")}</p>

          <button
            type="button"
            onClick={handleExport}
            className="w-full rounded-full bg-moss py-2.5 text-sm text-cream dark:bg-sand dark:text-ink"
          >
            {t("export.download")}
          </button>
          {message && <p className="animate-fade-in text-xs text-moss dark:text-sand">{message}</p>}
        </div>
      )}
    </div>
  );
}
