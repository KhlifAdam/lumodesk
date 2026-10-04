"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SegmentedOption<T extends string> {
	value: T;
	label: ReactNode;
	/** Accessible name when the label is an icon. */
	ariaLabel?: string;
}

interface SegmentedControlProps<T extends string> {
	value: T;
	onChange: (value: T) => void;
	options: SegmentedOption<T>[];
	className?: string;
}

/** Compact single-choice toggle group. */
export function SegmentedControl<T extends string>({
	value,
	onChange,
	options,
	className,
}: SegmentedControlProps<T>) {
	return (
		<div
			className={cn(
				"inline-flex rounded-lg border border-border bg-card p-0.5",
				className,
			)}
		>
			{options.map((option) => (
				<button
					key={option.value}
					type="button"
					aria-pressed={option.value === value}
					aria-label={option.ariaLabel}
					onClick={() => onChange(option.value)}
					className={cn(
						"flex h-6 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all duration-200",
						option.value === value
							? "bg-primary/10 text-primary"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{option.label}
				</button>
			))}
		</div>
	);
}
