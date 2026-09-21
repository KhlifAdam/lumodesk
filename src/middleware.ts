import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const pathName = request.nextUrl.pathname;
	const isAuthRoute = ["/login", "/register"].includes(pathName);

	// Fetch the session from the Better Auth API route
	const response = await fetch(new URL("/api/auth/get-session", request.url), {
		headers: {
			cookie: request.headers.get("cookie") || "",
		},
	});

	const session = response.ok ? await response.json() : null;

	if (!session) {
		if (isAuthRoute) {
			return NextResponse.next();
		}
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (isAuthRoute) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/login", "/register"],
};
