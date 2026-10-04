"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { LOCALE_COOKIE, LOCALES } from "./config";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export async function setLocale(input: unknown) {
	const locale = z.enum(LOCALES).parse(input);
	(await cookies()).set(LOCALE_COOKIE, locale, {
		path: "/",
		maxAge: ONE_YEAR_IN_SECONDS,
		sameSite: "lax",
	});
}
