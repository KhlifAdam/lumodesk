import "server-only";

import { db } from "@/lib/db";
import {
	canClientView,
	isDeliveredToClient,
} from "@/services/projects/visibility";

export interface GalleryAccess {
	role: "owner" | "client";
	/** Full-quality files and downloads; otherwise previews only. */
	originals: boolean;
}

/**
 * Who may see a gallery: its photographer always, with the originals. The
 * project's client once it is shared and the project has reached Selection:
 * previews to choose from, and the originals once delivered and paid.
 * Returns null for everyone else.
 */
export async function getGalleryAccess(
	galleryId: string,
	userId: string,
): Promise<GalleryAccess | null> {
	const gallery = await db.gallery.findUnique({
		where: { id: galleryId },
		select: {
			photographerId: true,
			sharedAt: true,
			project: { select: { clientId: true, stage: true, paymentStatus: true } },
		},
	});
	if (!gallery) return null;
	if (gallery.photographerId === userId)
		return { role: "owner", originals: true };

	const { project } = gallery;
	if (
		project.clientId !== userId ||
		!gallery.sharedAt ||
		!canClientView(project)
	)
		return null;
	return { role: "client", originals: isDeliveredToClient(project) };
}

/** Same check, starting from a photo. */
export async function getItemAccess(itemId: string, userId: string) {
	const item = await db.galleryItem.findUnique({
		where: { id: itemId },
		select: { galleryId: true },
	});
	if (!item) return null;
	const access = await getGalleryAccess(item.galleryId, userId);
	return access ? { ...access, galleryId: item.galleryId } : null;
}
