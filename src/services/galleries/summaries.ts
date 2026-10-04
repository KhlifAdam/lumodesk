import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { signPreview } from "./sign-items";
import type { GallerySummary } from "./types";

/** Gallery cards for a project. Callers scope `where` to the viewer. */
export async function listGallerySummaries(
	where: Prisma.GalleryWhereInput,
): Promise<GallerySummary[]> {
	const galleries = await db.gallery.findMany({
		where,
		orderBy: [{ position: "asc" }, { createdAt: "asc" }],
		include: {
			items: {
				orderBy: [{ position: "asc" }, { id: "asc" }],
				take: 1,
				select: { key: true, previewKey: true },
			},
			_count: { select: { items: true } },
		},
	});
	if (galleries.length === 0) return [];

	const selected = await db.galleryItem.groupBy({
		by: ["galleryId"],
		where: { galleryId: { in: galleries.map((g) => g.id) }, selected: true },
		_count: { _all: true },
	});
	const selectedBy = new Map(selected.map((s) => [s.galleryId, s._count._all]));

	return Promise.all(
		galleries.map(async (gallery) => ({
			id: gallery.id,
			title: gallery.title,
			itemCount: gallery._count.items,
			selectedCount: selectedBy.get(gallery.id) ?? 0,
			shared: Boolean(gallery.sharedAt),
			submitted: Boolean(gallery.submittedAt),
			coverUrl: gallery.items[0] ? await signPreview(gallery.items[0]) : null,
		})),
	);
}
