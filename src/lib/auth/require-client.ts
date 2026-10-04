import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { AUTH_PATHS } from "@/lib/auth/client-intent";
import { auth } from "@/lib/auth/server";

/**
 * Any signed-in account may use the client portal (photographers can be
 * clients of other studios). Every portal query MUST filter by `clientId`.
 */
export const requireClient = cache(async () => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect(AUTH_PATHS.client.login);
	return { session, clientId: session.user.id };
});
