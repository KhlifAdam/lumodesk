"use server";

import { cookies } from "next/headers";
import {
	CLIENT_INTENT_COOKIE,
	CLIENT_INTENT_MAX_AGE_SECONDS,
	CLIENT_INTENT_VALUE,
} from "@/lib/auth/client-intent";

/** Called before a client sign-up (email or OAuth). */
export async function setClientIntent(): Promise<void> {
	(await cookies()).set(CLIENT_INTENT_COOKIE, CLIENT_INTENT_VALUE, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: CLIENT_INTENT_MAX_AGE_SECONDS,
		path: "/",
	});
}

/** Called before a photographer sign-up, so a stale intent can't turn it into a client. */
export async function clearClientIntent(): Promise<void> {
	(await cookies()).delete(CLIENT_INTENT_COOKIE);
}
