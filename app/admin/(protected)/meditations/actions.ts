"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseYoutubeId } from "@/lib/meditations/parseYoutubeId";

function slugify(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9一-鿿]+/g, "-")
      .replace(/(^-|-$)/g, "") || `theme-${Date.now()}`
  );
}

export async function createThemeAction(formData: FormData) {
  const themeName = String(formData.get("themeName") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!themeName) return;

  const id = slugify(themeName);

  await prisma.meditationTheme.create({
    data: { id, themeName, emoji, description },
  });

  revalidatePath("/admin/meditations");
  revalidatePath("/meditations");
}

export async function deleteThemeAction(themeId: string) {
  await prisma.meditationTheme.delete({ where: { id: themeId } });
  revalidatePath("/admin/meditations");
  revalidatePath("/meditations");
}

export async function addYoutubeVideoAction(formData: FormData) {
  const themeId = String(formData.get("themeId") ?? "");
  const rawUrl = String(formData.get("youtubeId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const durationMin = Number(formData.get("durationMin") ?? 0);
  const youtubeId = parseYoutubeId(rawUrl);
  if (!themeId || !youtubeId || !title || !durationMin) return;

  await prisma.meditationVideo.create({
    data: { themeId, sourceType: "youtube", youtubeId, title, durationMin },
  });

  revalidatePath("/admin/meditations");
  revalidatePath("/meditations");
}

export async function addUploadVideoAction(formData: FormData) {
  const themeId = String(formData.get("themeId") ?? "");
  const audioUrl = String(formData.get("audioUrl") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const durationMin = Number(formData.get("durationMin") ?? 0);
  if (!themeId || !audioUrl || !title || !durationMin) return;

  await prisma.meditationVideo.create({
    data: { themeId, sourceType: "upload", audioUrl, title, durationMin },
  });

  revalidatePath("/admin/meditations");
  revalidatePath("/meditations");
}

export async function deleteVideoAction(videoId: string) {
  await prisma.meditationVideo.delete({ where: { id: videoId } });
  revalidatePath("/admin/meditations");
  revalidatePath("/meditations");
}
