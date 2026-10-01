"use client";

import { useState } from "react";
import { clearAllLocalData } from "@/lib/db";
import { t } from "@/lib/i18n/strings";

export function ClearAllButton({ onCleared }: { onCleared: () => void }) {
  const [confirming, setConfirming] = useState(false);

  async function handleConfirm() {
    await clearAllLocalData();
    setConfirming(false);
    onCleared();
  }

  if (confirming) {
    return (
      <div className="w-full rounded-xl border border-wood/50 bg-wood/10 p-3 text-xs text-ink dark:text-cream">
        <p>{t("journal.clearAllConfirm")}</p>
        <div className="mt-2 flex gap-4">
          <button type="button" onClick={handleConfirm} className="text-wood underline">
            {t("journal.clearAllConfirmButton")}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="text-ink/50 dark:text-cream/50"
          >
            {t("common.cancel")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setConfirming(true)} className="text-xs text-wood underline">
      {t("journal.clearAll")}
    </button>
  );
}
