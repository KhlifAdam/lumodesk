import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
	selected: boolean;
	onSelect: () => void;
	title: string;
	description?: string;
	children?: ReactNode;
}

/** Selectable card used by the appearance pickers (toggle-button semantics). */
export function OptionCard({
	selected,
	onSelect,
	title,
	description,
	children,
}: OptionCardProps) {
	return (
		<button
			type="button"
			aria-pressed={selected}
			onClick={onSelect}
			className={cn(
				"relative flex flex-col gap-2 rounded-lg border bg-card p-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				selected
					? "border-primary shadow-luminous"
					: "border-border hover:border-primary/40",
			)}
		>
			{children}
			<div className="flex flex-col gap-0.5 px-0.5">
				<span className="text-xs font-semibold">{title}</span>
				{description && (
					<span className="text-[11px] leading-snug text-muted-foreground">
						{description}
					</span>
				)}
			</div>
			{selected && (
				<span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
					<Check className="h-2.5 w-2.5" />
				</span>
			)}
		</button>
	);
}
