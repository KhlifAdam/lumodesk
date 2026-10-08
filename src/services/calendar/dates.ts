import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";
import { z } from "zod";
import { DAY_MS } from "./constants";
import type { CalendarEntry } from "./types";

// Days are handled as `yyyy-MM-dd` keys; month pages as `yyyy-MM`.
// Key arithmetic runs on UTC dates, so it never depends on the server's zone.

export const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
export const dayKeySchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, "invalidDate");
export const timeSchema = z
	.string()
	.regex(/^([01]\d|2[0-3]):[0-5]\d$/, "invalidTime");

const keyToUtc = (key: string) => Date.parse(`${key}T00:00:00.000Z`);
const utcToKey = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export const addDays = (key: string, days: number) =>
	utcToKey(keyToUtc(key) + days * DAY_MS);

export const dayDiff = (from: string, to: string) =>
	Math.round((keyToUtc(to) - keyToUtc(from)) / DAY_MS);

/** Today's key / month in the given zone. */
export const todayKey = (timeZone: string) =>
	format(new TZDate(Date.now(), timeZone), "yyyy-MM-dd");

export const shiftMonth = (month: string, delta: number) => {
	const [year, index] = month.split("-").map(Number);
	return utcToKey(Date.UTC(year, index - 1 + delta, 1)).slice(0, 7);
};

/** Whole weeks covering the month, starting on `weekStartsOn` (0 = Sunday). */
export function monthGridDays(month: string, weekStartsOn: number) {
	const first = `${month}-01`;
	const lead = (new Date(keyToUtc(first)).getUTCDay() - weekStartsOn + 7) % 7;
	const start = addDays(first, -lead);
	const last = addDays(`${shiftMonth(month, 1)}-01`, -1);
	const weeks = Math.ceil((dayDiff(start, last) + 1) / 7);
	return Array.from({ length: weeks * 7 }, (_, i) => addDays(start, i));
}

/** Query window for a month page, padded for leading/trailing days and zones. */
export function monthQueryRange(month: string) {
	const from = keyToUtc(`${month}-01`) - 8 * DAY_MS;
	const to = keyToUtc(`${shiftMonth(month, 1)}-01`) + 8 * DAY_MS;
	return { from: new Date(from), to: new Date(to) };
}

export const dayKeyIn = (iso: string | number, timeZone: string) =>
	format(
		new TZDate(typeof iso === "string" ? Date.parse(iso) : iso, timeZone),
		"yyyy-MM-dd",
	);

export const timeIn = (iso: string, timeZone: string) =>
	format(new TZDate(iso, timeZone), "HH:mm");

/** The day keys an entry covers, in the given zone. */
export function entryDayKeys(
	entry: Pick<CalendarEntry, "allDay" | "startsAt" | "endsAt">,
	timeZone: string,
) {
	const first = entry.allDay
		? entry.startsAt.slice(0, 10)
		: dayKeyIn(entry.startsAt, timeZone);
	// A timed event ending exactly at midnight doesn't spill into that day.
	const endMs = Math.max(
		Date.parse(entry.startsAt),
		Date.parse(entry.endsAt) - 1,
	);
	const last = entry.allDay
		? entry.endsAt.slice(0, 10)
		: dayKeyIn(endMs, timeZone);
	const span = Math.max(0, dayDiff(first, last));
	return Array.from({ length: span + 1 }, (_, i) => addDays(first, i));
}

/** Local date + time in `timeZone` → ISO instant. */
export function zonedToIso(key: string, time: string, timeZone: string) {
	const [year, month, day] = key.split("-").map(Number);
	const [hours, minutes] = time.split(":").map(Number);
	const instant = TZDate.tz(timeZone, year, month - 1, day, hours, minutes);
	// TZDate#toISOString keeps the zone offset; the server expects plain UTC.
	return new Date(instant.getTime()).toISOString();
}

export const allDayIso = (key: string) => `${key}T00:00:00.000Z`;
