import { z } from "zod";

// Messages are `Validation.*` i18n keys (translated by <FormMessage />).

export const requiredText = (max: number) =>
	z.string().trim().min(1, "required").max(max, "tooLong");

export const optionalText = (max: number) =>
	z.string().trim().max(max, "tooLong");

export const optionalUrl = z
	.string()
	.trim()
	.max(300, "tooLong")
	.refine((v) => v === "" || z.url().safeParse(v).success, "invalidUrl");

export const optionalEmail = z
	.string()
	.trim()
	.refine((v) => v === "" || z.email().safeParse(v).success, "invalidEmail");

export const slugSchema = z
	.string()
	.trim()
	.min(3, "slugTooShort")
	.max(48, "tooLong")
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "invalidSlug");

export const idSchema = z.string().min(1);

/** Empty string → null, for optional DB columns. */
export const emptyToNull = (value: string | undefined) => value || null;
