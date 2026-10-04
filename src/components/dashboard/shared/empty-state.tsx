import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description?: string;
	action?: ReactNode;
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center">
			<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
				<Icon className="h-4 w-4" />
			</div>
			<p className="text-sm font-medium">{title}</p>
			{description && (
				<p className="max-w-sm text-xs text-muted-foreground">{description}</p>
			)}
			{action && <div className="mt-1">{action}</div>}
		</div>
	);
}
