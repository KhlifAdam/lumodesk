import "server-only";

import { getPrivateViewUrl } from "@/lib/storage/r2-private";
import type { GalleryPhoto } from "./types";

interface ItemRow {
	id: string;
	key: string;
	previewKey: string | null;
	filename: string;
	width: number | null;
	height: number | null;
	selected: boolean;
	_count: { comments: number };
}

export const galleryItemSelect = {
	id: true,
	key: true,
	previewKey: true,
	filename: true,
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
		filename: item.filename,
		width: item.width,
		height: item.height,
		selected: item.selected,
		commentCount: item._count.comments,
		previewUrl: previewUrl ?? fullUrl,
		fullUrl,
	};
}

export function signPreview(item: { key: string; previewKey: string | null }) {
	return getPrivateViewUrl(item.previewKey ?? item.key);
}
