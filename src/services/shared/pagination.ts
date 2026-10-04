import { z } from "zod";

/** `?page=` for list pages. Anything invalid falls back to page 1. */
export const pageParamsSchema = z.object({
	page: z.coerce.number().int().min(1).catch(1),
});

export interface PageMeta {
	/** The page actually shown, clamped into the valid range. */
	page: number;
	pageCount: number;
	total: number;
}

/** Clamps the requested page; an empty list still has one (empty) page. */
export function pageMeta(
	requested: number,
	total: number,
	pageSize: number,
): PageMeta {
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	return {
		page: Math.min(Math.max(1, requested), pageCount),
		pageCount,
		total,
	};
}

export const pageSkip = (page: number, pageSize: number) =>
	(page - 1) * pageSize;
