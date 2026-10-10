"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { addYoutubeVideoAction, addUploadVideoAction } from "./actions";

function readAudioDurationSeconds(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    const finish = (value: number | null) => {
      URL.revokeObjectURL(url);
      resolve(value);
    };
    audio.preload = "metadata";
    audio.onloadedmetadata = () =>
      finish(Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : null);
    audio.onerror = () => finish(null);
    audio.src = url;
  });
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m} 分 ${s} 秒` : `${s} 秒`;
}

export function VideoForm({ themeId }: { themeId: string }) {
  const [mode, setMode] = useState<"youtube" | "upload">("youtube");
  const [uploading, setUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [durationSec, setDurationSec] = useState<number | null>(null);
  const [durationUnknown, setDurationUnknown] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setAudioUrl(null);
    setUploadError(null);
    setDurationSec(null);
    setDurationUnknown(false);
    try {
      const seconds = await readAudioDurationSeconds(file);
      setDurationSec(seconds);
      setDurationUnknown(seconds === null);
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/blob-upload",
      });
      setAudioUrl(blob.url);
      setFileName(file.name);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "上傳失敗，請確認檔案格式後再試一次。"
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(formData: FormData) {
    formData.set("themeId", themeId);
    if (mode === "youtube") {
      await addYoutubeVideoAction(formData);
    } else {
      if (!audioUrl) return;
      formData.set("audioUrl", audioUrl);
      if (durationSec !== null) {
        formData.set("durationMin", String(Math.max(1, Math.round(durationSec / 60))));
      }
      await addUploadVideoAction(formData);
    }
    formRef.current?.reset();
    setAudioUrl(null);
    setFileName(null);
    setUploadError(null);
    setDurationSec(null);
    setDurationUnknown(false);
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mt-3 space-y-2 rounded-md bg-slate-50 p-3">
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => {
            setMode("youtube");
            setUploadError(null);
          }}
          className={`rounded-full px-3 py-1 ${mode === "youtube" ? "bg-slate-900 text-white" : "bg-white text-slate-500"}`}
        >
          YouTube 網址
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("upload");
            setUploadError(null);
          }}
          className={`rounded-full px-3 py-1 ${mode === "upload" ? "bg-slate-900 text-white" : "bg-white text-slate-500"}`}
        >
          上傳錄音檔
        </button>
      </div>

      <div className={`grid grid-cols-1 gap-2 ${
        mode === "youtube" || durationUnknown ? "sm:grid-cols-[2fr_1fr_80px_auto]" : "sm:grid-cols-[2fr_1fr_auto]"
      }`}>
        {mode === "youtube" ? (
          <input
            name="youtubeId"
            placeholder="YouTube 網址或影片 ID"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="text-xs"
              />
              {uploading ? <span className="text-xs text-slate-400">上傳中…</span> : null}
              {audioUrl && fileName ? (
                <span className="text-xs text-green-600">
                  已上傳：{fileName}
                  {durationSec !== null ? `（長度 ${formatDuration(durationSec)}）` : ""}
                </span>
              ) : null}
            </div>
            {durationUnknown && audioUrl ? (
              <span className="text-xs text-amber-600">讀不到這個檔案的長度，請在右邊手動填分鐘數。</span>
            ) : null}
            {uploadError ? (
              <span className="text-xs text-red-600">
                上傳失敗：{uploadError}（請確認是音訊檔案，支援 mp3、wav、m4a、ogg、webm 等格式）
              </span>
            ) : null}
          </div>
        )}
        <input
          name="title"
          placeholder="標題"
          required
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        {mode === "youtube" || durationUnknown ? (
          <input
            name="durationMin"
            type="number"
            min={1}
            placeholder="分鐘"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        ) : null}
        <button
          type="submit"
          disabled={mode === "upload" && (!audioUrl || uploading)}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          新增
        </button>
      </div>
    </form>
  );
}
