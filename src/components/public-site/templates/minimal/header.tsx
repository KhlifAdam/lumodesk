import type { SiteData } from "@/services/public-site/types";
import { MobileNav } from "../../shared/mobile-nav";
import { SiteBrand } from "../../shared/site-brand";
import { SiteControls } from "../../shared/site-controls";
import { type NavLink, SiteNav } from "../../shared/site-nav";
import { StickyHeader } from "../../shared/sticky-header";

/** Nav left, brand centered, controls right; turns to frosted glass on scroll. */
export function MinimalHeader({
	site,
	links,
}: {
	site: SiteData;
	links: NavLink[];
}) {
	const { studio, i18n } = site;

	return (
		<StickyHeader className="sticky top-0 z-40 border-b border-transparent transition-all duration-500 data-[scrolled=true]:site-glass data-[scrolled=true]:site-border">
			<div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 py-5 md:px-8">
				<SiteNav links={links} className="site-muted" />
				<div className="col-start-1 md:col-start-2">
					<SiteBrand studio={studio} className="text-xl tracking-tight" />
				</div>
				<div className="col-start-3 flex items-center justify-end gap-3">
					<SiteControls
						locale={i18n.locale}
						locales={i18n.locales}
						className="hidden md:flex"
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
