import { PageHeaderSkeleton } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";

export default function ProjectLoading() {
	return (
		<PageShell>
			<PageHeaderSkeleton />
			<div className="h-20 animate-pulse rounded-xl border border-border bg-card" />
			<div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
				{Array.from({ length: 4 }, (_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
						key={i}
						className="aspect-[4/3] animate-pulse rounded-xl border border-border bg-card"
					/>
				))}
			</div>
		</PageShell>
	);
}
