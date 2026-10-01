"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface BulkImportResult {
  added: number;
  duplicates: number;
  invalid: number;
}

function parseEmails(raw: string): string[] {
  return raw
    .split(/[\n,;]+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);
}

export async function bulkImportUsersAction(raw: string): Promise<BulkImportResult> {
  const candidates = parseEmails(raw);
  const seen = new Set<string>();
  const valid: string[] = [];
  let invalid = 0;

  for (const email of candidates) {
    if (!EMAIL_RE.test(email)) {
      invalid++;
      continue;
    }
    if (seen.has(email)) continue;
    seen.add(email);
    valid.push(email);
  }

  if (valid.length === 0) {
    return { added: 0, duplicates: candidates.length - invalid, invalid };
  }

  const existing = await prisma.managedUser.findMany({
    where: { email: { in: valid } },
    select: { email: true },
  });
  const existingSet = new Set(existing.map((u) => u.email));
  const toCreate = valid.filter((e) => !existingSet.has(e));

  if (toCreate.length > 0) {
    await prisma.managedUser.createMany({
      data: toCreate.map((email) => ({ email })),
      skipDuplicates: true,
    });
  }

  revalidatePath("/admin/users");

  return {
    added: toCreate.length,
    duplicates: valid.length - toCreate.length,
    invalid,
  };
}

export async function toggleUserActiveAction(id: string, active: boolean) {
  await prisma.managedUser.update({ where: { id }, data: { active } });
  revalidatePath("/admin/users");
}

export async function deleteUserAction(id: string) {
  await prisma.managedUser.delete({ where: { id } });
  revalidatePath("/admin/users");
}
