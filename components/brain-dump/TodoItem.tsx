"use client";

import { useState } from "react";
import { todoRepository } from "@/lib/repositories/dexie/todo-repository";
import type { ItemRecord } from "@/lib/db";
import { t } from "@/lib/i18n/strings";

export function TodoItem({
  item,
  onChange,
  onDelete,
}: {
  item: ItemRecord;
  onChange: (item: ItemRecord) => void;
  onDelete: (id: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(item.text);
  const id = item.id as number;

  async function handleToggle() {
    await todoRepository.toggleDone(id);
    onChange({ ...item, done: !item.done });
  }

  async function handleSaveEdit() {
    const value = draft.trim();
    if (!value) return;
    await todoRepository.update(id, { text: value });
    onChange({ ...item, text: value });
    setIsEditing(false);
  }

  async function handleDelete() {
    await todoRepository.remove(id);
    onDelete(id);
  }

  const bodyText = item.type === "emotion" ? (
    <p className="text-sm text-ink dark:text-cream">{item.text}</p>
  ) : (
    <p
      className={`text-sm ${
        item.done ? "text-ink/40 line-through dark:text-cream/40" : "text-ink dark:text-cream"
      }`}
    >
      {item.text}
    </p>
  );

  if (item.type === "emotion") {
    return (
      <div className="rounded-xl border border-sand/50 bg-cream/60 p-4 dark:border-ink/50 dark:bg-ink/40">
        <div className="mb-1 text-[10px] uppercase tracking-wide text-wood">
          {t("todos.emotionLabel")}
        </div>
        {isEditing ? (
          <EditRow
            draft={draft}
            setDraft={setDraft}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          bodyText
        )}
        {!isEditing && <ItemActions onEdit={() => setIsEditing(true)} onDelete={handleDelete} />}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-sand/50 bg-cream/60 p-4
      dark:border-ink/50 dark:bg-ink/40">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={item.done ? "取消完成" : "標記完成"}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]
          transition-colors duration-300 ${
            item.done ? "border-moss bg-moss text-cream" : "border-sand/70 dark:border-ink/60"
          }`}
      >
        {item.done ? "✓" : ""}
      </button>
      <div className="flex-1">
        {isEditing ? (
          <EditRow
            draft={draft}
            setDraft={setDraft}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          bodyText
        )}
        {!isEditing && <ItemActions onEdit={() => setIsEditing(true)} onDelete={handleDelete} />}
      </div>
    </div>
  );
}

function EditRow({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: string;
  setDraft: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="rounded-lg border border-sand/60 bg-transparent px-2 py-1 text-sm text-ink outline-none
          focus:border-moss dark:border-ink/60 dark:text-cream"
      />
      <div className="flex gap-3 text-xs">
        <button type="button" onClick={onSave} className="text-moss dark:text-sand">
          {t("common.save")}
        </button>
        <button type="button" onClick={onCancel} className="text-ink/50 dark:text-cream/50">
          {t("common.cancel")}
        </button>
      </div>
    </div>
  );
}

function ItemActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="mt-1.5 flex gap-3 text-xs text-ink/40 dark:text-cream/40">
      <button type="button" onClick={onEdit}>
        {t("common.edit")}
      </button>
      <button type="button" onClick={onDelete}>
        {t("common.delete")}
      </button>
    </div>
  );
}
