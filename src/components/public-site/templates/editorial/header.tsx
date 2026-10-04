import type { SiteData } from "@/services/public-site/types";
import { MobileNav } from "../../shared/mobile-nav";
import { SiteBrand } from "../../shared/site-brand";
import { SiteControls } from "../../shared/site-controls";
import { type NavLink, SiteNav } from "../../shared/site-nav";
import { StickyHeader } from "../../shared/sticky-header";

/** Masthead: brand left, navigation right, hairline rule underneath. */
export function EditorialHeader({
	site,
	links,
}: {
	site: SiteData;
	links: NavLink[];
}) {
	const { studio, i18n } = site;

	return (
		<StickyHeader className="site-bg site-border sticky top-0 z-40 border-b transition-all duration-500 data-[scrolled=true]:site-glass">
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-12">
				<SiteBrand studio={studio} className="text-2xl italic" />
				<div className="flex items-center gap-8">
					<SiteNav
						links={links}
						className="site-muted normal-case tracking-normal text-sm"
					/>
					<SiteControls
						locale={i18n.locale}
						locales={i18n.locales}
						className="site-border hidden border-l pl-6 md:flex"
					/>
					<MobileNav
						links={links}
						locale={i18n.locale}
						locales={i18n.locales}
					/>
				</div>
			</div>
		</StickyHeader>
	);
}
