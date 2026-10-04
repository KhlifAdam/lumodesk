import { PageHeaderSkeleton } from "./page-header";
import { PageShell } from "./page-shell";

/** Loading state for list pages: header, toolbar and rows. */
export function ListPageSkeleton({ rows = 6 }: { rows?: number }) {
	return (
		<PageShell>
			<PageHeaderSkeleton />
			<div className="h-8 w-72 animate-pulse rounded-lg bg-muted" />
			<ListSkeleton rows={rows} />
		</PageShell>
	);
}

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
	return (
		<div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
			{Array.from({ length: rows }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
				<div key={i} className="flex items-center gap-3 px-3 py-2.5">
					<div className="h-7 w-7 animate-pulse rounded-full bg-muted" />
					<div className="flex flex-1 flex-col gap-1.5">
						<div className="h-3 w-40 animate-pulse rounded-full bg-muted" />
						<div className="h-2.5 w-56 animate-pulse rounded-full bg-muted" />
					</div>
				</div>
			))}
		</div>
	);
}
