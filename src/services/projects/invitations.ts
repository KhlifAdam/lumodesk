import "server-only";

import { z } from "zod";
import { type ActionResult, fail, ok } from "@/lib/action-result";
import { db } from "@/lib/db";
import { resolveMailLocale } from "@/lib/mail/mail-copy";
import { getRequestLocale } from "@/lib/mail/request-locale";
import { sendProjectInvitationEmail } from "@/lib/mail/send-client-notices";
import { toE164 } from "@/lib/phone";
import { sendProjectInvitationSms } from "@/lib/sms/send-client-sms";

export type InviteContact =
	| { kind: "email"; email: string }
	| { kind: "phone"; phone: string };

/** An email or a phone number, as typed by the photographer. */
export function parseContact(raw: string): InviteContact | null {
	const value = raw.trim();
	if (value.includes("@"))
		return z.email().safeParse(value).success
			? { kind: "email", email: value.toLowerCase() }
			: null;
	const phone = toE164(value);
	return phone ? { kind: "phone", phone } : null;
}

/**
 * Invites an email or a phone number to the photographer's project: the
 * project waits as PENDING until that person accepts it from their portal.
 * Phone invitations are texted, for clients who have no email.
 */
export async function inviteToProject(
	photographer: { id: string; email: string },
	projectId: string,
	rawContact: string,
): Promise<ActionResult<{ sent: boolean }>> {
	const contact = parseContact(rawContact);
	if (!contact) return fail("invalidContact");
	if (
		contact.kind === "email" &&
		contact.email === photographer.email.toLowerCase()
	)
		return fail("inviteSelf");

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
			inviteEmail: contact.kind === "email" ? contact.email : null,
			invitePhone: contact.kind === "phone" ? contact.phone : null,
			inviteStatus: "PENDING",
			invitedAt: new Date(),
			clientId: null,
		},
	});

	const studio = project.photographer.studio?.name ?? project.photographer.name;
	// The invitation is saved either way; `sent` tells the caller whether the
	// message left, so a delivery failure is never silent.
	try {
		if (contact.kind === "email") {
			const account = await db.user.findFirst({
				where: { email: { equals: contact.email, mode: "insensitive" } },
				select: { locale: true },
			});
			await sendProjectInvitationEmail({
				to: contact.email,
				// Their saved language; a new address gets the inviter's.
				locale: resolveMailLocale(account?.locale, await getRequestLocale()),
				studio,
				project: project.title,
				eventDate: project.eventDate,
				hasAccount: Boolean(account),
			});
		} else {
			const account = await db.user.findUnique({
				where: { phoneNumber: contact.phone },
				select: { locale: true },
			});
			await sendProjectInvitationSms({
				to: contact.phone,
				locale: resolveMailLocale(account?.locale, await getRequestLocale()),
				studio,
				project: project.title,
			});
		}
		return ok({ sent: true });
	} catch (error) {
		console.error("Failed to send project invitation:", error);
		return ok({ sent: false });
	}
}
