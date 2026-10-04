import { PageHeaderSkeleton } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";

export default function AppearanceLoading() {
	return (
		<PageShell>
			<PageHeaderSkeleton />
			<div className="grid gap-4 xl:grid-cols-[3fr_2fr]">
				<div className="h-[28rem] animate-pulse rounded-xl border border-border bg-card" />
				<div className="h-64 animate-pulse rounded-xl border border-border bg-card" />
			</div>
		</PageShell>
	);
}
