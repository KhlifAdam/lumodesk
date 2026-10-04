import { SiteFooter } from "../../shared/site-footer";
import { getSiteSections, hasBio } from "../../shared/site-helpers";
import { getNavLinks } from "../../shared/site-nav";
import type { TemplateProps } from "../types";
import { EditorialAbout } from "./about";
import { EditorialContact } from "./contact";
import { EditorialHeader } from "./header";
import { EditorialHero } from "./hero";
import { EditorialPortfolio } from "./portfolio";
import { EditorialServices } from "./services";

/** Editorial: magazine layouts, serif voice, every album told as a chapter. */
export async function EditorialTemplate({ site }: TemplateProps) {
	const links = await getNavLinks(getSiteSections(site), site.i18n.locale);

	return (
		<>
			<EditorialHeader site={site} links={links} />
			<EditorialHero site={site} />
			{site.albums.length > 0 && <EditorialPortfolio albums={site.albums} />}
			{site.packages.length > 0 && <EditorialServices site={site} />}
			{hasBio(site.studio) && <EditorialAbout site={site} />}
			<EditorialContact site={site} />
			<SiteFooter site={site} links={links} brandClassName="text-2xl italic" />
		</>
	);
}
