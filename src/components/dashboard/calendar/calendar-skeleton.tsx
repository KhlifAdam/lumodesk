import { PageHeaderSkeleton } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";

/** Stable placeholder ids for five weeks of cells. */
const CELLS = Array.from({ length: 35 }, (_, i) => `cell-${i}`);

export function CalendarSkeleton() {
	return (
		<div className="flex flex-col gap-3">
			<div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
			<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
				<div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border">
					{CELLS.map((cell) => (
						<div
							key={cell}
							className="flex min-h-16 flex-col gap-1 bg-card p-1.5 sm:min-h-24"
						>
							<div className="h-3 w-4 animate-pulse rounded-full bg-muted" />
						</div>
					))}
				</div>
				<div className="h-64 animate-pulse rounded-xl bg-muted" />
			</div>
		</div>
	);
}

export function CalendarPageSkeleton() {
	return (
		<PageShell>
			<PageHeaderSkeleton />
			<CalendarSkeleton />
		</PageShell>
	);
}
