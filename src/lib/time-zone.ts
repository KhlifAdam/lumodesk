/** Cookie the browser writes with its IANA time zone (e.g. `Africa/Tunis`). */
export const TIME_ZONE_COOKIE = "tz";

export const FALLBACK_TIME_ZONE = "UTC";

export function isTimeZone(value: string | undefined): value is string {
	if (!value) return false;
	try {
		new Intl.DateTimeFormat("en", { timeZone: value });
		return true;
	} catch {
		return false;
	}
}
