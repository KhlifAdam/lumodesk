import { SiteFooter } from "../../shared/site-footer";
import { getSiteSections, hasBio } from "../../shared/site-helpers";
import { getNavLinks } from "../../shared/site-nav";
import type { TemplateProps } from "../types";
import { BoldAbout } from "./about";
import { BoldContact } from "./contact";
import { BoldHeader } from "./header";
import { BoldHero } from "./hero";
import { BoldPortfolio } from "./portfolio";
import { BoldServices } from "./services";

/** Bold: full-bleed imagery, oversized type, high contrast. */
export async function BoldTemplate({ site }: TemplateProps) {
	const links = await getNavLinks(getSiteSections(site), site.i18n.locale);

	return (
		<>
			<BoldHeader site={site} links={links} />
			<BoldHero site={site} />
			{site.albums.length > 0 && <BoldPortfolio albums={site.albums} />}
			{site.packages.length > 0 && <BoldServices site={site} />}
			{hasBio(site.studio) && <BoldAbout site={site} />}
			<BoldContact site={site} />
			<SiteFooter
				site={site}
				links={links}
				brandClassName="font-bold uppercase tracking-[0.2em]"
			/>
		</>
	);
}
