"use client";

import { useState } from "react";
import Link from "next/link";
import { useSpeechRecognition } from "@/lib/speech/useSpeechRecognition";
import { brainDumpRepository } from "@/lib/repositories/dexie/brain-dump-repository";
import { todoRepository } from "@/lib/repositories/dexie/todo-repository";
import { copyToClipboard, downloadTextFile, shareText } from "@/lib/share/webShare";
import { t } from "@/lib/i18n/strings";
import type { ItemType } from "@/lib/db";

type AiState = "idle" | "pending" | "done" | "failed";

export function BrainDumpForm() {
  const [text, setText] = useState("");
  const [usedVoice, setUsedVoice] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [aiState, setAiState] = useState<AiState>("idle");
  const [lastEntryId, setLastEntryId] = useState<number | null>(null);
  const [lastEntryText, setLastEntryText] = useState("");

  const speech = useSpeechRecognition({
    onFinalResult: (chunk) => {
      setUsedVoice(true);
      setText((prev) => (prev ? `${prev}${chunk}` : chunk));
    },
  });

  function showStatus(message: string) {
    setStatusMessage(message);
    window.setTimeout(() => {
      setStatusMessage((current) => (current === message ? null : current));
    }, 3000);
  }

  async function handleSaveOnly() {
    const value = text.trim();
    if (!value) {
      showStatus(t("brainDump.emptyInput"));
      return;
    }
    await brainDumpRepository.create({ text: value, source: usedVoice ? "voice" : "text" });
    showStatus(t("brainDump.savedToast"));
    setText("");
    setUsedVoice(false);
  }

  async function handleExportAction(action: "copy" | "txt" | "md" | "share") {
    const value = text.trim();
    if (!value) {
      showStatus(t("brainDump.emptyInput"));
      return;
    }

    if (action === "copy") {
      const ok = await copyToClipboard(value);
      showStatus(ok ? t("brainDump.exportCopied") : t("brainDump.exportCopyFailed"));
    } else if (action === "txt") {
      downloadTextFile(value, `reset-brain-dump-${Date.now()}.txt`);
    } else if (action === "md") {
      downloadTextFile(value, `reset-brain-dump-${Date.now()}.md`);
    } else if (action === "share") {
      const ok = await shareText(value, "Reset · 內在對話");
      if (!ok) {
        downloadTextFile(value, `reset-brain-dump-${Date.now()}.txt`);
        showStatus(t("brainDump.exportShareUnsupported"));
      }
    }
    setExportOpen(false);
  }

  async function requestTodoExtraction(entryId: number, value: string) {
    setAiState("pending");
    try {
      const response = await fetch("/api/brain-dump/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value }),
        signal: AbortSignal.timeout(20000),
      });

      if (!response.ok) throw new Error("request_failed");

      const data = (await response.json()) as { items: { type: ItemType; text: string }[] };
      await todoRepository.createMany(data.items, { brainDumpEntryId: entryId });
      await brainDumpRepository.updateAiStatus(entryId, "done");
      setAiState("done");
    } catch {
      await brainDumpRepository.updateAiStatus(entryId, "failed");
      setAiState("failed");
    }
  }

  async function handleToTodo() {
    const value = text.trim();
    if (!value) {
      showStatus(t("brainDump.emptyInput"));
      return;
    }
    const entry = await brainDumpRepository.create({ text: value, source: usedVoice ? "voice" : "text" });
    const entryId = entry.id as number;
    await brainDumpRepository.updateAiStatus(entryId, "pending");
    setLastEntryId(entryId);
    setLastEntryText(value);
    setText("");
    setUsedVoice(false);
    await requestTodoExtraction(entryId, value);
  }

  function handleRetry() {
    if (lastEntryId === null) return;
    void requestTodoExtraction(lastEntryId, lastEntryText);
  }

  return (
    <div className="px-6 pb-8">
      <div className="relative">
        <textarea
          value={speech.isListening ? `${text}${speech.interimTranscript}` : text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t("brainDump.placeholder")}
          rows={8}
          className="w-full resize-none rounded-2xl border border-sand/60 bg-cream/70 p-4 pr-14 text-sm leading-relaxed
            text-ink outline-none placeholder:text-ink/40 focus:border-moss dark:border-ink/60 dark:bg-ink/40
            dark:text-cream dark:placeholder:text-cream/40"
        />
        {speech.isSupported && (
          <button
            type="button"
            onClick={speech.isListening ? speech.stop : speech.start}
            aria-label={speech.isListening ? t("brainDump.micStop") : t("brainDump.micStart")}
            className={`absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full text-lg
              transition-colors duration-300 ${
                speech.isListening
                  ? "animate-breathe bg-moss text-cream"
                  : "bg-sand/70 text-ink dark:bg-ink/60 dark:text-cream"
              }`}
          >
            🎙️
          </button>
        )}
      </div>

      {!speech.isSupported && (
        <p className="mt-2 text-xs text-ink/40 dark:text-cream/40">{t("brainDump.micUnsupported")}</p>
      )}
      {speech.error && <p className="mt-2 text-xs text-wood">{speech.error}</p>}
      {statusMessage && (
        <p className="mt-2 animate-fade-in text-xs text-moss dark:text-sand">{statusMessage}</p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={handleSaveOnly}
          className="rounded-full border border-sand/60 py-2.5 text-xs text-ink dark:border-ink/60 dark:text-cream"
        >
          {t("brainDump.saveOnly")}
        </button>
        <button
          type="button"
          onClick={() => setExportOpen((prev) => !prev)}
          className="rounded-full border border-sand/60 py-2.5 text-xs text-ink dark:border-ink/60 dark:text-cream"
        >
          {t("brainDump.export")}
        </button>
        <button
          type="button"
          onClick={handleToTodo}
          disabled={aiState === "pending"}
          className="rounded-full bg-moss py-2.5 text-xs text-cream transition-opacity duration-300
            disabled:opacity-60 dark:bg-sand dark:text-ink"
        >
          {t("brainDump.toTodo")}
        </button>
      </div>

      {exportOpen && (
        <div className="mt-3 grid animate-fade-in grid-cols-2 gap-2 rounded-2xl border border-sand/50
          bg-cream/60 p-3 dark:border-ink/50 dark:bg-ink/40">
          <button
            type="button"
            onClick={() => handleExportAction("copy")}
            className="rounded-xl py-2 text-xs text-ink dark:text-cream"
          >
            {t("brainDump.exportCopy")}
          </button>
          <button
            type="button"
            onClick={() => handleExportAction("share")}
            className="rounded-xl py-2 text-xs text-ink dark:text-cream"
          >
            {t("brainDump.exportShare")}
          </button>
          <button
            type="button"
            onClick={() => handleExportAction("txt")}
            className="rounded-xl py-2 text-xs text-ink dark:text-cream"
          >
            {t("brainDump.exportDownloadTxt")}
          </button>
          <button
            type="button"
            onClick={() => handleExportAction("md")}
            className="rounded-xl py-2 text-xs text-ink dark:text-cream"
          >
            {t("brainDump.exportDownloadMd")}
          </button>
        </div>
      )}

      {aiState !== "idle" && (
        <div className="mt-4 animate-fade-in rounded-2xl border border-sand/50 bg-cream/60 p-4 text-sm
          dark:border-ink/50 dark:bg-ink/40">
          {aiState === "pending" && (
            <p className="text-ink/60 dark:text-cream/60">{t("brainDump.toTodoPending")}</p>
          )}
          {aiState === "done" && (
            <div className="flex items-center justify-between gap-3">
              <p className="text-moss dark:text-sand">{t("brainDump.toTodoDone")}</p>
              <Link href="/inner-dialogue/todos" className="shrink-0 text-xs text-ink underline dark:text-cream">
                {t("brainDump.viewTodos")}
              </Link>
            </div>
          )}
          {aiState === "failed" && (
            <div className="flex items-center justify-between gap-3">
              <p className="text-ink/70 dark:text-cream/70">{t("brainDump.toTodoFailed")}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="shrink-0 text-xs text-ink underline dark:text-cream"
              >
                {t("common.retry")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
