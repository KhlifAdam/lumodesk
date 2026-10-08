"use server";

import { type ActionResult, failFromZod, ok } from "@/lib/action-result";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { searchClients } from "./queries";
import { searchQuerySchema } from "./schemas";

const PICKER_LIMIT = 8;

/** The photographer's own clients matching `q`, for pickers. */
export async function findMyClients(input: unknown): Promise<
	ActionResult<
		{
			id: string;
			name: string;
			email: string;
			phone: string;
			image: string | null;
		}[]
	>
> {
	const { photographerId } = await requirePhotographer();
	const parsed = searchQuerySchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	return ok(await searchClients(photographerId, parsed.data, PICKER_LIMIT));
}
