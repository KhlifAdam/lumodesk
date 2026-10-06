import "server-only";

import { cookies } from "next/headers";
import { LOCALE_COOKIE } from "@/i18n/config";

/** Language chosen in the current browser, if any (outside a request: none). */
export async function getRequestLocale(): Promise<string | undefined> {
	try {
		return (await cookies()).get(LOCALE_COOKIE)?.value;
	} catch {
		return undefined;
	}
}
