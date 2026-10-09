import "server-only";

import { db } from "@/lib/db";
import { listPrivateParts } from "@/lib/storage/r2-private";
import { abortUploads } from "./cleanup";

/** Unfinished uploads older than this are given up and their parts freed. */
const STALE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
const INTERRUPTED_LIMIT = 50;

export interface InterruptedUpload {
	id: string;
	galleryId: string;
	galleryTitle: string;
	filename: string;
	size: number;
	/** Bytes already stored in the bucket. */
	uploaded: number;
	startedAt: string;
}

/**
 * Uploads of this project that stopped half-way (closed tab, lost
 * connection). Choosing the same file again resumes one where it stopped.
 */
export async function listInterruptedUploads(
	photographerId: string,
	projectId: string,
): Promise<InterruptedUpload[]> {
	const sessions = await db.uploadSession.findMany({
		where: { photographerId, gallery: { projectId } },
		include: { gallery: { select: { title: true } } },
		orderBy: [{ createdAt: "desc" }, { id: "asc" }],
		take: INTERRUPTED_LIMIT,
	});

	const now = Date.now();
	const stale = sessions.filter(
		(session) => now - session.createdAt.getTime() > STALE_AFTER_MS,
	);
	if (stale.length > 0) {
		await abortUploads(stale);
		await db.uploadSession.deleteMany({
			where: { id: { in: stale.map((session) => session.id) } },
		});
	}

	const live = sessions.filter((session) => !stale.includes(session));
	const withProgress = await Promise.all(
		live.map(async (session) => {
			const parts = await listPrivateParts(session.key, session.uploadId).catch(
				() => null,
			);
			return { session, parts };
		}),
	);

	return withProgress.flatMap(({ session, parts }) =>
		// The bucket no longer knows it: nothing left to resume.
		parts
			? [
					{
						id: session.id,
						galleryId: session.galleryId,
						galleryTitle: session.gallery.title,
						filename: session.filename,
						size: Number(session.size),
						uploaded: parts.reduce((sum, part) => sum + part.size, 0),
						startedAt: session.createdAt.toISOString(),
					},
				]
			: [],
	);
}
