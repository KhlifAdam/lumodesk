import "server-only";

import { getPrivateViewUrl } from "@/lib/storage/r2-private";
import type { GalleryPhoto } from "./types";

interface ItemRow {
	id: string;
	key: string;
	previewKey: string | null;
	type: "IMAGE" | "VIDEO";
	filename: string;
	durationSec: number | null;
	width: number | null;
	height: number | null;
	selected: boolean;
	_count: { comments: number };
}

export const galleryItemSelect = {
	id: true,
	key: true,
	previewKey: true,
	type: true,
	filename: true,
	durationSec: true,
	width: true,
	height: true,
	selected: true,
	_count: { select: { comments: true } },
} as const;

/** Only call after an access check: the URLs grant read access to the files. */
export async function toGalleryPhoto(item: ItemRow): Promise<GalleryPhoto> {
	const [fullUrl, previewUrl] = await Promise.all([
		getPrivateViewUrl(item.key),
		item.previewKey ? getPrivateViewUrl(item.previewKey) : null,
	]);
	return {
		id: item.id,
		type: item.type,
		filename: item.filename,
		durationSec: item.durationSec,
		width: item.width,
		height: item.height,
		selected: item.selected,
		commentCount: item._count.comments,
		// A photo can stand in for its own preview; a video file can't.
		previewUrl: previewUrl ?? (item.type === "IMAGE" ? fullUrl : null),
		fullUrl,
	};
}

export function signPreview(item: { key: string; previewKey: string | null }) {
	return getPrivateViewUrl(item.previewKey ?? item.key);
}
