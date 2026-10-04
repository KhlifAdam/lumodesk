"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItemProps {
	href: string;
	label: string;
	icon: LucideIcon;
	exact?: boolean;
}

export function NavItem({ href, label, icon: Icon, exact }: NavItemProps) {
	const pathname = usePathname();
	const isActive =
		pathname === href || (!exact && pathname.startsWith(`${href}/`));

	return (
		<Link
			href={href}
			className={cn(
				"flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all duration-200",
				isActive
					? "bg-primary/10 text-primary"
					: "text-muted-foreground hover:bg-muted hover:text-foreground",
			)}
		>
			<Icon
				className={cn(
					"h-4 w-4 shrink-0 transition-colors",
					isActive ? "text-primary" : "text-muted-foreground",
				)}
			/>
			{label}
		</Link>
	);
}
