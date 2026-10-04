import { z } from "zod";
import { idSchema } from "./schemas";

/** A drag-and-drop reorder of one page of a list, as the client saw it. */
export const pageReorderSchema = z.object({
	page: z.number().int().min(1),
	ids: z.array(idSchema).min(1).max(100),
});

export interface PageRow {
	id: string;
	position: number;
}

/**
 * New positions for a reorder of one page. `current` is the page as stored
 * (ordered by position); `ids` is the requested order. A valid reorder is a
 * permutation of exactly the rows on that page. Otherwise the client's view is
 * stale and null is returned.
 *
 * The page's existing positions are reused as slots, so positions stay unique
 * across pages and nothing moves to another page.
 */
export function planPageReorder(
	current: PageRow[],
	ids: string[],
): PageRow[] | null {
	if (ids.length !== current.length) return null;
	const onPage = new Set(current.map((row) => row.id));
	const requested = new Set(ids);
	if (requested.size !== ids.length) return null;
	if (ids.some((id) => !onPage.has(id))) return null;

	const slots = current.map((row) => row.position).sort((a, b) => a - b);
	return ids.map((id, index) => ({ id, position: slots[index] }));
}
