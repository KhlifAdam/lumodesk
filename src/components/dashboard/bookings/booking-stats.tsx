import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import type { BookingStats } from "@/services/bookings/types";

const CARDS = [
	{ key: "total", tone: "text-foreground" },
	{ key: "pending", tone: "text-primary" },
	{ key: "confirmed", tone: "text-success" },
	{ key: "closed", tone: "text-destructive" },
] as const;

/** Total, waiting, confirmed and closed requests at a glance. */
export async function BookingStatsCards({ stats }: { stats: BookingStats }) {
	const t = await getTranslations("Bookings.stats");

	return (
		<dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
			{CARDS.map(({ key, tone }) => (
				<div
					key={key}
					className="flex flex-col gap-0.5 rounded-xl border border-border bg-card px-3 py-2.5"
				>
					<dt className="text-xs text-muted-foreground">{t(key)}</dt>
					<dd className={cn("font-display text-2xl font-bold", tone)}>
						{stats[key]}
					</dd>
				</div>
			))}
		</dl>
	);
}

export function BookingStatsSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
			{CARDS.map(({ key }) => (
				<div
					key={key}
					className="h-16 animate-pulse rounded-xl border border-border bg-muted/50"
				/>
			))}
		</div>
	);
}
