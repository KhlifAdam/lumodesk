const MB = 1024 * 1024;

export const GALLERY_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
] as const;
export const GALLERY_MAX_FILE_SIZE = 40 * MB;
/** Browser-made previews (long edge, JPEG: every browser can encode it) shown in grids. */
export const PREVIEW_MAX_EDGE = 1600;
export const PREVIEW_MAX_FILE_SIZE = 5 * MB;
export const PREVIEW_MIME_TYPE = "image/jpeg";

export const GALLERY_PAGE_SIZE = 48;
export const GALLERY_ITEMS_LIMIT = 2000;
export const GALLERIES_PER_PROJECT_LIMIT = 30;
export const SELECTION_LIMIT_MAX = GALLERY_ITEMS_LIMIT;
export const COMMENT_MAX_LENGTH = 1000;

export const GALLERY_EXTENSION_BY_MIME: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
};

export function isGalleryMime(type: string) {
	return (GALLERY_MIME_TYPES as readonly string[]).includes(type);
}

/** Every object of a gallery lives under this prefix in the private bucket. */
export function galleryKeyPrefix(photographerId: string, galleryId: string) {
	return `galleries/${photographerId}/${galleryId}/`;
}
