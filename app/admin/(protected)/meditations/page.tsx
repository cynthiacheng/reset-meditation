import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ThemeForm } from "./ThemeForm";
import { ThemeList } from "./ThemeList";

export const metadata: Metadata = {
  title: "冥想內容管理｜Reset 後台",
};

export const dynamic = "force-dynamic";

export default async function AdminMeditationsPage() {
  const themes = await prisma.meditationTheme.findMany({
    orderBy: { sortOrder: "asc" },
    include: { videos: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div>
      <h1 className="text-lg font-semibold">冥想內容管理</h1>
      <p className="mt-1 text-sm text-slate-500">新增主題後，可在下方加入 YouTube 影片或上傳錄音檔。</p>
      <div className="mt-6">
        <ThemeForm />
      </div>
      <ThemeList
        themes={themes.map((t) => ({
          id: t.id,
          themeName: t.themeName,
          emoji: t.emoji,
          description: t.description,
          videos: t.videos.map((v) => ({
            id: v.id,
            title: v.title,
            sourceType: v.sourceType,
            durationMin: v.durationMin,
          })),
        }))}
      />
    </div>
  );
}
