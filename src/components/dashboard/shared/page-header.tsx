import type { ReactNode } from "react";

interface PageHeaderProps {
	title: string;
	description?: string;
	actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
	return (
		<div className="flex flex-wrap items-end justify-between gap-3">
			<div className="flex flex-col gap-0.5">
				<h1 className="font-display text-xl font-bold tracking-tight text-foreground">
					{title}
				</h1>
				{description && (
					<p className="text-xs text-muted-foreground">{description}</p>
				)}
			</div>
			{actions && <div className="flex items-center gap-2">{actions}</div>}
		</div>
	);
}

export function PageHeaderSkeleton() {
	return (
		<div className="flex flex-col gap-1.5">
			<div className="h-6 w-48 animate-pulse rounded-full bg-muted" />
			<div className="h-3 w-72 animate-pulse rounded-full bg-muted" />
		</div>
	);
}
