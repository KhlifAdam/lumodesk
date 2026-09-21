import { LayoutGrid } from "lucide-react";

export function SidebarLogo() {
	return (
		<div className="flex items-center gap-3 px-3 py-2">
			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-luminous">
				<LayoutGrid className="h-5 w-5" />
			</div>
			<span className="text-sm font-semibold tracking-tight text-foreground">
				Studio North
			</span>
		</div>
	);
}
