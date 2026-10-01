import type {
  AiStatus,
  BrainDumpEntryRecord,
  CardDrawRecord,
  CompletionRecord,
  DumpSource,
  ItemRecord,
  ItemType,
} from "@/lib/db";

export interface MeditationRepository {
  isFavorite(videoId: string): Promise<boolean>;
  listFavorites(): Promise<string[]>;
  toggleFavorite(videoId: string, themeId: string): Promise<boolean>;
  logCompletion(videoId: string, themeId: string, themeName: string): Promise<void>;
  isCompletedToday(videoId: string): Promise<boolean>;
  listCompletions(limit?: number): Promise<CompletionRecord[]>;
  removeCompletion(id: number): Promise<void>;
}

export interface BrainDumpRepository {
  create(input: { text: string; source: DumpSource }): Promise<BrainDumpEntryRecord>;
  updateAiStatus(id: number, status: AiStatus): Promise<void>;
  list(limit?: number): Promise<BrainDumpEntryRecord[]>;
  remove(id: number): Promise<void>;
}

export interface TodoRepository {
  createMany(
    items: { type: ItemType; text: string }[],
    link: { brainDumpEntryId?: number; cardDrawId?: number }
  ): Promise<ItemRecord[]>;
  toggleDone(id: number): Promise<void>;
  update(id: number, patch: { text?: string }): Promise<void>;
  remove(id: number): Promise<void>;
  list(filter?: { type?: ItemType; done?: boolean }): Promise<ItemRecord[]>;
}

export interface CardRepository {
  createDraw(draw: {
    imageCardId: string;
    wordCardId: string;
    question?: string;
    guidingQuestionIds: string[];
  }): Promise<CardDrawRecord>;
  saveReflection(id: number, patch: { reflection?: string; action?: string }): Promise<void>;
  list(limit?: number): Promise<CardDrawRecord[]>;
  remove(id: number): Promise<void>;
}
