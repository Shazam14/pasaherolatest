import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Constant-time compare so the password can't be probed a character at a time. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const challenge = () =>
  new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Pasahero PH admin"' },
  });

export function proxy(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;

  // Fail closed. An unset password must never mean an open door — this page
  // lists names, mobile numbers and email addresses.
  if (!expected) {
    return new NextResponse("Admin is not configured.", { status: 503 });
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return challenge();

  let password: string | undefined;
  try {
    password = atob(header.slice(6)).split(":")[1];
  } catch {
    return challenge();
  }

  if (!password || !safeEqual(password, expected)) return challenge();
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
