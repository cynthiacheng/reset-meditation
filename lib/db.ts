import Dexie, { type Table } from "dexie";

export type ItemType = "todo" | "emotion";
export type AiStatus = "idle" | "pending" | "done" | "failed";
export type DumpSource = "voice" | "text";

export interface FavoriteRecord {
  videoId: string;
  themeId: string;
  createdAt: number;
}

export interface CompletionRecord {
  id?: number;
  videoId: string;
  themeId: string;
  themeName: string;
  dateKey: string;
  completedAt: number;
}

export interface BrainDumpEntryRecord {
  id?: number;
  text: string;
  source: DumpSource;
  aiStatus: AiStatus;
  createdAt: number;
}

export interface ItemRecord {
  id?: number;
  type: ItemType;
  text: string;
  done: boolean;
  brainDumpEntryId?: number;
  cardDrawId?: number;
  createdAt: number;
}

export interface CardDrawRecord {
  id?: number;
  imageCardId: string;
  wordCardId: string;
  question?: string;
  guidingQuestionIds: string[];
  reflection?: string;
  action?: string;
  createdAt: number;
}

class ResetDatabase extends Dexie {
  favorites!: Table<FavoriteRecord, string>;
  completions!: Table<CompletionRecord, number>;
  brainDumpEntries!: Table<BrainDumpEntryRecord, number>;
  items!: Table<ItemRecord, number>;
  cardDraws!: Table<CardDrawRecord, number>;

  constructor() {
    super("reset_db");
    this.version(1).stores({
      favorites: "&videoId, themeId, createdAt",
      completions: "++id, videoId, themeId, dateKey, [videoId+dateKey], completedAt",
      brainDumpEntries: "++id, createdAt, aiStatus",
      items: "++id, type, done, brainDumpEntryId, cardDrawId, createdAt",
      cardDraws: "++id, createdAt",
    });
  }
}

export const db = new ResetDatabase();

export async function clearAllLocalData(): Promise<void> {
  await db.transaction(
    "rw",
    [db.favorites, db.completions, db.brainDumpEntries, db.items, db.cardDraws],
    async () => {
      await Promise.all([
        db.favorites.clear(),
        db.completions.clear(),
        db.brainDumpEntries.clear(),
        db.items.clear(),
        db.cardDraws.clear(),
      ]);
    }
  );
}
