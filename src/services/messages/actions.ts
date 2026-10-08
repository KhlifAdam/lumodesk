"use server";

import { type ActionResult, fail, failFromZod, ok } from "@/lib/action-result";
import { requireClient } from "@/lib/auth/require-client";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { db } from "@/lib/db";
import { resolveMailLocale } from "@/lib/mail/mail-copy";
import { sendNewMessageEmail } from "@/lib/mail/send-client-notices";
import { realEmail } from "@/lib/phone";
import { sendNewMessageSms } from "@/lib/sms/send-client-sms";
import { searchClients } from "@/services/clients/queries";
import { CLIENT_SEARCH_LIMIT, PREVIEW_LENGTH } from "./constants";
import { canConverse } from "./queries";
import {
	markReadSchema,
	searchClientsSchema,
	sendMessageSchema,
} from "./schemas";
import type { ChatMessage } from "./types";
import {
	type MessageRole,
	otherRole,
	ownConversations,
	pairWith,
	unreadField,
	type Viewer,
} from "./viewer";

async function resolveViewer(role: MessageRole): Promise<Viewer> {
	if (role === "photographer")
		return { id: (await requirePhotographer()).photographerId, role };
	return { id: (await requireClient()).clientId, role };
}

/** The conversation to write in; a first message creates it, if the pair may talk. */
async function resolveConversation(
	viewer: Viewer,
	conversationId: string | null,
	partnerId: string | null,
) {
	if (conversationId) {
		const own = await db.conversation.findFirst({
			where: { id: conversationId, ...ownConversations(viewer) },
			select: { id: true },
		});
		return own?.id ?? null;
	}
	if (!partnerId) return null;
	const pair = pairWith(viewer, partnerId);
	const existing = await db.conversation.findUnique({
		where: { photographerId_clientId: pair },
		select: { id: true },
	});
	if (existing) return existing.id;
	if (!(await canConverse(pair.photographerId, pair.clientId))) return null;
	const created = await db.conversation.upsert({
		where: { photographerId_clientId: pair },
		create: pair,
		update: {},
		select: { id: true },
	});
	return created.id;
}

const previewOf = (body: string) =>
	body.replace(/\s+/g, " ").slice(0, PREVIEW_LENGTH);

export async function sendMessage(
	input: unknown,
): Promise<ActionResult<{ conversationId: string; message: ChatMessage }>> {
	const parsed = sendMessageSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	const { as, conversationId, partnerId, body } = parsed.data;
	const viewer = await resolveViewer(as);

	const id = await resolveConversation(viewer, conversationId, partnerId);
	if (!id) return fail("notFound");

	const { message, conversation } = await db.$transaction(async (tx) => {
		const created = await tx.message.create({
			data: { conversationId: id, senderId: viewer.id, body },
		});
		// Writing means the sender has read everything so far.
		const updated = await tx.conversation.update({
			where: { id },
			data: {
				lastMessageAt: created.createdAt,
				lastMessagePreview: previewOf(body),
				lastSenderId: viewer.id,
				[unreadField(otherRole(as))]: { increment: 1 },
				[unreadField(as)]: 0,
			},
			select: {
				photographerUnread: true,
				clientUnread: true,
				photographer: {
					select: {
						name: true,
						email: true,
						phoneNumber: true,
						locale: true,
						studio: { select: { name: true } },
					},
				},
				client: {
					select: { name: true, email: true, phoneNumber: true, locale: true },
				},
			},
		});
		return { message: created, conversation: updated };
	});

	// Only the first unread message emails, so a burst doesn't flood the inbox.
	const recipient = as === "photographer" ? "client" : "photographer";
	if (conversation[unreadField(recipient)] === 1) {
		const sender =
			as === "photographer"
				? (conversation.photographer.studio?.name ??
					conversation.photographer.name)
				: conversation.client.name;
		const to = conversation[recipient];
		const path =
			recipient === "client"
				? `/portal/messages?c=${id}`
				: `/dashboard/messages?c=${id}`;
		const locale = resolveMailLocale(to.locale);
		// Phone-only recipients have no real email: text them instead.
		const notice = realEmail(to.email)
			? sendNewMessageEmail({
					to: to.email,
					locale,
					sender,
					preview: previewOf(body),
					path,
				})
			: to.phoneNumber
				? sendNewMessageSms({ to: to.phoneNumber, locale, sender, path })
				: Promise.resolve();
		notice.catch((error) =>
			console.error("Failed to notify of a new message:", error),
		);
	}

	return ok({
		conversationId: id,
		message: {
			id: message.id,
			senderId: message.senderId,
			body: message.body,
			createdAt: message.createdAt.toISOString(),
		},
	});
}

/** Clears the viewer's unread count for a conversation they have open. */
export async function markConversationRead(
	input: unknown,
): Promise<ActionResult> {
	const parsed = markReadSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	const viewer = await resolveViewer(parsed.data.as);

	await db.conversation.updateMany({
		where: { id: parsed.data.conversationId, ...ownConversations(viewer) },
		data: { [unreadField(viewer.role)]: 0 },
	});
	return ok();
}

/** Photographer picks a client to write to. */
export async function findClientsToMessage(
	input: unknown,
): Promise<
	ActionResult<
		{ id: string; name: string; email: string; image: string | null }[]
	>
> {
	const { photographerId } = await requirePhotographer();
	const parsed = searchClientsSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	return ok(
		await searchClients(photographerId, parsed.data, CLIENT_SEARCH_LIMIT),
	);
}
