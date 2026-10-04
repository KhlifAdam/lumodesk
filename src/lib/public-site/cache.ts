import "server-only";

import { updateTag } from "next/cache";

export const PUBLIC_SITE_TAG = "public-site";

/**
 * Expires every cached public site, so the next visit shows the change.
 * Only valid inside Server Actions.
 */
export function revalidatePublicSites() {
	updateTag(PUBLIC_SITE_TAG);
}
