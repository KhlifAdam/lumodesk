import type { MediaItem } from "@/services/media/types";
import type { PageMeta } from "@/services/shared/pagination";

export interface AlbumSummary {
	id: string;
	title: string;
	slug: string;
	description: string;
	published: boolean;
	itemCount: number;
	/** Explicit cover, or the first item as a fallback. */
	cover: MediaItem | null;
}

export interface AlbumPage extends PageMeta {
	items: AlbumSummary[];
}

export interface AlbumDetail extends Omit<AlbumSummary, "cover"> {
	coverMediaId: string | null;
	cover: MediaItem | null;
	/** The photos on the current page of the album. */
	items: MediaItem[];
	/** Pagination of `items`; `total` equals `itemCount`. */
	page: number;
	pageCount: number;
}
