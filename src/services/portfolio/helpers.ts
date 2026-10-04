import "server-only";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { revalidatePublicSites } from "@/lib/public-site/cache";

const PORTFOLIO_PATH = "/dashboard/portfolio";

/** Refreshes the album list, and one album's page when an id is given. */
export function revalidateAlbum(albumId?: string) {
	revalidatePath(PORTFOLIO_PATH);
	if (albumId) revalidatePath(`${PORTFOLIO_PATH}/${albumId}`);
	revalidatePublicSites();
}

/** Loads an album only if it belongs to the photographer. */
export function findOwnedAlbum(photographerId: string, albumId: string) {
	return db.album.findFirst({
		where: { id: albumId, photographerId },
		select: { id: true },
	});
}
