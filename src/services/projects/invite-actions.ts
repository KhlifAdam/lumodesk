"use server";

import { type ActionResult, fail, failFromZod, ok } from "@/lib/action-result";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { db } from "@/lib/db";
import { idSchema } from "@/services/shared/schemas";
import { inviteToProject } from "./invitations";
import { revalidateClientWork } from "./revalidate";
import { inviteClientSchema } from "./schemas";

/** Sends (or resends) the project invitation to an email. */
export async function inviteClient(input: unknown): Promise<ActionResult> {
	const { session, photographerId } = await requirePhotographer();
	const parsed = inviteClientSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const result = await inviteToProject(
		{ id: photographerId, email: session.user.email },
		parsed.data.projectId,
		parsed.data.email,
	);
	if (result.ok) revalidateClientWork();
	return result;
}

/** Withdraws a pending or declined invitation. */
export async function cancelInvite(input: unknown): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = idSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const { count } = await db.project.updateMany({
		where: {
			id: parsed.data,
			photographerId,
			inviteStatus: { in: ["PENDING", "DECLINED"] },
		},
		data: { inviteEmail: null, inviteStatus: null, invitedAt: null },
	});
	if (count === 0) return fail("notFound");

	revalidateClientWork();
	return ok();
}
