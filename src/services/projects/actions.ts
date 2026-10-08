"use server";

import { type ActionResult, fail, failFromZod, ok } from "@/lib/action-result";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { db } from "@/lib/db";
import { toE164 } from "@/lib/phone";
import { deleteGalleryFiles } from "@/services/galleries/cleanup";
import { emptyToNull, idSchema } from "@/services/shared/schemas";
import { inviteToProject } from "./invitations";
import { revalidateClientWork } from "./revalidate";
import {
	createProjectSchema,
	type ProjectValues,
	updatePaymentSchema,
	updateProjectSchema,
	updateStageSchema,
} from "./schemas";
import { PAYMENT_GATED_STAGE } from "./visibility";

const toDate = (value: string) => (value ? new Date(value) : null);

function toData(values: ProjectValues) {
	return {
		title: values.title,
		serviceType: values.serviceType,
		mediaType: values.mediaType,
		description: emptyToNull(values.description),
		clientPhone: emptyToNull(toE164(values.clientPhone) ?? values.clientPhone),
		contactName: emptyToNull(values.contactName),
		contactPhone: emptyToNull(values.contactPhone),
		clientNotes: emptyToNull(values.clientNotes),
		eventDate: toDate(values.eventDate),
		startTime: emptyToNull(values.startTime),
		endTime: emptyToNull(values.endTime),
		location: emptyToNull(values.location),
		locationType: values.locationType || null,
		deliveryDeadline: toDate(values.deliveryDeadline),
		equipment: emptyToNull(values.equipment),
		price: values.price,
		advance: values.advance ?? 0,
		paymentStatus: values.paymentStatus,
		financialNotes: emptyToNull(values.financialNotes),
		team: emptyToNull(values.team),
		internalNotes: emptyToNull(values.internalNotes),
	};
}

/** Creates the project, then invites the client when an email is given. */
export async function createProject(
	input: unknown,
): Promise<ActionResult<{ id: string; sent: boolean }>> {
	const { session, photographerId } = await requirePhotographer();
	const parsed = createProjectSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const { clientEmail, invitePhone, ...values } = parsed.data;
	const photographer = { id: photographerId, email: session.user.email };
	if (clientEmail.toLowerCase() === photographer.email.toLowerCase())
		return fail("inviteSelf");

	const project = await db.project.create({
		data: { photographerId, ...toData(values) },
		select: { id: true },
	});
	// With no email, a ticked box texts the invitation to the client's phone.
	const contact = clientEmail || (invitePhone ? values.clientPhone : "");
	const invited = contact
		? await inviteToProject(photographer, project.id, contact)
		: ok({ sent: true });

	revalidateClientWork();
	// The project exists either way; a failed invite can be retried from it.
	return invited.ok ? ok({ ...project, sent: invited.data.sent }) : invited;
}

export async function updateProject(input: unknown): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = updateProjectSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const { id, ...values } = parsed.data;
	const { count } = await db.project.updateMany({
		where: { id, photographerId },
		data: toData(values),
	});
	if (count === 0) return fail("notFound");

	revalidateClientWork();
	return ok();
}

export async function updateProjectStage(
	input: unknown,
): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = updateStageSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const { id, stage } = parsed.data;
	// The paid check is part of the write, so it can't race with a payment edit.
	const { count } = await db.project.updateMany({
		where: {
			id,
			photographerId,
			...(stage === PAYMENT_GATED_STAGE && { paymentStatus: "PAID" as const }),
		},
		data: { stage },
	});
	if (count === 0) {
		const exists = await db.project.count({ where: { id, photographerId } });
		return fail(exists ? "unpaidProject" : "notFound");
	}

	revalidateClientWork();
	return ok();
}

export async function updateProjectPayment(
	input: unknown,
): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = updatePaymentSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const { id, paymentStatus } = parsed.data;
	const { count } = await db.project.updateMany({
		where: { id, photographerId },
		data: { paymentStatus },
	});
	if (count === 0) return fail("notFound");

	revalidateClientWork();
	return ok();
}

export async function deleteProject(input: unknown): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = idSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const files = await db.galleryItem.findMany({
		where: { photographerId, gallery: { projectId: parsed.data } },
		select: { key: true, previewKey: true },
	});
	const { count } = await db.project.deleteMany({
		where: { id: parsed.data, photographerId },
	});
	if (count === 0) return fail("notFound");

	await deleteGalleryFiles(files);
	revalidateClientWork();
	return ok();
}
