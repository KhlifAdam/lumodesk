import {
	BookOpen,
	Briefcase,
	Images,
	LayoutGrid,
	Library,
	type LucideIcon,
	Mail,
	Palette,
	Store,
	Users,
} from "lucide-react";
import type { Messages } from "next-intl";

type NavKey = keyof Messages["Dashboard"]["Nav"];

export interface NavLink {
	href: string;
	labelKey: NavKey;
	icon: LucideIcon;
	/** Only active on an exact path match (for routes that prefix others). */
	exact?: boolean;
}

export interface NavGroup {
	labelKey: NavKey;
	items: NavLink[];
}

export const NAV_GROUPS: NavGroup[] = [
	{
		labelKey: "workspace",
		items: [
			{
				href: "/dashboard",
				labelKey: "overview",
				icon: LayoutGrid,
				exact: true,
			},
			{ href: "/dashboard/bookings", labelKey: "bookings", icon: BookOpen },
			{ href: "/dashboard/clients", labelKey: "clients", icon: Users },
			{ href: "/dashboard/messages", labelKey: "messages", icon: Mail },
		],
	},
	{
		labelKey: "website",
		items: [
			{ href: "/dashboard/media", labelKey: "media", icon: Library },
			{ href: "/dashboard/portfolio", labelKey: "portfolio", icon: Images },
			{ href: "/dashboard/services", labelKey: "services", icon: Briefcase },
			{
				href: "/dashboard/site",
				labelKey: "siteProfile",
				icon: Store,
				exact: true,
			},
			{
				href: "/dashboard/site/appearance",
				labelKey: "appearance",
				icon: Palette,
			},
		],
	},
];
