import { db } from "@/lib/db";
import type { BrainDumpRepository } from "../types";

export const brainDumpRepository: BrainDumpRepository = {
  async create({ text, source }) {
    const record = { text, source, aiStatus: "idle" as const, createdAt: Date.now() };
    const id = await db.brainDumpEntries.add(record);
    return { ...record, id };
  },

  async updateAiStatus(id, status) {
    await db.brainDumpEntries.update(id, { aiStatus: status });
  },

  async list(limit = 200) {
    return db.brainDumpEntries.orderBy("createdAt").reverse().limit(limit).toArray();
  },

  async remove(id) {
    await db.brainDumpEntries.delete(id);
  },
};
