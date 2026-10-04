import { PageHeaderSkeleton } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";

const PLACEHOLDER_KEYS = ["a", "b", "c", "d", "e", "f"];

export default function PortfolioLoading() {
	return (
		<PageShell>
			<PageHeaderSkeleton />
			<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
				{PLACEHOLDER_KEYS.map((key) => (
					<div
						key={key}
						className="aspect-[4/3] animate-pulse rounded-lg bg-muted"
					/>
				))}
			</div>
		</PageShell>
	);
}
