"use client";

import { useRef } from "react";
import { createThemeAction } from "./actions";

export function ThemeForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createThemeAction(formData);
        formRef.current?.reset();
      }}
      className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-[80px_1fr_2fr_auto]"
    >
      <input
        name="emoji"
        placeholder="🌙"
        required
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <input
        name="themeName"
        placeholder="主題名稱"
        required
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <input
        name="description"
        placeholder="一句話描述"
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        新增主題
      </button>
    </form>
  );
}
