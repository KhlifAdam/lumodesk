"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import { useErrorMessage } from "@/hooks/use-error-message";
import {
	createCalendarEvent,
	deleteCalendarEvent,
	updateCalendarEvent,
} from "@/services/calendar/actions";
import {
	entryToValues,
	newEventValues,
	valuesToPayload,
} from "@/services/calendar/form-values";
import type { CalendarEntry } from "@/services/calendar/types";

export type Availability = "AVAILABLE" | "UNAVAILABLE";

/** A one-day availability marker on exactly `day` (what the quick toggle edits). */
export function findDayMarker(day: string, entries: CalendarEntry[]) {
	return entries.find(
		(entry) =>
			entry.kind === "event" &&
			entry.allDay &&
			(entry.type === "AVAILABLE" || entry.type === "UNAVAILABLE") &&
			entry.startsAt.startsWith(day) &&
			entry.endsAt.startsWith(day),
	);
}

/**
 * Sets a day to available / unavailable, or clears it (`null`), reusing the
 * day's existing marker instead of stacking new ones.
 */
export function useDayAvailability(timeZone: string) {
	const t = useTranslations("Calendar.day");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const [isPending, startTransition] = useTransition();

	function setAvailability(
		day: string,
		entries: CalendarEntry[],
		next: Availability | null,
	) {
		const marker = findDayMarker(day, entries);
		const apply = () => {
			if (!next) return marker ? deleteCalendarEvent(marker.id) : null;
			if (!marker)
				return createCalendarEvent(
					valuesToPayload(newEventValues(day, next), timeZone),
				);
			const event = valuesToPayload(entryToValues(marker, timeZone), timeZone);
			return updateCalendarEvent({
				id: marker.id,
				event: { ...event, type: next },
			});
		};
		startTransition(async () => {
			const result = await apply();
			if (!result) return;
			if (!result.ok) return void toast.error(errorMessage(result.error));
			toast.success(t("availabilityUpdated"));
			router.refresh();
		});
	}

	return { isPending, setAvailability };
}
