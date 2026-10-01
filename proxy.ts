import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin/auth";
import { USER_SESSION_COOKIE, verifyUserSessionToken } from "@/lib/auth/user-session";

// Everything except static assets, the PWA manifest/service-worker, the
// offline fallback, and /login itself requires a session. /admin/** uses a
// separate admin session, checked in its own branch below.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|videos|cards|serwist|login|~offline).*)",
  ],
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const isValid = await verifyAdminSessionToken(token);
    if (!isValid) return NextResponse.redirect(new URL("/admin/login", request.url));
    return NextResponse.next();
  }

  const userToken = request.cookies.get(USER_SESSION_COOKIE)?.value;
  const session = await verifyUserSessionToken(userToken);
  if (!session) return NextResponse.redirect(new URL("/login", request.url));

  return NextResponse.next();
}
