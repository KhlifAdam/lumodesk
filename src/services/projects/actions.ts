"use server";

import { type ActionResult, fail, failFromZod, ok } from "@/lib/action-result";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { db } from "@/lib/db";
import { deleteGalleryFiles } from "@/services/galleries/cleanup";
import { emptyToNull, idSchema } from "@/services/shared/schemas";
import { inviteToProject } from "./invitations";
import { revalidateClientWork } from "./revalidate";
import {
	createProjectSchema,
	type ProjectValues,
	updateProjectSchema,
	updateStageSchema,
} from "./schemas";

function toData(values: ProjectValues) {
	return {
		title: values.title,
		description: emptyToNull(values.description),
		location: emptyToNull(values.location),
		eventDate: values.eventDate ? new Date(values.eventDate) : null,
	};
}

/** Creates the project, then invites the client when an email is given. */
export async function createProject(
	input: unknown,
): Promise<ActionResult<{ id: string }>> {
	const { session, photographerId } = await requirePhotographer();
	const parsed = createProjectSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const { clientEmail, ...values } = parsed.data;
	const photographer = { id: photographerId, email: session.user.email };
	if (clientEmail.toLowerCase() === photographer.email.toLowerCase())
		return fail("inviteSelf");

	const project = await db.project.create({
		data: { photographerId, ...toData(values) },
		select: { id: true },
	});
	const invited = clientEmail
		? await inviteToProject(photographer, project.id, clientEmail)
		: ok();

	revalidateClientWork();
	// The project exists either way; a failed invite can be retried from it.
	return invited.ok ? ok(project) : invited;
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
	const { count } = await db.project.updateMany({
		where: { id, photographerId },
		data: { stage },
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
