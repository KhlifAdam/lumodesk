import "server-only";

import { db } from "@/lib/db";

/** True when every id is a media item owned by the photographer. */
export async function ownsMedia(
	photographerId: string,
	ids: (string | null | undefined)[],
) {
	const unique = [...new Set(ids.filter((id): id is string => Boolean(id)))];
	if (unique.length === 0) return true;
	const count = await db.media.count({
		where: { id: { in: unique }, photographerId },
	});
	return count === unique.length;
}
