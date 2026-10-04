import { z } from "zod";
import { idSchema, optionalText } from "@/services/shared/schemas";

export const CLIENT_PAGE_SIZE = 20;

export const searchQuerySchema = z.string().trim().max(100).catch("");

export const listClientsSchema = z.object({
	page: z.coerce.number().int().min(1).catch(1),
	q: searchQuerySchema,
});

export const clientNotesSchema = z.object({ notes: optionalText(5000) });

export const updateClientNotesSchema = clientNotesSchema.extend({
	clientId: idSchema,
});

export type ListClientsParams = z.infer<typeof listClientsSchema>;
export type ClientNotesValues = z.infer<typeof clientNotesSchema>;
