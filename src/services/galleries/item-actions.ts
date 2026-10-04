"use server";

import { randomUUID } from "node:crypto";
import { type ActionResult, fail, failFromZod, ok } from "@/lib/action-result";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { db } from "@/lib/db";
import { isUniqueViolation } from "@/lib/prisma-errors";
import {
	getPrivateUploadUrl,
	headPrivateObject,
} from "@/lib/storage/r2-private";
import { revalidateClientWork } from "@/services/projects/revalidate";
import { lockGallery } from "@/services/shared/lock-rows";
import { pageSkip } from "@/services/shared/pagination";
import { planPageReorder } from "@/services/shared/reorder-page";
import { deleteGalleryFiles } from "./cleanup";
import {
	GALLERY_EXTENSION_BY_MIME,
	GALLERY_ITEMS_LIMIT,
	GALLERY_PAGE_SIZE,
	galleryKeyPrefix,
	PREVIEW_MIME_TYPE,
} from "./constants";
import { GALLERY_ITEM_ORDER } from "./queries";
import {
	confirmGalleryUploadSchema,
	galleryItemIdsSchema,
	reorderGalleryItemsSchema,
	requestGalleryUploadSchema,
} from "./schemas";

function ownsGallery(photographerId: string, galleryId: string) {
	return db.gallery.findFirst({
		where: { id: galleryId, photographerId },
		select: { id: true },
	});
}

/** Two presigned PUTs: the original and its browser-made preview. */
export async function requestGalleryUpload(input: unknown): Promise<
	ActionResult<{
		key: string;
		previewKey: string;
		uploadUrl: string;
		previewUploadUrl: string;
	}>
> {
	const { photographerId } = await requirePhotographer();
	const parsed = requestGalleryUploadSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	const { galleryId, mimeType, size, previewSize } = parsed.data;
	if (!(await ownsGallery(photographerId, galleryId))) return fail("notFound");

	const base = `${galleryKeyPrefix(photographerId, galleryId)}${randomUUID()}`;
	const key = `${base}.${GALLERY_EXTENSION_BY_MIME[mimeType]}`;
	const previewKey = `${base}-preview.jpg`;
	const [uploadUrl, previewUploadUrl] = await Promise.all([
		getPrivateUploadUrl(key, mimeType, size),
		getPrivateUploadUrl(previewKey, PREVIEW_MIME_TYPE, previewSize),
	]);
	return ok({ key, previewKey, uploadUrl, previewUploadUrl });
}

export async function confirmGalleryUpload(
	input: unknown,
): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = confirmGalleryUploadSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	const { galleryId, key, previewKey, size, previewSize, ...meta } =
		parsed.data;

	// Keys are namespaced by owner and gallery; never accept anything else.
	const prefix = galleryKeyPrefix(photographerId, galleryId);
	if (!key.startsWith(prefix) || !previewKey.startsWith(prefix))
		return fail("invalidInput");
	if (!(await ownsGallery(photographerId, galleryId))) return fail("notFound");

	const [original, preview] = await Promise.all([
		headPrivateObject(key),
		headPrivateObject(previewKey),
	]);
	if (original?.size !== size || preview?.size !== previewSize)
		return fail("uploadMissing");

	const result = await db
		.$transaction(async (tx) => {
			await lockGallery(tx, galleryId);
			const stats = await tx.galleryItem.aggregate({
				where: { galleryId },
				_max: { position: true },
				_count: true,
			});
			if (stats._count >= GALLERY_ITEMS_LIMIT) return fail("galleryFull");
			await tx.galleryItem.create({
				data: {
					galleryId,
					photographerId,
					key,
					previewKey,
					size,
					...meta,
					position: (stats._max.position ?? -1) + 1,
				},
			});
			return ok();
		})
		.catch((error) => {
			// Confirming twice (retry, double click) is harmless.
			if (isUniqueViolation(error)) return ok();
			throw error;
		});

	if (result.ok) revalidateClientWork();
	return result;
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
