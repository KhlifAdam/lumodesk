"use server";

import { type ActionResult, fail, failFromZod, ok } from "@/lib/action-result";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { db } from "@/lib/db";
import { ownsMedia } from "@/services/shared/assert-owned-media";
import { lockAlbum } from "@/services/shared/lock-rows";
import { pageSkip } from "@/services/shared/pagination";
import { planPageReorder } from "@/services/shared/reorder-page";
import { findOwnedAlbum, revalidateAlbum } from "./helpers";
import {
	ALBUM_ITEM_PAGE_SIZE,
	albumCoverSchema,
	albumItemSchema,
	albumItemsSchema,
	MAX_ALBUM_ITEMS,
	reorderAlbumItemsSchema,
} from "./schemas";

/** Actions on the photos inside one album (album CRUD is in ./actions). */

export async function addAlbumItems(input: unknown): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = albumItemsSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const { albumId, mediaIds } = parsed.data;
	if (!(await findOwnedAlbum(photographerId, albumId))) return fail("notFound");
	if (!(await ownsMedia(photographerId, mediaIds))) return fail("invalidInput");

	const added = await db.$transaction(async (tx) => {
		await lockAlbum(tx, albumId);

		const count = await tx.albumItem.count({ where: { albumId } });
		if (count + mediaIds.length > MAX_ALBUM_ITEMS) return false;

		const last = await tx.albumItem.aggregate({
			where: { albumId },
			_max: { position: true },
		});
		const start = (last._max.position ?? -1) + 1;
		await tx.albumItem.createMany({
			data: mediaIds.map((mediaId, i) => ({
				albumId,
				mediaId,
				position: start + i,
			})),
			skipDuplicates: true,
		});
		return true;
	});
	if (!added) return fail("albumFull");

	revalidateAlbum(albumId);
	return ok();
}

export async function removeAlbumItem(input: unknown): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = albumItemSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const { albumId, mediaId } = parsed.data;
	if (!(await findOwnedAlbum(photographerId, albumId))) return fail("notFound");

	await db.$transaction([
		db.albumItem.deleteMany({ where: { albumId, mediaId } }),
		// Removing the cover item from the album also clears it as cover.
		db.album.updateMany({
			where: { id: albumId, coverMediaId: mediaId },
			data: { coverMediaId: null },
		}),
	]);
	revalidateAlbum(albumId);
	return ok();
}

export async function reorderAlbumItems(input: unknown): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = reorderAlbumItemsSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	const { albumId, page, ids } = parsed.data;
	if (!(await findOwnedAlbum(photographerId, albumId))) return fail("notFound");

	const reordered = await db.$transaction(async (tx) => {
		await lockAlbum(tx, albumId);
		const current = await tx.albumItem.findMany({
			where: { albumId },
			orderBy: [{ position: "asc" }, { mediaId: "asc" }],
			skip: pageSkip(page, ALBUM_ITEM_PAGE_SIZE),
			take: ALBUM_ITEM_PAGE_SIZE,
			select: { mediaId: true, position: true },
		});
		const next = planPageReorder(
			current.map((row) => ({ id: row.mediaId, position: row.position })),
			ids,
		);
		if (!next) return false;
		for (const { id, position } of next) {
			await tx.albumItem.update({
				where: { albumId_mediaId: { albumId, mediaId: id } },
				data: { position },
			});
		}
		return true;
	});
	if (!reordered) return fail("staleOrder");

	revalidateAlbum(albumId);
	return ok();
}

export async function setAlbumCover(input: unknown): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = albumCoverSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const { albumId, mediaId } = parsed.data;
	if (!(await ownsMedia(photographerId, [mediaId])))
		return fail("invalidInput");

	const { count } = await db.album.updateMany({
		where: { id: albumId, photographerId },
		data: { coverMediaId: mediaId },
	});
	if (count === 0) return fail("notFound");
	revalidateAlbum(albumId);
	return ok();
}
