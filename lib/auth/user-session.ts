import "server-only";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "reset_user_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecretKey(): Uint8Array {
  const secret = process.env.USER_SESSION_SECRET;
  if (!secret) throw new Error("USER_SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createUserSessionToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyUserSessionToken(
  token: string | undefined
): Promise<{ email: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return typeof payload.email === "string" ? { email: payload.email } : null;
  } catch {
    return null;
  }
}

export const USER_SESSION_COOKIE = COOKIE_NAME;
export const USER_SESSION_MAX_AGE = SESSION_TTL_SECONDS;
