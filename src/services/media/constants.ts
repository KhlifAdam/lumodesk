const MB = 1024 * 1024;

export const MEDIA_LIMITS = {
	IMAGE: {
		maxSize: 25 * MB,
		mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
	},
	VIDEO: {
		maxSize: 500 * MB,
		mimeTypes: ["video/mp4", "video/webm", "video/quicktime"],
	},
} as const;

export const ACCEPTED_MIME_TYPES = [
	...MEDIA_LIMITS.IMAGE.mimeTypes,
	...MEDIA_LIMITS.VIDEO.mimeTypes,
];

export const MEDIA_PAGE_SIZE = 24;

export const EXTENSION_BY_MIME: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/avif": "avif",
	"video/mp4": "mp4",
	"video/webm": "webm",
	"video/quicktime": "mov",
};

export type MediaKind = keyof typeof MEDIA_LIMITS;

export function mediaKindOf(mimeType: string): MediaKind | null {
	if ((MEDIA_LIMITS.IMAGE.mimeTypes as readonly string[]).includes(mimeType))
		return "IMAGE";
	if ((MEDIA_LIMITS.VIDEO.mimeTypes as readonly string[]).includes(mimeType))
		return "VIDEO";
	return null;
}
