import "server-only";

import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE } from "@/i18n/config";

/** Visitor's language preferences, most explicit first (`?lang`, cookie, browser). */
export async function getLocaleCandidates(lang?: string | string[]) {
	const cookie = (await cookies()).get(LOCALE_COOKIE)?.value;
	const browser = ((await headers()).get("accept-language") ?? "")
		.split(",")
		.map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
	return [typeof lang === "string" ? lang : undefined, cookie, ...browser];
}
