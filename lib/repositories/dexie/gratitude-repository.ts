import { db } from "@/lib/db";
import type { GratitudeRepository } from "../types";

export const gratitudeRepository: GratitudeRepository = {
  async create({ text, source }) {
    const record = { text, source, createdAt: Date.now() };
    const id = await db.gratitudeEntries.add(record);
    return { ...record, id };
  },

  async list(limit = 200) {
    return db.gratitudeEntries.orderBy("createdAt").reverse().limit(limit).toArray();
  },

  async remove(id) {
    await db.gratitudeEntries.delete(id);
  },
};
