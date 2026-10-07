import "server-only";

import type { BetterAuthOptions } from "better-auth";
import { isLocale, LOCALE_COOKIE } from "@/i18n/config";
import {
	CLIENT_INTENT_COOKIE,
	CLIENT_INTENT_VALUE,
} from "@/lib/auth/client-intent";
import { ROLES } from "@/lib/auth/roles";
import { db } from "@/lib/db";

type HookContext = { getCookie?: (name: string) => string | null | undefined };

/** True when a photographer has invited this address to one of their projects. */
async function hasPendingInvitation(email: string) {
	const invitation = await db.project.findFirst({
		where: { inviteEmail: email.toLowerCase(), inviteStatus: "PENDING" },
		select: { id: true },
	});
	return invitation !== null;
}

/**
 * Accounts created from the client sign-up, or for an address with a pending
 * project invitation, get the client role. The invitation is checked on the
 * server so it holds whichever sign-up page was used. Every new account also
 * keeps the language it signed up in (for the emails sent to it).
 * User hooks run after the admin plugin's, so this role wins over its default.
 */
export const clientIntentHooks = {
	user: {
		create: {
			async before(user, ctx) {
				const context = ctx as HookContext | null;
				const locale = context?.getCookie?.(LOCALE_COOKIE);
				const isClient =
					context?.getCookie?.(CLIENT_INTENT_COOKIE) === CLIENT_INTENT_VALUE ||
					(await hasPendingInvitation(user.email));
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
