"use server";

import { type ActionResult, fail, failFromZod, ok } from "@/lib/action-result";
import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";
import { revalidateClientWork } from "@/services/projects/revalidate";
import { idSchema } from "@/services/shared/schemas";
import { getItemAccess } from "./access";
import { addCommentSchema } from "./schemas";
import type { GalleryComment } from "./types";

const COMMENTS_LIMIT = 200;

/** The thread on one photo, for its photographer or the project's client. */
export async function fetchComments(
	input: unknown,
): Promise<ActionResult<GalleryComment[]>> {
	const session = await requireUser();
	const parsed = idSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	const userId = session.user.id;
	if (!(await getItemAccess(parsed.data, userId))) return fail("notFound");

	const rows = await db.galleryComment.findMany({
		where: { galleryItemId: parsed.data },
		orderBy: { createdAt: "asc" },
		take: COMMENTS_LIMIT,
		select: {
			id: true,
			body: true,
			createdAt: true,
			authorId: true,
			author: { select: { name: true } },
			item: { select: { photographerId: true } },
		},
	});

	return ok(
		rows.map((row) => ({
			id: row.id,
			body: row.body,
			authorName: row.author.name,
			byPhotographer: row.authorId === row.item.photographerId,
			mine: row.authorId === userId,
			createdAt: row.createdAt.toISOString(),
		})),
	);
}

export async function addComment(input: unknown): Promise<ActionResult> {
	const session = await requireUser();
	const parsed = addCommentSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	const { itemId, body } = parsed.data;
	if (!(await getItemAccess(itemId, session.user.id))) return fail("notFound");

	await db.galleryComment.create({
		data: { galleryItemId: itemId, authorId: session.user.id, body },
	});
	revalidateClientWork();
	return ok();
}
