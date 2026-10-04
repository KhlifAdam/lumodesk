"use server";

import { type ActionResult, fail, failFromZod, ok } from "@/lib/action-result";
import { requireClient } from "@/lib/auth/require-client";
import { db } from "@/lib/db";
import { revalidateClientWork } from "@/services/projects/revalidate";
import { idSchema } from "@/services/shared/schemas";

/**
 * Answers an invitation sent to the signed-in address. A verified email is
 * required, so nobody can claim invitations by registering someone's address.
 */
async function answerInvitation(
	input: unknown,
	accept: boolean,
): Promise<ActionResult> {
	const { session, clientId } = await requireClient();
	const parsed = idSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	if (!session.user.emailVerified) return fail("emailNotVerified");

	const { count } = await db.project.updateMany({
		where: {
			id: parsed.data,
			inviteEmail: session.user.email.toLowerCase(),
			inviteStatus: "PENDING",
		},
		data: accept
			? { clientId, inviteStatus: "ACCEPTED" }
			: { inviteStatus: "DECLINED" },
	});
	if (count === 0) return fail("invitationNotFound");

	revalidateClientWork();
	return ok();
}

export async function acceptInvitation(input: unknown) {
	return answerInvitation(input, true);
}

export async function declineInvitation(input: unknown) {
	return answerInvitation(input, false);
}
