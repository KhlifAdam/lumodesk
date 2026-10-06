"use server";

import { cookies, headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { LOCALE_COOKIE, LOCALES } from "./config";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export async function setLocale(input: unknown) {
	const locale = z.enum(LOCALES).parse(input);
	(await cookies()).set(LOCALE_COOKIE, locale, {
		path: "/",
		maxAge: ONE_YEAR_IN_SECONDS,
		sameSite: "lax",
	});

	// Signed in: remember it, so emails to this account follow the same language.
	const session = await auth.api.getSession({ headers: await headers() });
	if (session) {
		await db.user.update({
			where: { id: session.user.id },
			data: { locale },
		});
	}
}
