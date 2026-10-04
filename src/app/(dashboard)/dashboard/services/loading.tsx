import { PageHeaderSkeleton } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";

const PLACEHOLDER_KEYS = ["a", "b", "c", "d", "e"];

export default function ServicesLoading() {
	return (
		<PageShell>
			<PageHeaderSkeleton />
			<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{PLACEHOLDER_KEYS.map((key) => (
					<div key={key} className="h-52 animate-pulse rounded-lg bg-muted" />
				))}
			</div>
		</PageShell>
	);
}
