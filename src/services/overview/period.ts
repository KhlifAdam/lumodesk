import {
	addDays,
	dayDiff,
	dayKeySchema,
	shiftMonth,
	todayKey,
	zonedToIso,
} from "@/services/calendar/dates";

export const PERIODS = [
	"week",
	"month",
	"last30",
	"year",
	"all",
	"custom",
] as const;

export type PeriodKey = (typeof PERIODS)[number];

/** Longest custom range, and the longest one drawn day by day. */
const MAX_CUSTOM_DAYS = 1100;
const MAX_DAILY_BUCKETS = 62;
const ALL_TIME_CHART_MONTHS = 12;

export interface Period {
	key: PeriodKey;
	/** Instants, end exclusive; null bounds mean no limit (all time). */
	from: Date | null;
	to: Date | null;
	/** The period of the same length just before, to compare with. */
	previous: { from: Date; to: Date } | null;
	/** The chart's window, which for "all time" is the last 12 months. */
	chart: { from: Date; to: Date };
	granularity: "day" | "month";
	/** One key per chart bucket: `yyyy-MM-dd` or `yyyy-MM`. */
	buckets: string[];
	/** Day keys shown in the filter: first and last day included. */
	firstDay: string | null;
	lastDay: string | null;
}

interface PeriodInput {
	period?: string;
	from?: string;
	to?: string;
}

const dayOfWeek = (key: string) => new Date(`${key}T00:00:00Z`).getUTCDay();

/** First day of the week containing `key`. */
function startOfWeek(key: string, weekStartsOn: number) {
	const lead = (dayOfWeek(key) - weekStartsOn + 7) % 7;
	return addDays(key, -lead);
}

const monthOf = (key: string) => key.slice(0, 7);
const monthStart = (month: string) => `${month}-01`;

function dayRange(first: string, endExclusive: string) {
	const count = dayDiff(first, endExclusive);
	return Array.from({ length: Math.max(0, count) }, (_, i) =>
		addDays(first, i),
	);
}

function monthRange(firstMonth: string, lastMonth: string) {
	const keys: string[] = [];
	for (let m = firstMonth; m <= lastMonth; m = shiftMonth(m, 1)) keys.push(m);
	return keys;
}

/** Day keys [first, endExclusive) and the matching previous window. */
function windowFor(
	input: PeriodInput,
	today: string,
	weekStartsOn: number,
): {
	key: PeriodKey;
	first: string | null;
	end: string | null;
	prevFirst: string | null;
	prevEnd: string | null;
} {
	const month = monthOf(today);
	switch (input.period) {
		case "week": {
			const first = startOfWeek(today, weekStartsOn);
			return {
				key: "week",
				first,
				end: addDays(first, 7),
				prevFirst: addDays(first, -7),
				prevEnd: first,
			};
		}
		case "last30":
			return {
				key: "last30",
				first: addDays(today, -29),
				end: addDays(today, 1),
				prevFirst: addDays(today, -59),
				prevEnd: addDays(today, -29),
			};
		case "year": {
			const year = Number(today.slice(0, 4));
			return {
				key: "year",
				first: `${year}-01-01`,
				end: `${year + 1}-01-01`,
				prevFirst: `${year - 1}-01-01`,
				prevEnd: `${year}-01-01`,
			};
		}
		case "all":
			return {
				key: "all",
				first: null,
				end: null,
				prevFirst: null,
				prevEnd: null,
			};
		case "custom": {
			const a = dayKeySchema.safeParse(input.from);
			const b = dayKeySchema.safeParse(input.to);
			if (a.success && b.success) {
				const [first, last] =
					a.data <= b.data ? [a.data, b.data] : [b.data, a.data];
				const days = dayDiff(first, last) + 1;
				if (days <= MAX_CUSTOM_DAYS) {
					return {
						key: "custom",
						first,
						end: addDays(last, 1),
						prevFirst: addDays(first, -days),
						prevEnd: first,
					};
				}
			}
			break;
		}
	}
	// Anything else, including a bad custom range, is the current month.
	return {
		key: "month",
		first: monthStart(month),
		end: monthStart(shiftMonth(month, 1)),
		prevFirst: monthStart(shiftMonth(month, -1)),
		prevEnd: monthStart(month),
	};
}

/**
 * Turns the URL's period into instants in the photographer's time zone, so
 * "this week" starts when their Monday does, not the server's.
 */
export function resolvePeriod(
	input: PeriodInput,
	timeZone: string,
	weekStartsOn: number,
): Period {
	const today = todayKey(timeZone);
	const win = windowFor(input, today, weekStartsOn);
	const at = (key: string) => new Date(zonedToIso(key, "00:00", timeZone));

	// The chart window: the period itself, or the last 12 months for "all time".
	const chartFirst =
		win.first ??
		monthStart(shiftMonth(monthOf(today), -(ALL_TIME_CHART_MONTHS - 1)));
	const chartEnd = win.end ?? monthStart(shiftMonth(monthOf(today), 1));

	const spanDays = dayDiff(chartFirst, chartEnd);
	const granularity =
		win.key === "all" || win.key === "year" || spanDays > MAX_DAILY_BUCKETS
			? "month"
			: "day";
	const buckets =
		granularity === "day"
			? dayRange(chartFirst, chartEnd)
			: monthRange(monthOf(chartFirst), monthOf(addDays(chartEnd, -1)));

	return {
		key: win.key,
		from: win.first ? at(win.first) : null,
		to: win.end ? at(win.end) : null,
		previous:
			win.prevFirst && win.prevEnd
				? { from: at(win.prevFirst), to: at(win.prevEnd) }
				: null,
		chart: { from: at(chartFirst), to: at(chartEnd) },
		granularity,
		buckets,
		firstDay: win.first,
		lastDay: win.end ? addDays(win.end, -1) : null,
	};
}
