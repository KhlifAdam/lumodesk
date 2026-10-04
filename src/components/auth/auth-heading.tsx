import type { ReactNode } from "react";

/** Title + subtitle shared by every auth screen. */
export function AuthHeading({
	title,
	description,
}: {
	title: string;
	description: ReactNode;
}) {
	return (
		<div className="flex flex-col space-y-2 text-center">
			<h1 className="text-3xl font-semibold tracking-tight text-foreground">
				{title}
			</h1>
			<p className="text-sm text-muted-foreground">{description}</p>
		</div>
	);
}
