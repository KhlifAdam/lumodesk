import "server-only";

import { db } from "@/lib/db";
import { isVisibleToClient } from "@/services/projects/visibility";

/**
 * Who may see a gallery: its photographer always; the project's client only
 * once it is shared and the project is delivered and paid. Returns null for
 * everyone else.
 */
export async function getGalleryAccess(galleryId: string, userId: string) {
	const gallery = await db.gallery.findUnique({
		where: { id: galleryId },
		select: {
			photographerId: true,
			sharedAt: true,
			project: { select: { clientId: true, stage: true, paymentStatus: true } },
		},
	});
	if (!gallery) return null;
	if (gallery.photographerId === userId) return "owner" as const;
	const isClient = gallery.project.clientId === userId;
	const visible = gallery.sharedAt && isVisibleToClient(gallery.project);
	return isClient && visible ? ("client" as const) : null;
}

/** Same check, starting from a photo. */
export async function getItemAccess(itemId: string, userId: string) {
	const item = await db.galleryItem.findUnique({
		where: { id: itemId },
		select: { galleryId: true },
	});
	if (!item) return null;
	const access = await getGalleryAccess(item.galleryId, userId);
	return access ? { access, galleryId: item.galleryId } : null;
}
