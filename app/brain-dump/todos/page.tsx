"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { todoRepository } from "@/lib/repositories/dexie/todo-repository";
import { TodoItem } from "@/components/brain-dump/TodoItem";
import { PageHeader } from "@/components/ui/PageHeader";
import { t } from "@/lib/i18n/strings";
import type { ItemRecord } from "@/lib/db";

export default function TodosPage() {
  const [items, setItems] = useState<ItemRecord[] | null>(null);

  useEffect(() => {
    let active = true;
    todoRepository.list().then((data) => {
      if (active) setItems(data);
    });
    return () => {
      active = false;
    };
  }, []);

  function handleChange(updated: ItemRecord) {
    setItems((prev) => prev?.map((item) => (item.id === updated.id ? updated : item)) ?? prev);
  }

  function handleDelete(id: number) {
    setItems((prev) => prev?.filter((item) => item.id !== id) ?? prev);
  }

  return (
    <div>
      <div className="px-6 pb-2 pt-8">
        <Link href="/brain-dump" className="text-sm text-moss dark:text-sand">
          ← Brain dump
        </Link>
      </div>
      <PageHeader title={t("todos.pageTitle")} description={t("todos.pageDescription")} />
      <div className="space-y-3 px-6 pb-8">
        {items === null ? (
          <p className="text-sm text-ink/50 dark:text-cream/50">{t("common.loading")}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-ink/50 dark:text-cream/50">{t("todos.empty")}</p>
        ) : (
          items.map((item) => (
            <TodoItem key={item.id} item={item} onChange={handleChange} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}
