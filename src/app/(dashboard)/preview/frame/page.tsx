import { SiteRenderer } from "@/components/public-site/site-renderer";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { resolvePreview } from "@/services/preview/resolve-preview";

/** The site itself, rendered alone so the preview iframe has real breakpoints. */
export default async function PreviewFramePage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const { photographerId } = await requirePhotographer();
	const { site } = await resolvePreview(photographerId, await searchParams);

	return <SiteRenderer site={site} />;
}
