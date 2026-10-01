"use client";

import { useTransition } from "react";
import { deleteThemeAction, deleteVideoAction } from "./actions";
import { VideoForm } from "./VideoForm";

export interface ThemeRow {
  id: string;
  themeName: string;
  emoji: string;
  description: string;
  videos: { id: string; title: string; sourceType: string; durationMin: number }[];
}

export function ThemeList({ themes }: { themes: ThemeRow[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mt-6 space-y-4">
      {themes.map((theme) => (
        <div key={theme.id} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="mr-2">{theme.emoji}</span>
              <span className="font-medium">{theme.themeName}</span>
              <span className="ml-2 text-xs text-slate-400">{theme.description}</span>
            </div>
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (confirm(`確定要刪除主題「${theme.themeName}」嗎？底下的影片/錄音也會一併刪除。`)) {
                  startTransition(() => deleteThemeAction(theme.id));
                }
              }}
              className="text-xs text-slate-400 hover:text-red-600"
            >
              刪除主題
            </button>
          </div>

          <ul className="mt-3 space-y-1">
            {theme.videos.map((video) => (
              <li key={video.id} className="flex items-center justify-between text-sm">
                <span>
                  {video.sourceType === "youtube" ? "🎬" : "🎙️"} {video.title} ·{" "}
                  {video.durationMin} 分鐘
                </span>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(() => deleteVideoAction(video.id))}
                  className="text-xs text-slate-400 hover:text-red-600"
                >
                  刪除
                </button>
              </li>
            ))}
            {theme.videos.length === 0 ? (
              <li className="text-xs text-slate-400">尚未加入影片或錄音</li>
            ) : null}
          </ul>

          <VideoForm themeId={theme.id} />
        </div>
      ))}
    </div>
  );
}
