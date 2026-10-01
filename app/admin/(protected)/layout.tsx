import Link from "next/link";
import { logoutAction } from "../logout-action";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="font-semibold">Reset 後台</span>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin/users" className="hover:underline">
              使用者管理
            </Link>
            <Link href="/admin/meditations" className="hover:underline">
              冥想內容
            </Link>
          </nav>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-slate-500 hover:underline">
            登出
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}
