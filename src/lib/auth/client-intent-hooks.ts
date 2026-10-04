import "server-only";

import type { BetterAuthOptions } from "better-auth";
import {
	CLIENT_INTENT_COOKIE,
	CLIENT_INTENT_VALUE,
} from "@/lib/auth/client-intent";
import { ROLES } from "@/lib/auth/roles";

type HookContext = { getCookie?: (name: string) => string | null | undefined };

/**
 * Accounts created from the client sign-up get the client role.
 * User hooks run after the admin plugin's, so this role wins over its default.
 */
export const clientIntentHooks = {
	user: {
		create: {
			async before(_user, ctx) {
				const intent = (ctx as HookContext | null)?.getCookie?.(
					CLIENT_INTENT_COOKIE,
				);
				if (intent !== CLIENT_INTENT_VALUE) return;
				return { data: { role: ROLES.client } };
			},
		},
	},
} satisfies BetterAuthOptions["databaseHooks"];
