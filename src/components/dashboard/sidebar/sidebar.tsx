"use client";

import { BookOpen, LayoutGrid, Mail, Users } from "lucide-react";
import { NavItem } from "./nav-item";
import { SidebarLogo } from "./sidebar-logo";

const NAV_ITEMS = [
	{ href: "/dashboard", label: "Overview", icon: LayoutGrid },
	{ href: "/dashboard/bookings", label: "Bookings", icon: BookOpen },
	{ href: "/dashboard/clients", label: "Clients", icon: Users },
	{ href: "/dashboard/messages", label: "Messages", icon: Mail },
] as const;

export function Sidebar() {
	return (
		<aside className="flex h-screen w-56 shrink-0 flex-col border-r border-border bg-card">
			{/* Logo */}
			<div className="border-b border-border p-4">
				<SidebarLogo />
			</div>

			{/* Navigation */}
			<nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
				{NAV_ITEMS.map((item) => (
					<NavItem key={item.href} {...item} />
				))}
			</nav>
		</aside>
	);
}
