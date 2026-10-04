"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { MediaFilter } from "@/services/media/schemas";

const FILTERS: MediaFilter[] = ["all", "image", "video"];

/** Type filter stored in `?type=`; changing it resets to page 1. */
export function MediaFilters({
	active,
	total,
}: {
	active: MediaFilter;
	total: number;
}) {
	const t = useTranslations("Media.filters");
	const pathname = usePathname();

	return (
		<div className="flex flex-wrap items-center justify-between gap-3">
			<div className="inline-flex rounded-lg border border-border bg-card p-0.5">
				{FILTERS.map((filter) => (
					<Link
						key={filter}
						href={filter === "all" ? pathname : `${pathname}?type=${filter}`}
						className={cn(
							"rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200",
							filter === active
								? "bg-primary/10 text-primary"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{t(filter)}
					</Link>
				))}
			</div>
			<p className="text-xs text-muted-foreground">{t("count", { total })}</p>
		</div>
	);
}
