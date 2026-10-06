import "server-only";

import type { BetterAuthOptions } from "better-auth";
import { isLocale, LOCALE_COOKIE } from "@/i18n/config";
import {
	CLIENT_INTENT_COOKIE,
	CLIENT_INTENT_VALUE,
} from "@/lib/auth/client-intent";
import { ROLES } from "@/lib/auth/roles";

type HookContext = { getCookie?: (name: string) => string | null | undefined };

/**
 * Accounts created from the client sign-up get the client role, and every new
 * account keeps the language it signed up in (for the emails sent to it).
 * User hooks run after the admin plugin's, so this role wins over its default.
 */
export const clientIntentHooks = {
	user: {
		create: {
			async before(_user, ctx) {
				const context = ctx as HookContext | null;
				const locale = context?.getCookie?.(LOCALE_COOKIE);
				const isClient =
					context?.getCookie?.(CLIENT_INTENT_COOKIE) === CLIENT_INTENT_VALUE;
				return {
					data: {
						...(isLocale(locale ?? undefined) && { locale }),
						...(isClient && { role: ROLES.client }),
					},
				};
			},
		},
	},
} satisfies BetterAuthOptions["databaseHooks"];
