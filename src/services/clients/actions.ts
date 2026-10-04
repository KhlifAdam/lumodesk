"use server";

import { type ActionResult, fail, failFromZod, ok } from "@/lib/action-result";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { db } from "@/lib/db";
import { revalidateClientWork } from "@/services/projects/revalidate";
import { sharesProjectWith } from "./queries";
import { updateClientNotesSchema } from "./schemas";

/** Saves the photographer's private profile, created on first save. */
export async function updateClientNotes(input: unknown): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = updateClientNotesSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const { clientId, notes } = parsed.data;
	const client = await db.user.findFirst({
		where: { id: clientId, ...sharesProjectWith(photographerId) },
		select: { id: true },
	});
	if (!client) return fail("notFound");

	const data = { notes: notes || null };
	await db.clientProfile.upsert({
		where: { photographerId_clientId: { photographerId, clientId } },
		create: { photographerId, clientId, ...data },
		update: data,
	});

	revalidateClientWork();
	return ok();
}
