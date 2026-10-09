import type { PageMeta } from "@/services/shared/pagination";

/** A gallery photo or video with short-lived signed URLs. */
export interface GalleryPhoto {
	id: string;
	type: "IMAGE" | "VIDEO";
	filename: string;
	/** Seconds, for videos. */
	durationSec: number | null;
	width: number | null;
	height: number | null;
	selected: boolean;
	commentCount: number;
	/** Null for a video whose poster couldn't be made in the browser. */
	previewUrl: string | null;
	fullUrl: string;
}

export interface GallerySummary {
	id: string;
	title: string;
	itemCount: number;
	selectedCount: number;
	shared: boolean;
	submitted: boolean;
	coverUrl: string | null;
}

export type GalleryFilter = "all" | "selected";

export interface GalleryView extends PageMeta {
	id: string;
	projectId: string;
	projectTitle: string;
	title: string;
	description: string;
	selectionEnabled: boolean;
	selectionLimit: number | null;
	selectedCount: number;
	shared: boolean;
	submitted: boolean;
	filter: GalleryFilter;
	items: GalleryPhoto[];
}

export interface GalleryComment {
	id: string;
	body: string;
	authorName: string;
	/** True when written by the photographer who owns the gallery. */
	byPhotographer: boolean;
	mine: boolean;
	createdAt: string;
}
