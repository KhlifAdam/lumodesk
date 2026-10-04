import { PhotoGridSkeleton } from "@/components/client-work/photo-grid-skeleton";
import { PageHeaderSkeleton } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";

export default function GalleryManagerLoading() {
	return (
		<PageShell>
			<PageHeaderSkeleton />
			<div className="h-11 animate-pulse rounded-xl border border-border bg-card" />
			<div className="h-16 animate-pulse rounded-xl border border-border bg-card" />
			<PhotoGridSkeleton />
		</PageShell>
	);
}
