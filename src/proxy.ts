import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Fast first gate: sends visitors without a session cookie to sign-in, with no
 * database or network call. The cookie is not trusted: `requirePhotographer`
 * validates the session on every dashboard page and action.
 *
 * Auth pages are not redirected when a cookie exists, because an expired
 * cookie would bounce between /login and /dashboard forever.
 */
export function proxy(request: NextRequest) {
	if (getSessionCookie(request.headers)) return NextResponse.next();
	return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
