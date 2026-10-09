"use server";

import { type ActionResult, fail, failFromZod, ok } from "@/lib/action-result";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { db } from "@/lib/db";
import { revalidateClientWork } from "@/services/projects/revalidate";
import { lockGallery } from "@/services/shared/lock-rows";
import { pageSkip } from "@/services/shared/pagination";
import { planPageReorder } from "@/services/shared/reorder-page";
import { deleteGalleryFiles } from "./cleanup";
import { GALLERY_PAGE_SIZE } from "./constants";
import { GALLERY_ITEM_ORDER } from "./queries";
import { galleryItemIdsSchema, reorderGalleryItemsSchema } from "./schemas";

function ownsGallery(photographerId: string, galleryId: string) {
	return db.gallery.findFirst({
		where: { id: galleryId, photographerId },
		select: { id: true },
	});
}

export async function deleteGalleryItems(
	input: unknown,
): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = galleryItemIdsSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	const { galleryId, ids } = parsed.data;

	const where = { id: { in: ids }, galleryId, photographerId };
	const files = await db.galleryItem.findMany({
		where,
		select: { key: true, previewKey: true },
	});
	if (files.length === 0) return fail("notFound");

	await db.galleryItem.deleteMany({ where });
	await deleteGalleryFiles(files);
	revalidateClientWork();
	return ok();
}

export async function reorderGalleryItems(
	input: unknown,
): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = reorderGalleryItemsSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	const { galleryId, page, ids } = parsed.data;
	if (!(await ownsGallery(photographerId, galleryId))) return fail("notFound");

	const reordered = await db.$transaction(async (tx) => {
		await lockGallery(tx, galleryId);
		const current = await tx.galleryItem.findMany({
			where: { galleryId },
			orderBy: GALLERY_ITEM_ORDER,
			skip: pageSkip(page, GALLERY_PAGE_SIZE),
			take: GALLERY_PAGE_SIZE,
			select: { id: true, position: true },
		});
		const next = planPageReorder(current, ids);
		if (!next) return false;
		for (const { id, position } of next) {
			await tx.galleryItem.update({ where: { id }, data: { position } });
		}
		return true;
	});
	if (!reordered) return fail("staleOrder");

	revalidateClientWork();
	return ok();
}
