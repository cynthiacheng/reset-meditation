"use client";

import { useState } from "react";
import { useSpeechRecognition } from "@/lib/speech/useSpeechRecognition";
import { gratitudeRepository } from "@/lib/repositories/dexie/gratitude-repository";
import { t } from "@/lib/i18n/strings";

export function GratitudeForm() {
  const [text, setText] = useState("");
  const [usedVoice, setUsedVoice] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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

  async function handleSave() {
    const value = text.trim();
    if (!value) {
      showStatus(t("gratitude.empty"));
      return;
    }
    await gratitudeRepository.create({ text: value, source: usedVoice ? "voice" : "text" });
    showStatus(t("gratitude.saved"));
    setText("");
    setUsedVoice(false);
  }

  return (
    <div className="px-6 pb-8">
      <p className="mb-4 text-sm text-ink/70 dark:text-cream/70">{t("gratitude.intro")}</p>
      <div className="relative">
        <textarea
          value={speech.isListening ? `${text}${speech.interimTranscript}` : text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t("gratitude.placeholder")}
          rows={6}
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

      <button
        type="button"
        onClick={handleSave}
        className="mt-4 w-full rounded-full bg-moss py-2.5 text-sm text-cream transition-opacity duration-300
          dark:bg-sand dark:text-ink"
      >
        {t("gratitude.save")}
      </button>
    </div>
  );
}
