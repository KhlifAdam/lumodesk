import { cn } from "@/lib/utils";

interface StatCardProps {
	label: string;
	value: string;
	detail?: string;
	accent?: boolean;
}

export function StatCard({
	label,
	value,
	detail,
	accent = false,
}: StatCardProps) {
	return (
		<div className="relative flex flex-col gap-1 overflow-hidden rounded-xl border border-border bg-card px-4 py-3">
			{accent && (
				<div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
			)}
			<span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
				{label}
			</span>
			<span
				className={cn(
					"text-xl font-bold tracking-tight",
					accent ? "text-primary" : "text-foreground",
				)}
			>
				{value}
			</span>
			{detail && (
				<span className="text-[11px] text-muted-foreground">{detail}</span>
			)}
		</div>
	);
}

export function StatCardSkeleton() {
	return (
		<div className="flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3">
			<div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
			<div className="h-6 w-14 animate-pulse rounded-full bg-muted" />
			<div className="h-3 w-16 animate-pulse rounded-full bg-muted" />
		</div>
	);
}
