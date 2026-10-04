import "server-only";

import { deletePrivateObjects } from "@/lib/storage/r2-private";

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
