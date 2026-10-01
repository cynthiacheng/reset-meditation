import { db } from "@/lib/db";
import type { CardRepository } from "../types";

export const cardRepository: CardRepository = {
  async createDraw(draw) {
    const record = { ...draw, createdAt: Date.now() };
    const id = await db.cardDraws.add(record);
    return { ...record, id };
  },

  async saveReflection(id, patch) {
    await db.cardDraws.update(id, patch);
  },

  async list(limit = 200) {
    return db.cardDraws.orderBy("createdAt").reverse().limit(limit).toArray();
  },

  async remove(id) {
    await db.cardDraws.delete(id);
  },
};
