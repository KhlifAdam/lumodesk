import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { requireUser } from "@/lib/auth/require-user";
import { ROLES } from "@/lib/auth/roles";

/**
 * Resolves the current photographer for private-space queries and actions.
 * Every tenant-scoped Prisma query MUST filter by the returned `photographerId`.
 * Cached per request so pages and nested components share one session lookup.
 */
export const requirePhotographer = cache(async () => {
	const session = await requireUser();
	const { role } = session.user;

	// Client accounts are offered to open a studio with the same login.
	if (role === ROLES.client) redirect("/start-studio");
	if (role !== ROLES.photographer) redirect("/");

	return { session, photographerId: session.user.id };
});
