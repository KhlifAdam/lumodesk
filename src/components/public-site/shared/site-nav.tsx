import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import type { SiteSection } from "./site-helpers";

export interface NavLink {
	href: string;
	label: string;
}

/** Localized anchor links for the sections that exist. */
export async function getNavLinks(
	sections: SiteSection[],
	locale: Locale,
): Promise<NavLink[]> {
	const t = await getTranslations({ locale, namespace: "PublicSite.nav" });
	return sections.map((section) => ({
		href: `#${section}`,
		label: t(section),
	}));
}

/** Desktop navigation; small screens use <MobileNav />. */
export function SiteNav({
	links,
	className,
}: {
	links: NavLink[];
	className?: string;
}) {
	return (
		<nav
			className={cn(
				"hidden items-center gap-7 text-xs font-medium uppercase tracking-[0.18em] md:flex",
				className,
			)}
		>
			{links.map((link) => (
				<a
					key={link.href}
					href={link.href}
					className="transition-colors hover:text-[var(--s-accent)]"
				>
					{link.label}
				</a>
			))}
		</nav>
	);
}
