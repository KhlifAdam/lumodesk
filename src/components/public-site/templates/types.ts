import type { SiteData } from "@/services/public-site/types";

/** Every template component receives the same data and decides how to show it. */
export interface TemplateProps {
	site: SiteData;
}

/** One color scheme, exposed as `--s-*` CSS variables. */
export interface SiteColors {
	bg: string;
	fg: string;
	muted: string;
	card: string;
	border: string;
}

/** Each template ships both schemes; the studio's theme mode picks which apply. */
export interface SitePalette {
	light: SiteColors;
	dark: SiteColors;
}
