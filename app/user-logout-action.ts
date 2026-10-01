"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { USER_SESSION_COOKIE } from "@/lib/auth/user-session";

export async function userLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_SESSION_COOKIE);
  redirect("/login");
}
