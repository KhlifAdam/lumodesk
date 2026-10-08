import "server-only";

import { cookies } from "next/headers";
import { FALLBACK_TIME_ZONE, isTimeZone, TIME_ZONE_COOKIE } from "./time-zone";

/** The visitor's time zone as reported by their browser, else UTC. */
export async function getRequestTimeZone() {
	const value = (await cookies()).get(TIME_ZONE_COOKIE)?.value;
	return isTimeZone(value) ? value : FALLBACK_TIME_ZONE;
}
