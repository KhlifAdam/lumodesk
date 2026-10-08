"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, fail, failFromZod, ok } from "@/lib/action-result";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { db } from "@/lib/db";
import { emptyToNull, idSchema } from "@/services/shared/schemas";
import { BUSY_TYPES, type CalendarEventType, DAY_MS } from "./constants";
import {
	type EventPayload,
	eventPayloadSchema,
	updateEventSchema,
} from "./schemas";

type SaveResult = ActionResult<{ id: string; conflicts: number }>;

const isBusy = (type: CalendarEventType) =>
	(BUSY_TYPES as readonly CalendarEventType[]).includes(type);

function toData(event: EventPayload) {
	return {
		type: event.type,
		title: event.title,
		allDay: event.allDay,
		startsAt: new Date(event.startsAt),
		endsAt: new Date(event.endsAt),
		location: emptyToNull(event.location),
		notes: emptyToNull(event.notes),
		projectId: emptyToNull(event.projectId),
	};
}

async function ownsProject(photographerId: string, projectId: string) {
	if (!projectId) return true;
	const project = await db.project.findFirst({
		where: { id: projectId, photographerId },
		select: { id: true },
	});
	return Boolean(project);
}

/** Busy events overlapping this one; all-day events cover their whole last day. */
async function countConflicts(
	photographerId: string,
	event: EventPayload,
	excludeId: string,
) {
	if (!isBusy(event.type)) return 0;
	const start = new Date(event.startsAt);
	const end = new Date(Date.parse(event.endsAt) + (event.allDay ? DAY_MS : 0));
	return db.calendarEvent.count({
		where: {
			photographerId,
			id: { not: excludeId },
			type: { in: [...BUSY_TYPES] },
			startsAt: { lt: end },
			OR: [
				{ allDay: false, endsAt: { gt: start } },
				{ allDay: true, endsAt: { gt: new Date(start.getTime() - DAY_MS) } },
			],
		},
	});
}

/** The overview and the calendar both read events. */
function revalidateCalendar() {
	revalidatePath("/dashboard", "layout");
}

export async function createCalendarEvent(input: unknown): Promise<SaveResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = eventPayloadSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	if (!(await ownsProject(photographerId, parsed.data.projectId)))
		return fail("notFound");

	const { id } = await db.calendarEvent.create({
		data: { photographerId, ...toData(parsed.data) },
		select: { id: true },
	});
	const conflicts = await countConflicts(photographerId, parsed.data, id);
	revalidateCalendar();
	return ok({ id, conflicts });
}

export async function updateCalendarEvent(input: unknown): Promise<SaveResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = updateEventSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const { id, event } = parsed.data;
	if (!(await ownsProject(photographerId, event.projectId)))
		return fail("notFound");
	const { count } = await db.calendarEvent.updateMany({
		where: { id, photographerId },
		data: toData(event),
	});
	if (count === 0) return fail("notFound");

	const conflicts = await countConflicts(photographerId, event, id);
	revalidateCalendar();
	return ok({ id, conflicts });
}

export async function deleteCalendarEvent(
	input: unknown,
): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = idSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const { count } = await db.calendarEvent.deleteMany({
		where: { id: parsed.data, photographerId },
	});
	if (count === 0) return fail("notFound");

	revalidateCalendar();
	return ok();
}
