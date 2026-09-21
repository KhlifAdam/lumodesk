import { headers } from "next/headers";
import { OverviewHeader } from "@/components/dashboard/overview/overview-header";
import { StatCard } from "@/components/dashboard/overview/stat-card";
import { auth } from "@/lib/auth";

// Placeholder stats — will be replaced with real DB queries later
const STATS = [
	{ label: "Revenue", value: "$24,860", accent: true },
	{ label: "Projects", value: "18" },
	{ label: "Inquiries", value: "32" },
	{ label: "Gallery views", value: "8.4k" },
] as const;

export default async function OverviewPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div className="flex flex-col gap-8 p-8">
			<OverviewHeader userName={session?.user.name ?? "there"} />

			{/* Stat cards */}
			<div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
				{STATS.map((stat) => (
					<StatCard key={stat.label} {...stat} />
				))}
			</div>

			{/* Content panels */}
			<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
				{/* Latest gallery placeholder */}
				<div className="xl:col-span-2 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
					<div className="flex items-center justify-between">
						<span className="text-sm font-semibold text-foreground">
							Latest gallery
						</span>
						<button
							type="button"
							className="text-xs text-muted-foreground transition-colors hover:text-primary"
						>
							View all
						</button>
					</div>
					{/* 2x2 photo grid placeholder */}
					<div className="grid flex-1 grid-cols-2 gap-2">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: placeholder grid
								key={i}
								className="aspect-video rounded-xl bg-muted animate-pulse"
							/>
						))}
					</div>
				</div>

				{/* This month chart placeholder */}
				<div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
					<span className="text-sm font-semibold text-foreground">
						This month
					</span>
					{/* Bar chart placeholder — will be replaced with Recharts */}
					<div className="flex flex-1 items-end justify-between gap-1.5 pb-2">
						{[60, 35, 75, 45, 90, 55, 80, 40, 95, 65].map((height, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: placeholder bars
								key={i}
								className="flex-1 rounded-t-sm bg-primary/70 transition-all hover:bg-primary"
								style={{ height: `${height}%` }}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
