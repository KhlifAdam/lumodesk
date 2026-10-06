import "server-only";

import { type ActionResult, fail, ok } from "@/lib/action-result";
import { db } from "@/lib/db";
import { resolveMailLocale } from "@/lib/mail/mail-copy";
import { getRequestLocale } from "@/lib/mail/request-locale";
import { sendProjectInvitationEmail } from "@/lib/mail/send-client-notices";

/**
 * Invites `email` to the photographer's project: the project waits as
 * PENDING until that person accepts it from their portal.
 */
export async function inviteToProject(
	photographer: { id: string; email: string },
	projectId: string,
	rawEmail: string,
): Promise<ActionResult<{ emailSent: boolean }>> {
	const email = rawEmail.trim().toLowerCase();
	if (email === photographer.email.toLowerCase()) return fail("inviteSelf");

	const project = await db.project.findFirst({
		where: { id: projectId, photographerId: photographer.id },
		select: {
			title: true,
			eventDate: true,
			inviteStatus: true,
			photographer: {
				select: { name: true, studio: { select: { name: true } } },
			},
		},
	});
	if (!project) return fail("notFound");
	if (project.inviteStatus === "ACCEPTED") return fail("alreadyAccepted");

	await db.project.update({
		where: { id: projectId },
		data: {
			inviteEmail: email,
			inviteStatus: "PENDING",
			invitedAt: new Date(),
			clientId: null,
		},
	});

	const account = await db.user.findFirst({
		where: { email: { equals: email, mode: "insensitive" } },
		select: { id: true, locale: true },
	});
	// The invitation is saved either way; `emailSent` tells the caller whether
	// the message left, so a mail failure is never silent.
	try {
		await sendProjectInvitationEmail({
			to: email,
			// Their saved language; a new address gets the inviter's.
			locale: resolveMailLocale(account?.locale, await getRequestLocale()),
			studio: project.photographer.studio?.name ?? project.photographer.name,
			project: project.title,
			eventDate: project.eventDate,
			hasAccount: Boolean(account),
		});
		return ok({ emailSent: true });
	} catch (error) {
		console.error("Failed to send project invitation email:", error);
		return ok({ emailSent: false });
	}
}
