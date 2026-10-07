/** Set right before a client sign-up, so the new account gets the client role. */
export const CLIENT_INTENT_COOKIE = "lumodesk_client_intent";
export const CLIENT_INTENT_VALUE = "client";
export const CLIENT_INTENT_MAX_AGE_SECONDS = 60 * 15;

export type AuthAudience = "photographer" | "client";

/** Auth screens and post-auth landing per audience. */
export const AUTH_PATHS = {
	photographer: { login: "/login", register: "/register", home: "/dashboard" },
	client: {
		/** Where clients arrive from a studio's site, before signing in. */
		welcome: "/client",
		login: "/client/login",
		register: "/client/register",
		home: "/portal",
	},
} as const satisfies Record<AuthAudience, Record<string, string>>;
