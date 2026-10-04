import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
	title: string;
	description?: string;
	children: ReactNode;
	className?: string;
}

/** Compact titled card grouping related form fields. */
export function FormSection({
	title,
	description,
	children,
	className,
}: FormSectionProps) {
	return (
		<section
			className={cn(
				"flex flex-col gap-3 rounded-xl border border-border bg-card p-4",
				className,
			)}
		>
			<header className="flex flex-col gap-0.5">
				<h2 className="text-sm font-semibold">{title}</h2>
				{description && (
					<p className="text-xs text-muted-foreground">{description}</p>
				)}
			</header>
			{children}
		</section>
	);
}
