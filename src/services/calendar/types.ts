import type { CalendarEventType } from "./constants";

/**
 * One item on the calendar: an event, or a project's date (read-only,
 * shown for projects that have no linked event yet).
 * All-day items carry UTC midnights of their first and last day.
 */
export interface CalendarEntry {
	id: string;
	kind: "event" | "project";
	type: CalendarEventType | "PROJECT";
	title: string;
	allDay: boolean;
	startsAt: string;
	endsAt: string;
	location: string;
	notes: string;
	projectId: string | null;
	projectTitle: string | null;
}

export interface ProjectOption {
	id: string;
	title: string;
}
