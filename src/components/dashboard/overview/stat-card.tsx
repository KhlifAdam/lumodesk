import { cn } from "@/lib/utils";

interface StatCardProps {
	label: string;
	value: string;
	accent?: boolean;
}

export function StatCard({ label, value, accent = false }: StatCardProps) {
	return (
		<div className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-border bg-card p-5">
			{/* Subtle top accent line */}
			{accent && (
				<div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
			)}

			<span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
				{label}
			</span>

			<span
				className={cn(
					"text-2xl font-bold tracking-tight",
					accent ? "text-primary" : "text-foreground",
				)}
			>
				{value}
			</span>
		</div>
	);
}

export function StatCardSkeleton() {
	return (
		<div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
			<div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
			<div className="h-7 w-28 animate-pulse rounded-full bg-muted" />
		</div>
	);
}
