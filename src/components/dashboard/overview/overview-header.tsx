"use client";

import { Eye, Settings2 } from "lucide-react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const NOON = 12;
const EVENING = 18;

/**
 * Greeting + date use the visitor's own clock and time zone, so they're
 * rendered with `suppressHydrationWarning` (the server's clock may differ).
 */
export function OverviewHeader({
	userName,
	hasStudio,
}: {
	userName: string;
	hasStudio: boolean;
}) {
	const t = useTranslations("Dashboard.Overview");
	const format = useFormatter();
	const now = new Date();
	const hour = now.getHours();
	const period =
		hour < NOON ? "morning" : hour < EVENING ? "afternoon" : "evening";
	const firstName = userName.split(" ")[0] || userName;

	return (
		<div className="flex flex-wrap items-end justify-between gap-3">
			<div className="flex flex-col gap-0.5">
				<p className="text-xs text-muted-foreground" suppressHydrationWarning>
					{format.dateTime(now, {
						weekday: "long",
						month: "long",
						day: "numeric",
					})}
				</p>
				<h1
					className="font-display text-xl font-bold tracking-tight"
					suppressHydrationWarning
				>
					{t(`greeting.${period}`, { name: firstName })}
				</h1>
			</div>
			{hasStudio ? (
				<Button asChild variant="outline" size="sm" className="h-8 gap-1.5">
					<Link href="/preview" target="_blank">
						<Eye className="h-3.5 w-3.5" />
						{t("previewSite")}
					</Link>
				</Button>
			) : (
				<Button asChild size="sm" className="h-8 gap-1.5">
					<Link href="/dashboard/site">
						<Settings2 className="h-3.5 w-3.5" />
						{t("setupStudio")}
					</Link>
				</Button>
			)}
		</div>
	);
}
