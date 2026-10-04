import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Standard dashboard page container: one place for page spacing. */
export function PageShell({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col gap-5 px-6 py-5", className)}>
			{children}
		</div>
	);
}
