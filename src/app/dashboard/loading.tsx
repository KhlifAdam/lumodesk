import { StatCardSkeleton } from "@/components/dashboard/overview/stat-card";

export default function DashboardLoading() {
	return (
		<div className="flex flex-col gap-8 p-8">
			{/* Header skeleton */}
			<div className="flex items-start justify-between">
				<div className="flex flex-col gap-2">
					<div className="h-3.5 w-36 animate-pulse rounded-full bg-muted" />
					<div className="h-8 w-64 animate-pulse rounded-full bg-muted" />
				</div>
				<div className="h-10 w-32 animate-pulse rounded-xl bg-muted" />
			</div>

			{/* Stat cards skeleton */}
			<div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
				<StatCardSkeleton />
				<StatCardSkeleton />
				<StatCardSkeleton />
				<StatCardSkeleton />
			</div>

			{/* Content panels skeleton */}
			<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
				<div className="xl:col-span-2 h-72 animate-pulse rounded-2xl bg-card border border-border" />
				<div className="h-72 animate-pulse rounded-2xl bg-card border border-border" />
			</div>
		</div>
	);
}
