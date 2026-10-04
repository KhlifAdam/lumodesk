import { PhotoGridSkeleton } from "@/components/client-work/photo-grid-skeleton";

export function PortalProjectsSkeleton() {
	return (
		<div className="flex flex-col gap-3">
			<div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 3 }, (_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
						key={i}
						className="h-28 animate-pulse rounded-xl border border-border bg-card"
					/>
				))}
			</div>
		</div>
	);
}

export function PortalPageSkeleton({ photos }: { photos?: boolean }) {
	return (
		<>
			<div className="flex flex-col gap-2">
				<div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
				<div className="h-7 w-64 animate-pulse rounded-full bg-muted" />
			</div>
			{photos ? (
				<PhotoGridSkeleton />
			) : (
				<>
					<div className="h-20 animate-pulse rounded-xl border border-border bg-card" />
					<PortalProjectsSkeleton />
				</>
			)}
		</>
	);
}
