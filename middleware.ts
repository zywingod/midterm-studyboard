import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

// Middleware runs BEFORE any route handler, for every request matching
// `config.matcher` below — the right layer for rejecting abusive
// requests before they reach a database-touching route handler.
//
// We're protecting two routes:
//  - /api/register — prevents scripted mass account creation
//  - /api/auth/callback/credentials — the actual URL NextAuth's
//    signIn("credentials", ...) posts to; limiting it slows down
//    password-guessing (brute force) attacks.
const LIMIT = 5; // max attempts
const WINDOW_MS = 60_000; // per 1 minute

// TODO (Step 7): Implement the middleware function.
// 1. Get the caller's IP from the "x-forwarded-for" header (it may
//    contain a comma-separated list — take the first value, trimmed;
//    fall back to "unknown" if the header is missing).
// 2. Build a key combining the IP and the request's pathname
//    (request.nextUrl.pathname), e.g. `${ip}:${pathname}`.
// 3. Call rateLimit(key, LIMIT, WINDOW_MS).
// 4. If it fails, return a 429 response with a JSON error message.
// 5. Otherwise, return NextResponse.next() — optionally attaching an
//    "X-RateLimit-Remaining" header with the `remaining` count, which
//    is a nice touch (not required) so clients know how close they are
//    to being limited.
export function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const key = `${ip}:${request.nextUrl.pathname}`;
  
  const { success, remaining } = rateLimit(key, LIMIT, WINDOW_MS);  

  if (!success) {
    return NextResponse.json(
        { error: "Too many requests, please try again later" }, 
        { status: 429 }
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  return response; // TODO: replace with real rate limiting logic
}

// TODO (Step 7): Set config.matcher to the two paths listed in the
// comment above, so this middleware only runs for those routes (running
// it for EVERY request, including static assets, would be wasteful).
export const config = {
  matcher: [
    "/api/register",
    "/api/auth/callback/credentials"
  ],
};