import { z } from "zod";
import { idSchema, optionalText } from "@/services/shared/schemas";
import { DAY_MS, EVENT_TYPES, MAX_EVENT_DAYS } from "./constants";
import { dayDiff, dayKeySchema, monthSchema, timeSchema } from "./dates";

export const eventTypeSchema = z.enum(EVENT_TYPES);

/** What the event dialog edits; dates and times are local to the photographer. */
export const eventFormSchema = z
	.object({
		type: eventTypeSchema,
		title: optionalText(120),
		allDay: z.boolean(),
		startDate: dayKeySchema,
		startTime: timeSchema.or(z.literal("")),
		endDate: dayKeySchema,
		endTime: timeSchema.or(z.literal("")),
		location: optionalText(160),
		projectId: z.string(),
		notes: optionalText(2000),
	})
	.superRefine((v, ctx) => {
		if (!v.allDay) {
			if (!v.startTime)
				ctx.addIssue({
					code: "custom",
					path: ["startTime"],
					message: "required",
				});
			if (!v.endTime)
				ctx.addIssue({
					code: "custom",
					path: ["endTime"],
					message: "required",
				});
		}
		const start = `${v.startDate}T${v.allDay ? "" : v.startTime}`;
		const end = `${v.endDate}T${v.allDay ? "" : v.endTime}`;
		if (v.allDay ? end < start : end <= start)
			ctx.addIssue({
				code: "custom",
				path: ["endDate"],
				message: "endBeforeStart",
			});
		else if (dayDiff(v.startDate, v.endDate) > MAX_EVENT_DAYS)
			ctx.addIssue({
				code: "custom",
				path: ["endDate"],
				message: "rangeTooLong",
			});
	});

/** What the server stores: instants (UTC midnights for all-day events). */
export const eventPayloadSchema = z
	.object({
		type: eventTypeSchema,
		title: optionalText(120),
		allDay: z.boolean(),
		startsAt: z.iso.datetime(),
		endsAt: z.iso.datetime(),
		location: optionalText(160),
		projectId: idSchema.or(z.literal("")),
		notes: optionalText(2000),
	})
	.refine((v) => {
		const span = Date.parse(v.endsAt) - Date.parse(v.startsAt);
		return (v.allDay ? span >= 0 : span > 0) && span <= MAX_EVENT_DAYS * DAY_MS;
	}, "endBeforeStart");

export const updateEventSchema = z.object({
	id: idSchema,
	event: eventPayloadSchema,
});

export const calendarParamsSchema = z.object({
	month: monthSchema.optional().catch(undefined),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
export type EventPayload = z.infer<typeof eventPayloadSchema>;
