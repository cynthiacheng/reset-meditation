import { db } from "@/lib/db";
import { todayDateKey } from "@/lib/utils/date";
import type { MeditationRepository } from "../types";

export const meditationRepository: MeditationRepository = {
  async isFavorite(videoId) {
    const record = await db.favorites.get(videoId);
    return !!record;
  },

  async listFavorites() {
    const records = await db.favorites.toArray();
    return records.map((r) => r.videoId);
  },

  async toggleFavorite(videoId, themeId) {
    const existing = await db.favorites.get(videoId);
    if (existing) {
      await db.favorites.delete(videoId);
      return false;
    }
    await db.favorites.put({ videoId, themeId, createdAt: Date.now() });
    return true;
  },

  async logCompletion(videoId, themeId, themeName) {
    await db.completions.add({
      videoId,
      themeId,
      themeName,
      dateKey: todayDateKey(),
      completedAt: Date.now(),
    });
  },

  async isCompletedToday(videoId) {
    const count = await db.completions
      .where("[videoId+dateKey]")
      .equals([videoId, todayDateKey()])
      .count();
    return count > 0;
  },

  async listCompletions(limit = 200) {
    return db.completions.orderBy("completedAt").reverse().limit(limit).toArray();
  },

  async removeCompletion(id) {
    await db.completions.delete(id);
  },
};
