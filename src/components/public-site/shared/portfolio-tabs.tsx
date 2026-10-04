"use client";

import { cn } from "@/lib/utils";

interface PortfolioTabsProps {
	tabs: { id: string; label: string }[];
	active: string;
	onSelect: (id: string) => void;
	/** Wrapper layout (alignment, spacing). */
	className?: string;
	/** Per-template look of every tab. */
	tabClassName: string;
	activeClassName: string;
	inactiveClassName: string;
}

/** Album filter tabs. Hidden when there's only one album (tabs = "all" + 1). */
export function PortfolioTabs({
	tabs,
	active,
	onSelect,
	className,
	tabClassName,
	activeClassName,
	inactiveClassName,
}: PortfolioTabsProps) {
	if (tabs.length <= 2) return null;

	return (
		<div className={cn("flex flex-wrap gap-2", className)}>
			{tabs.map((tab) => (
				<button
					key={tab.id}
					type="button"
					onClick={() => onSelect(tab.id)}
					className={cn(
						tabClassName,
						active === tab.id ? activeClassName : inactiveClassName,
					)}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
}
