import { z } from "zod";
import { pageReorderSchema } from "@/services/shared/reorder-page";
import {
	idSchema,
	optionalText,
	requiredText,
} from "@/services/shared/schemas";
import {
	COMMENT_MAX_LENGTH,
	GALLERY_MAX_FILE_SIZE,
	isGalleryMime,
	PREVIEW_MAX_FILE_SIZE,
	SELECTION_LIMIT_MAX,
} from "./constants";

export const galleryViewSchema = z.object({
	page: z.coerce.number().int().min(1).catch(1),
	filter: z.enum(["all", "selected"]).catch("all"),
});

export const createGallerySchema = z.object({
	projectId: idSchema,
	title: requiredText(120),
});

export const gallerySettingsSchema = z.object({
	title: requiredText(120),
	description: optionalText(1000),
	selectionEnabled: z.boolean(),
	selectionLimit: z
		.number("invalidNumber")
		.int("invalidNumber")
		.min(1, "invalidNumber")
		.max(SELECTION_LIMIT_MAX, "invalidNumber")
		.nullable(),
});

export const updateGallerySchema = gallerySettingsSchema.extend({
	id: idSchema,
});

export const shareGallerySchema = z.object({
	id: idSchema,
	shared: z.boolean(),
});

const fileFields = {
	galleryId: idSchema,
	filename: z.string().min(1).max(255),
	mimeType: z.string().refine(isGalleryMime, "unsupportedType"),
	size: z.number().int().positive().max(GALLERY_MAX_FILE_SIZE, "tooLarge"),
	previewSize: z
		.number()
		.int()
		.positive()
		.max(PREVIEW_MAX_FILE_SIZE, "tooLarge"),
};

export const requestGalleryUploadSchema = z.object(fileFields);

export const confirmGalleryUploadSchema = z.object({
	...fileFields,
	key: z.string().min(1),
	previewKey: z.string().min(1),
	width: z.number().int().positive().optional(),
	height: z.number().int().positive().optional(),
});

export const galleryItemIdsSchema = z.object({
	galleryId: idSchema,
	ids: z.array(idSchema).min(1).max(100),
});

export const reorderGalleryItemsSchema = pageReorderSchema.extend({
	galleryId: idSchema,
});

export const toggleSelectionSchema = z.object({
	itemId: idSchema,
	selected: z.boolean(),
});

export const addCommentSchema = z.object({
	itemId: idSchema,
	body: requiredText(COMMENT_MAX_LENGTH),
});

export type GallerySettingsValues = z.infer<typeof gallerySettingsSchema>;
