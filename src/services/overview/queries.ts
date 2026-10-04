import "server-only";

import { db } from "@/lib/db";
import { toMediaItem } from "@/services/media/queries";

const LATEST_UPLOADS = 8;

/** Everything the dashboard overview shows, in one round trip. */
export async function getOverview(photographerId: string) {
	const [
		studio,
		media,
		albums,
		publishedAlbums,
		packages,
		activePackages,
		latest,
	] = await Promise.all([
		db.studio.findUnique({
			where: { photographerId },
			select: { name: true, published: true },
		}),
		db.media.count({ where: { photographerId } }),
		db.album.count({ where: { photographerId } }),
		db.album.count({ where: { photographerId, published: true } }),
		db.package.count({ where: { photographerId } }),
		db.package.count({ where: { photographerId, active: true } }),
		db.media.findMany({
			where: { photographerId },
			orderBy: { createdAt: "desc" },
			take: LATEST_UPLOADS,
		}),
	]);

	return {
		studio,
		counts: { media, albums, publishedAlbums, packages, activePackages },
		latestMedia: latest.map(toMediaItem),
	};
}

export type Overview = Awaited<ReturnType<typeof getOverview>>;
