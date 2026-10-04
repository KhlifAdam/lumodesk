import type { MediaType } from "@/generated/prisma/client";

/** Serializable media item sent to client components. */
export interface MediaItem {
	id: string;
	type: MediaType;
	url: string;
	filename: string;
	mimeType: string;
	size: number;
	width: number | null;
	height: number | null;
	durationSec: number | null;
	alt: string | null;
	createdAt: string;
}

export interface MediaPage {
	items: MediaItem[];
	page: number;
	pageCount: number;
	total: number;
}
