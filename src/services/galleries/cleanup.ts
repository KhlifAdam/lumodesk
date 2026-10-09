import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import {
	abortPrivateMultipart,
	deletePrivateObjects,
} from "@/lib/storage/r2-private";

/** Best-effort removal of private objects after their rows are deleted. */
export async function deleteGalleryFiles(
	items: { key: string; previewKey: string | null }[],
) {
	const keys = items.flatMap((item) =>
		item.previewKey ? [item.key, item.previewKey] : [item.key],
	);
	if (keys.length === 0) return;
	await deletePrivateObjects(keys).catch((error) =>
		console.error("Failed to delete private R2 objects:", error),
	);
}

/** Unfinished uploads matching `where`, read before their gallery is deleted. */
export function findUploadSessions(where: Prisma.UploadSessionWhereInput) {
	return db.uploadSession.findMany({
		where,
		select: { key: true, uploadId: true },
	});
}

/**
 * Frees the parts of unfinished uploads in the bucket. Deleting the rows alone
 * would leave those parts stored (and billed) until the bucket expires them.
 */
export async function abortUploads(
	sessions: { key: string; uploadId: string }[],
) {
	await Promise.all(
		sessions.map((session) =>
			abortPrivateMultipart(session.key, session.uploadId).catch((error) =>
				console.error("Failed to abort a multipart upload:", error),
			),
		),
	);
}
