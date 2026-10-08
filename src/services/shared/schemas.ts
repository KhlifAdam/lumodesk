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

const MAX_AMOUNT = 99_999_999;

/** `<input type="date">` value, or empty. */
export const dateInput = z
	.string()
	.trim()
	.refine((v) => v === "" || !Number.isNaN(Date.parse(v)), "invalidDate");

/** `<input type="time">` value, or empty. */
export const timeInput = z
	.string()
	.refine(
		(v) => v === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(v),
		"invalidTime",
	);

/** Money in TND; an empty number input is `null`. */
export const moneyAmount = z
	.number("invalidAmount")
	.min(0, "invalidAmount")
	.max(MAX_AMOUNT, "invalidAmount")
	.nullable();
