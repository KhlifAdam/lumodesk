import "server-only";

import { downloadZip } from "client-zip";
import { db } from "@/lib/db";
import { readPrivateObject } from "@/lib/storage/r2-private";
import { GALLERY_ITEM_ORDER } from "./queries";

/** Two files with the same name would overwrite each other once unzipped. */
function uniqueNames(names: string[]) {
	const seen = new Map<string, number>();
	return names.map((name) => {
		const count = seen.get(name.toLowerCase()) ?? 0;
		seen.set(name.toLowerCase(), count + 1);
		if (count === 0) return name;
		const dot = name.lastIndexOf(".");
		return dot > 0
			? `${name.slice(0, dot)} (${count + 1})${name.slice(dot)}`
			: `${name} (${count + 1})`;
	});
}

/**
 * The gallery (or only its picks) as one ZIP, streamed: each file is read from
 * the bucket while the previous one is being sent, so nothing big sits in
 * memory, even for videos of several GB. Call after an access check.
 */
export async function galleryZip(galleryId: string, selectedOnly: boolean) {
	const [gallery, items] = await Promise.all([
		db.gallery.findUnique({
			where: { id: galleryId },
			select: { title: true },
		}),
		db.galleryItem.findMany({
			where: { galleryId, ...(selectedOnly && { selected: true }) },
			orderBy: GALLERY_ITEM_ORDER,
			select: { key: true, filename: true, size: true, createdAt: true },
		}),
	]);
	if (!gallery || items.length === 0) return null;

	const names = uniqueNames(items.map((item) => item.filename));
	const metadata = items.map((item, i) => ({
		name: names[i],
		size: item.size,
	}));

	async function* files() {
		for (const [i, item] of items.entries()) {
			yield {
				name: names[i],
				size: item.size,
				lastModified: item.createdAt,
				input: await readPrivateObject(item.key),
			};
		}
	}

	// `metadata` lets the ZIP's exact length be sent, so browsers show progress.
	const zip = downloadZip(files(), { metadata });
	return { response: zip, filename: `${gallery.title}.zip` };
}
