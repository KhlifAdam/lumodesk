import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth/server";

/** Any signed-in account. Cached per request. */
export const requireUser = cache(async () => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect("/login");
	return session;
});
