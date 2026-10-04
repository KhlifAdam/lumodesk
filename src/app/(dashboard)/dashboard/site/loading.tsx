import { PageHeaderSkeleton } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";

export default function SiteLoading() {
	return (
		<PageShell>
			<PageHeaderSkeleton />
			<div className="grid gap-4 xl:grid-cols-[3fr_2fr]">
				<div className="h-96 animate-pulse rounded-xl border border-border bg-card" />
				<div className="h-96 animate-pulse rounded-xl border border-border bg-card" />
			</div>
		</PageShell>
	);
}
