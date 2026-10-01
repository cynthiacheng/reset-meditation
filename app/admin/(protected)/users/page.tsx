import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BulkImportForm } from "./BulkImportForm";
import { UserTable } from "./UserTable";

export const metadata: Metadata = {
  title: "使用者管理｜Reset 後台",
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.managedUser.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-lg font-semibold">使用者管理</h1>
      <p className="mt-1 text-sm text-slate-500">
        目前僅作為名單管理，尚未串接一般使用者登入；停用不會影響任何人使用網站。
      </p>
      <div className="mt-6">
        <BulkImportForm />
      </div>
      <UserTable
        users={users.map((u) => ({
          id: u.id,
          email: u.email,
          active: u.active,
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
