"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useMemo } from "react";
import { dayKeyIn, entryDayKeys } from "@/services/calendar/dates";
import type { CalendarEntry } from "@/services/calendar/types";

/** All-day items first, then by start time. */
const byStart = (a: CalendarEntry, b: CalendarEntry) =>
	Number(b.allDay) - Number(a.allDay) || a.startsAt.localeCompare(b.startsAt);

/** Entries grouped under every day key they cover. */
export function useEntriesByDay(entries: CalendarEntry[], timeZone: string) {
	return useMemo(() => {
		const map = new Map<string, CalendarEntry[]>();
		for (const entry of [...entries].sort(byStart)) {
			for (const key of entryDayKeys(entry, timeZone)) {
				const list = map.get(key);
				if (list) list.push(entry);
				else map.set(key, [entry]);
			}
		}
		return map;
	}, [entries, timeZone]);
}

/** A day's availability marker; "unavailable" wins over "available". */
export function dayAvailability(entries: CalendarEntry[]) {
	if (entries.some((entry) => entry.type === "UNAVAILABLE"))
		return "UNAVAILABLE";
	if (entries.some((entry) => entry.type === "AVAILABLE")) return "AVAILABLE";
	return null;
}

/** Display title and the time range as seen on one day. */
export function useEntryLabels(timeZone: string) {
	const t = useTranslations("Calendar");
	const format = useFormatter();
	const time = (iso: string) =>
		format.dateTime(new Date(iso), {
			hour: "2-digit",
			minute: "2-digit",
			timeZone,
		});

	return {
		title: (entry: CalendarEntry) => entry.title || t(`types.${entry.type}`),
		/** Short start time for grid chips, empty for all-day items. */
		startTime: (entry: CalendarEntry, day: string) =>
			!entry.allDay && dayKeyIn(entry.startsAt, timeZone) === day
				? time(entry.startsAt)
				: "",
		range: (entry: CalendarEntry, day: string) => {
			if (entry.allDay) return t("day.allDay");
			const startsToday = dayKeyIn(entry.startsAt, timeZone) === day;
			const endsToday = dayKeyIn(entry.endsAt, timeZone) === day;
			if (startsToday && endsToday)
				return `${time(entry.startsAt)} – ${time(entry.endsAt)}`;
			if (startsToday) return `${time(entry.startsAt)} →`;
			if (endsToday) return `→ ${time(entry.endsAt)}`;
			return t("day.allDay");
		},
	};
}
