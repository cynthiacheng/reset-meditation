"use client";

import { useState } from "react";
import { BreathingIntro } from "./BreathingIntro";
import { CardVisual } from "./CardVisual";
import { drawCards, drawGuidingQuestions } from "@/lib/cards";
import { cardRepository } from "@/lib/repositories/dexie/card-repository";
import { todoRepository } from "@/lib/repositories/dexie/todo-repository";
import { generateShareImageBlob } from "@/lib/cards/shareImage";
import { shareFile, downloadBlob, canShareFile } from "@/lib/share/webShare";
import { getFacebookShareUrl, getLineShareUrl, openShareWindow } from "@/lib/share/socialShare";
import { InstagramIcon, FacebookIcon, LineIcon } from "./SocialIcons";
import { t } from "@/lib/i18n/strings";
import type { CardImage, CardWord, GuidingQuestion } from "@/types";

type Step = "intro" | "question" | "reveal";

interface DrawState {
  imageCard: CardImage;
  wordCard: CardWord;
  questions: GuidingQuestion[];
  drawId: number | null;
}

export function DrawFlow() {
  const [step, setStep] = useState<Step>("intro");
  const [question, setQuestion] = useState("");
  const [draw, setDraw] = useState<DrawState | null>(null);
  const [reflection, setReflection] = useState("");
  const [action, setAction] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [addedToTodo, setAddedToTodo] = useState(false);
  const [saved, setSaved] = useState(false);

  function showStatus(message: string) {
    setStatusMessage(message);
    window.setTimeout(() => {
      setStatusMessage((current) => (current === message ? null : current));
    }, 3000);
  }

  async function handleDraw() {
    const { imageCard, wordCard } = drawCards();
    const questions = drawGuidingQuestions();
    const record = await cardRepository.createDraw({
      imageCardId: imageCard.id,
      wordCardId: wordCard.id,
      question: question.trim() || undefined,
      guidingQuestionIds: questions.map((q) => q.id),
    });
    setDraw({ imageCard, wordCard, questions, drawId: (record.id as number) ?? null });
    setReflection("");
    setAction("");
    setAddedToTodo(false);
    setSaved(false);
    setStep("reveal");
  }

  async function handleSaveReflection() {
    if (draw?.drawId == null) return;
    await cardRepository.saveReflection(draw.drawId, {
      reflection: reflection.trim() || undefined,
      action: action.trim() || undefined,
    });
    setSaved(true);
    showStatus(t("cards.saved"));
  }

  async function handleAddToTodo() {
    if (draw?.drawId == null || !action.trim()) return;
    await todoRepository.createMany([{ type: "todo", text: action.trim() }], {
      cardDrawId: draw.drawId,
    });
    setAddedToTodo(true);
    showStatus(t("cards.addedToTodo"));
  }

  function getShareText(): string {
    return `我在 Reset 的潛意識指引抽到了「${draw?.wordCard.text}」`;
  }

  async function handleShareInstagram() {
    if (!draw) return;
    const blob = await generateShareImageBlob(draw.imageCard, draw.wordCard);
    if (!blob) return;
    const file = new File([blob], `reset-card-${draw.wordCard.id}.png`, { type: "image/png" });
    if (canShareFile(file)) {
      // Mobile: hands off to the OS share sheet, where Instagram (if installed)
      // is one of the options — there is no separate web-based "share to
      // Instagram" link the way Facebook/LINE have.
      const ok = await shareFile(file, "Reset", getShareText());
      if (ok) return;
    }
    downloadBlob(blob, `reset-card-${draw.wordCard.id}.png`);
    showStatus(t("cards.shareImageDownloadedHint"));
  }

  function handleShareFacebook() {
    if (!draw) return;
    // Facebook's Share Dialog shares a URL (+ quote), not an attached image —
    // it doesn't accept a locally generated file.
    openShareWindow(getFacebookShareUrl(window.location.origin, getShareText()));
  }

  function handleShareLine() {
    if (!draw) return;
    openShareWindow(getLineShareUrl(window.location.origin, getShareText()));
  }

  function handleDrawAgain() {
    setQuestion("");
    setDraw(null);
    setStep("intro");
  }

  if (step === "intro") {
    return <BreathingIntro onContinue={() => setStep("question")} />;
  }

  if (step === "question") {
    return (
      <div className="animate-fade-in px-6 pb-8 pt-10">
        <label className="block text-sm text-ink/70 dark:text-cream/70">
          {t("cards.questionPrompt")}
        </label>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={t("cards.questionPlaceholder")}
          rows={3}
          className="mt-2 w-full resize-none rounded-2xl border border-sand/60 bg-cream/70 p-4 text-sm
            text-ink outline-none placeholder:text-ink/40 focus:border-moss dark:border-ink/60 dark:bg-ink/40
            dark:text-cream dark:placeholder:text-cream/40"
        />
        <button
          type="button"
          onClick={handleDraw}
          className="mt-6 w-full rounded-full bg-moss py-3 text-sm text-cream transition-colors duration-300
            dark:bg-sand dark:text-ink"
        >
          {t("cards.drawButton")}
        </button>
      </div>
    );
  }

  if (!draw) return null;

  return (
    <div className="animate-fade-in px-6 pb-10">
      {question.trim() && (
        <p className="mb-3 text-xs text-ink/50 dark:text-cream/50">
          {t("cards.yourQuestion")}：{question}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-sm">
          <CardVisual card={draw.imageCard} />
        </div>
        <div
          className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl border
            border-sand/50 bg-cream/70 p-3 text-center dark:border-ink/50 dark:bg-ink/40"
        >
          <span className="font-heading text-2xl text-ink dark:text-cream">{draw.wordCard.text}</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-sand/50 bg-cream/60 p-4 dark:border-ink/50 dark:bg-ink/40">
        <h2 className="font-heading text-sm text-ink dark:text-cream">
          {t("cards.guidingQuestionsTitle")}
        </h2>
        <ul className="mt-2 space-y-2 text-sm text-ink/70 dark:text-cream/70">
          {draw.questions.map((q) => (
            <li key={q.id}>・{q.text}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label className="block text-xs text-ink/60 dark:text-cream/60">
            {t("cards.reflectionLabel")}
          </label>
          <textarea
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder={t("cards.reflectionPlaceholder")}
            rows={3}
            className="mt-1 w-full resize-none rounded-2xl border border-sand/60 bg-cream/70 p-3 text-sm
              text-ink outline-none placeholder:text-ink/40 focus:border-moss dark:border-ink/60 dark:bg-ink/40
              dark:text-cream dark:placeholder:text-cream/40"
          />
        </div>
        <div>
          <label className="block text-xs text-ink/60 dark:text-cream/60">{t("cards.actionLabel")}</label>
          <input
            value={action}
            onChange={(event) => setAction(event.target.value)}
            placeholder={t("cards.actionPlaceholder")}
            className="mt-1 w-full rounded-full border border-sand/60 bg-cream/70 px-4 py-2.5 text-sm
              text-ink outline-none placeholder:text-ink/40 focus:border-moss dark:border-ink/60 dark:bg-ink/40
              dark:text-cream dark:placeholder:text-cream/40"
          />
        </div>
      </div>

      {statusMessage && (
        <p className="mt-2 animate-fade-in text-xs text-moss dark:text-sand">{statusMessage}</p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleSaveReflection}
          disabled={saved}
          className="rounded-full border border-sand/60 py-2.5 text-xs text-ink transition-opacity
            duration-300 disabled:opacity-50 dark:border-ink/60 dark:text-cream"
        >
          {saved ? t("cards.saved") : t("cards.save")}
        </button>
        <button
          type="button"
          onClick={handleAddToTodo}
          disabled={!action.trim() || addedToTodo}
          className="rounded-full border border-sand/60 py-2.5 text-xs text-ink transition-opacity
            duration-300 disabled:opacity-50 dark:border-ink/60 dark:text-cream"
        >
          {addedToTodo ? t("cards.addedToTodo") : t("cards.addToTodo")}
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="flex items-center justify-center gap-3 rounded-full bg-wood py-2 text-cream">
          <button
            type="button"
            onClick={handleShareInstagram}
            aria-label={t("cards.shareToInstagram")}
            className="transition-opacity duration-300 hover:opacity-80"
          >
            <InstagramIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleShareFacebook}
            aria-label={t("cards.shareToFacebook")}
            className="transition-opacity duration-300 hover:opacity-80"
          >
            <FacebookIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleShareLine}
            aria-label={t("cards.shareToLine")}
            className="transition-opacity duration-300 hover:opacity-80"
          >
            <LineIcon className="h-5 w-5" />
          </button>
        </div>
        <button
          type="button"
          onClick={handleDrawAgain}
          className="rounded-full bg-moss py-2.5 text-xs text-cream transition-colors duration-300
            dark:bg-sand dark:text-ink"
        >
          {t("cards.drawAgain")}
        </button>
      </div>
    </div>
  );
}
