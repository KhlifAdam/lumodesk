import type { SiteData } from "@/services/public-site/types";
import { MobileNav } from "../../shared/mobile-nav";
import { SiteBrand } from "../../shared/site-brand";
import { SiteControls } from "../../shared/site-controls";
import { type NavLink, SiteNav } from "../../shared/site-nav";
import { StickyHeader } from "../../shared/sticky-header";

/** Floats in white over the hero, then turns into a solid bar on scroll. */
export function BoldHeader({
	site,
	links,
}: {
	site: SiteData;
	links: NavLink[];
}) {
	const { studio, i18n } = site;

	return (
		<StickyHeader className="fixed inset-x-0 top-0 z-40 text-white transition-all duration-500 data-[scrolled=true]:site-glass data-[scrolled=true]:text-[var(--s-fg)] data-[scrolled=true]:shadow-[0_1px_0_var(--s-border)]">
			<div className="flex items-center justify-between gap-6 px-6 py-5 md:px-12">
				<SiteBrand
					studio={studio}
					className="font-bold uppercase tracking-[0.2em]"
				/>
				<div className="flex items-center gap-8">
					<SiteNav links={links} className="opacity-80" />
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
