/** Mirrors the `calendar_event_type` enum. */
export const EVENT_TYPES = [
	"SHOOT",
	"MEETING",
	"AVAILABLE",
	"UNAVAILABLE",
	"OTHER",
] as const;

export type CalendarEventType = (typeof EVENT_TYPES)[number];

/** Types that occupy the photographer; two of them overlapping is a conflict. */
export const BUSY_TYPES = [
	"SHOOT",
	"MEETING",
	"UNAVAILABLE",
] as const satisfies CalendarEventType[];

/** Longest event span, in days. */
export const MAX_EVENT_DAYS = 366;

export const DAY_MS = 24 * 60 * 60 * 1000;
