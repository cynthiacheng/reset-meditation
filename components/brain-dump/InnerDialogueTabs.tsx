"use client";

import { useState } from "react";
import { BrainDumpForm } from "./BrainDumpForm";
import { GratitudeForm } from "./GratitudeForm";
import { t } from "@/lib/i18n/strings";

type Tab = "free" | "gratitude";

export function InnerDialogueTabs() {
  const [tab, setTab] = useState<Tab>("free");

  const tabs: { id: Tab; label: string }[] = [
    { id: "free", label: t("innerDialogue.tabFreeTalk") },
    { id: "gratitude", label: t("innerDialogue.tabGratitude") },
  ];

  return (
    <div>
      <div role="tablist" className="mx-6 mb-4 grid grid-cols-2 gap-1 rounded-full bg-sand/40 p-1 dark:bg-ink/50">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`rounded-full py-2 text-sm transition-colors duration-300 ${
              tab === item.id
                ? "bg-moss text-cream dark:bg-sand dark:text-ink"
                : "text-ink/60 dark:text-cream/60"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {tab === "free" ? (
        <>
          <p className="mb-4 px-6 text-sm text-ink/70 dark:text-cream/70">
            {t("brainDump.pageDescription")}
          </p>
          <BrainDumpForm />
        </>
      ) : (
        <GratitudeForm />
      )}
    </div>
  );
}
