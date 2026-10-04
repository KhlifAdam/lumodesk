import { StatCardSkeleton } from "@/components/dashboard/overview/stat-card";
import { PageShell } from "@/components/dashboard/shared/page-shell";

export default function DashboardLoading() {
	return (
		<PageShell>
			<div className="flex flex-col gap-2">
				<div className="h-3 w-32 animate-pulse rounded-full bg-muted" />
				<div className="h-6 w-56 animate-pulse rounded-full bg-muted" />
			</div>
			<div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
				<StatCardSkeleton />
				<StatCardSkeleton />
				<StatCardSkeleton />
				<StatCardSkeleton />
			</div>
			<div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
				<div className="h-56 animate-pulse rounded-xl border border-border bg-card" />
				<div className="h-56 animate-pulse rounded-xl border border-border bg-card xl:col-span-2" />
			</div>
		</PageShell>
	);
}
