"use client";

import { useState, useTransition } from "react";
import { bulkImportUsersAction, type BulkImportResult } from "./actions";

export function BulkImportForm() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await bulkImportUsersAction(text);
      setResult(res);
      setText("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-4">
      <label htmlFor="bulk-emails" className="block text-sm font-medium text-slate-700">
        批量導入 email（一行一個，或用逗號分隔）
      </label>
      <textarea
        id="bulk-emails"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder={"a@example.com\nb@example.com"}
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
          focus:border-slate-500 focus:outline-none"
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending || text.trim().length === 0}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isPending ? "匯入中…" : "匯入"}
        </button>
        {result ? (
          <p className="text-sm text-slate-600">
            新增 {result.added} 筆、已存在 {result.duplicates} 筆、格式錯誤 {result.invalid} 筆
          </p>
        ) : null}
      </div>
    </form>
  );
}
