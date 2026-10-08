import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";

/** Signed-in user for route handlers, which answer 401 instead of redirecting. */
export async function getApiUser() {
	const session = await auth.api.getSession({ headers: await headers() });
	return session?.user ?? null;
}
