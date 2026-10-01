import { db } from "@/lib/db";
import type { TodoRepository } from "../types";

export const todoRepository: TodoRepository = {
  async createMany(items, link) {
    const now = Date.now();
    const records = items.map((item) => ({
      ...item,
      done: false,
      brainDumpEntryId: link.brainDumpEntryId,
      cardDrawId: link.cardDrawId,
      createdAt: now,
    }));
    const ids = await db.items.bulkAdd(records, { allKeys: true });
    return records.map((record, i) => ({ ...record, id: ids[i] }));
  },

  async toggleDone(id) {
    const record = await db.items.get(id);
    if (record) await db.items.update(id, { done: !record.done });
  },

  async update(id, patch) {
    await db.items.update(id, patch);
  },

  async remove(id) {
    await db.items.delete(id);
  },

  async list(filter) {
    const all = await db.items.orderBy("createdAt").reverse().toArray();
    return all.filter((item) => {
      if (filter?.type && item.type !== filter.type) return false;
      if (filter?.done !== undefined && item.done !== filter.done) return false;
      return true;
    });
  },
};
