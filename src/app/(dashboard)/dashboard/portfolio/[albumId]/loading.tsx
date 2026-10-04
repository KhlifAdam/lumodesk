import { MediaGridSkeleton } from "@/components/dashboard/media/media-grid-skeleton";
import { PageHeaderSkeleton } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";

export default function AlbumLoading() {
	return (
		<PageShell>
			<PageHeaderSkeleton />
			<MediaGridSkeleton />
		</PageShell>
	);
}
