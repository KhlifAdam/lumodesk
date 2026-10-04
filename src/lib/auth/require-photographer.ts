import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { ROLES } from "@/lib/auth/roles";
import { auth } from "@/lib/auth/server";

/**
 * Resolves the current photographer for private-space queries and actions.
 * Every tenant-scoped Prisma query MUST filter by the returned `photographerId`.
 * Cached per request so pages and nested components share one session lookup.
 */
export const requirePhotographer = cache(async () => {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) redirect("/login");
	if (session.user.role !== ROLES.photographer) redirect("/");

	return { session, photographerId: session.user.id };
});
