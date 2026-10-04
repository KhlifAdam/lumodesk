import { z } from "zod";
import { searchQuerySchema } from "@/services/clients/schemas";
import {
	idSchema,
	optionalEmail,
	optionalText,
	requiredText,
} from "@/services/shared/schemas";
import { PROJECT_STAGES } from "./stages";

export const PROJECT_PAGE_SIZE = 20;

export const stageSchema = z.enum(PROJECT_STAGES);

/** `<input type="date">` value, or empty. */
const dateInput = z
	.string()
	.trim()
	.refine((v) => v === "" || !Number.isNaN(Date.parse(v)), "invalidDate");

export const projectSchema = z.object({
	title: requiredText(120),
	description: optionalText(2000),
	location: optionalText(160),
	eventDate: dateInput,
});

/** Creating a project can invite its client at the same time. */
export const createProjectSchema = projectSchema.extend({
	clientEmail: optionalEmail,
});

export const updateProjectSchema = projectSchema.extend({ id: idSchema });

export const updateStageSchema = z.object({ id: idSchema, stage: stageSchema });

export const inviteClientSchema = z.object({
	projectId: idSchema,
	email: z.email("invalidEmail"),
});

export const listProjectsSchema = z.object({
	page: z.coerce.number().int().min(1).catch(1),
	q: searchQuerySchema,
	stage: stageSchema.optional().catch(undefined),
});

export type ProjectValues = z.infer<typeof projectSchema>;
export type CreateProjectValues = z.infer<typeof createProjectSchema>;
export type ListProjectsParams = z.infer<typeof listProjectsSchema>;
