"use client";

import { useTransition } from "react";
import { toggleUserActiveAction, deleteUserAction } from "./actions";

export interface UserRow {
  id: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export function UserTable({ users }: { users: UserRow[] }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(id: string, next: boolean) {
    startTransition(() => toggleUserActiveAction(id, next));
  }

  function handleDelete(id: string, email: string) {
    if (!confirm(`確定要刪除 ${email} 嗎？`)) return;
    startTransition(() => deleteUserAction(id));
  }

  if (users.length === 0) {
    return <p className="mt-6 text-sm text-slate-500">目前還沒有任何使用者。</p>;
  }

  return (
    <table className="mt-6 w-full text-left text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-slate-500">
          <th className="py-2 font-medium">Email</th>
          <th className="py-2 font-medium">狀態</th>
          <th className="py-2 font-medium">建立時間</th>
          <th className="py-2" />
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b border-slate-100">
            <td className="py-2">{user.email}</td>
            <td className="py-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleToggle(user.id, !user.active)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  user.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {user.active ? "啟用中" : "已停用"}
              </button>
            </td>
            <td className="py-2 text-slate-500">
              {new Date(user.createdAt).toLocaleDateString("zh-TW")}
            </td>
            <td className="py-2 text-right">
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDelete(user.id, user.email)}
                className="text-slate-400 hover:text-red-600"
              >
                刪除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
