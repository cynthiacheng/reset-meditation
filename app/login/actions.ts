"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { USER_SESSION_COOKIE, USER_SESSION_MAX_AGE, createUserSessionToken } from "@/lib/auth/user-session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LoginFormState {
  status: "idle" | "rejected" | "error";
  message: string | null;
}

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const rawEmail = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!EMAIL_RE.test(rawEmail)) {
    return { status: "error", message: "login.invalidEmail" };
  }

  let user;
  try {
    user = await prisma.managedUser.findUnique({ where: { email: rawEmail } });
  } catch (error) {
    console.error("loginAction lookup failed:", error);
    return { status: "error", message: "login.genericError" };
  }

  if (!user || !user.active) {
    return { status: "rejected", message: "login.notApproved" };
  }

  const sessionToken = await createUserSessionToken(rawEmail);
  const cookieStore = await cookies();
  cookieStore.set(USER_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: USER_SESSION_MAX_AGE,
  });

  redirect("/meditations");
}
