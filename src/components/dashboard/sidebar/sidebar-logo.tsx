import { Aperture } from "lucide-react";

export function SidebarLogo({ name }: { name: string }) {
	return (
		<div className="flex items-center gap-2.5 px-2 py-1">
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-luminous">
				<Aperture className="h-4 w-4" />
			</div>
			<span className="truncate text-sm font-semibold tracking-tight text-foreground">
				{name}
			</span>
		</div>
	);
}
