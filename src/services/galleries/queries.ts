import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import {
	CLIENT_VIEWABLE_PROJECT,
	isDeliveredToClient,
} from "@/services/projects/visibility";
import { pageMeta, pageSkip } from "@/services/shared/pagination";
import { GALLERY_PAGE_SIZE } from "./constants";
import { galleryItemSelect, toGalleryPhoto } from "./sign-items";
import type { GalleryFilter, GalleryView } from "./types";

export const GALLERY_ITEM_ORDER = [
	{ position: "asc" as const },
	{ id: "asc" as const },
];

interface ViewParams {
	page: number;
	filter: GalleryFilter;
}

/**
 * Loads one page of a gallery. `where` must already scope it to the viewer;
 * a client only gets the originals once the project is delivered and paid.
 */
async function loadGalleryView(
	where: Prisma.GalleryWhereInput,
	{ page, filter }: ViewParams,
	viewer: "owner" | "client",
): Promise<GalleryView | null> {
	const gallery = await db.gallery.findFirst({
		where,
		include: {
			project: {
				select: { id: true, title: true, stage: true, paymentStatus: true },
			},
		},
	});
	if (!gallery) return null;
	const originals = viewer === "owner" || isDeliveredToClient(gallery.project);

	const itemWhere: Prisma.GalleryItemWhereInput = { galleryId: gallery.id };
	if (filter === "selected") itemWhere.selected = true;

	const [total, selectedCount] = await Promise.all([
		db.galleryItem.count({ where: itemWhere }),
		db.galleryItem.count({ where: { galleryId: gallery.id, selected: true } }),
	]);
	const meta = pageMeta(page, total, GALLERY_PAGE_SIZE);
	const rows = await db.galleryItem.findMany({
		where: itemWhere,
		orderBy: GALLERY_ITEM_ORDER,
		skip: pageSkip(meta.page, GALLERY_PAGE_SIZE),
		take: GALLERY_PAGE_SIZE,
		select: galleryItemSelect,
	});

	return {
		...meta,
		id: gallery.id,
		projectId: gallery.project.id,
		projectTitle: gallery.project.title,
		title: gallery.title,
		description: gallery.description ?? "",
		selectionEnabled: gallery.selectionEnabled,
		selectionLimit: gallery.selectionLimit,
		selectedCount,
		shared: Boolean(gallery.sharedAt),
		submitted: Boolean(gallery.submittedAt),
		filter,
		originals,
		items: await Promise.all(rows.map((row) => toGalleryPhoto(row, originals))),
	};
}

export function getOwnedGallery(
	photographerId: string,
	galleryId: string,
	params: ViewParams,
) {
	return loadGalleryView({ id: galleryId, photographerId }, params, "owner");
}

export function getClientGallery(
	clientId: string,
	galleryId: string,
	params: ViewParams,
) {
	return loadGalleryView(
		{
			id: galleryId,
			sharedAt: { not: null },
			project: { clientId, ...CLIENT_VIEWABLE_PROJECT },
		},
		params,
		"client",
	);
}
