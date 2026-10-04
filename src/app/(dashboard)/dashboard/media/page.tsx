import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { MediaFilters } from "@/components/dashboard/media/media-filters";
import { MediaGrid } from "@/components/dashboard/media/media-grid";
import { MediaGridSkeleton } from "@/components/dashboard/media/media-grid-skeleton";
import { MediaUploader } from "@/components/dashboard/media/media-uploader";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";
import { UrlPagination } from "@/components/dashboard/shared/url-pagination";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { listMedia } from "@/services/media/queries";
import { listMediaSchema } from "@/services/media/schemas";

interface MediaPageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MediaPage({ searchParams }: MediaPageProps) {
	const t = await getTranslations("Media");
	const params = listMediaSchema.parse(await searchParams);

	return (
		<PageShell>
			<PageHeader title={t("title")} description={t("description")} />
			<MediaUploader />
			<Suspense
				key={`${params.type}-${params.page}`}
				fallback={<MediaGridSkeleton />}
			>
				<MediaLibrary {...params} />
			</Suspense>
		</PageShell>
	);
}

async function MediaLibrary(params: {
	page: number;
	type: "all" | "image" | "video";
}) {
	const { photographerId } = await requirePhotographer();
	const { items, page, pageCount, total } = await listMedia(
		photographerId,
		params,
	);

	return (
		<div className="flex flex-col gap-4">
			<MediaFilters active={params.type} total={total} />
			<MediaGrid items={items} />
			<UrlPagination page={page} pageCount={pageCount} />
		</div>
	);
}
