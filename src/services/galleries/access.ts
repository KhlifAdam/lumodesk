import "server-only";

import { db } from "@/lib/db";

/**
 * Who may see a gallery: its photographer always; the project's client only
 * once it is shared. Returns null for everyone else.
 */
export async function getGalleryAccess(galleryId: string, userId: string) {
	const gallery = await db.gallery.findUnique({
		where: { id: galleryId },
		select: {
			photographerId: true,
			sharedAt: true,
			project: { select: { clientId: true } },
		},
	});
	if (!gallery) return null;
	if (gallery.photographerId === userId) return "owner" as const;
	const isClient = gallery.project.clientId === userId;
	return isClient && gallery.sharedAt ? ("client" as const) : null;
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
