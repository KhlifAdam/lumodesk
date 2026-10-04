import type {
	SiteData,
	SiteMedia,
	SiteStudio,
} from "@/services/public-site/types";

export type SiteSection = "portfolio" | "services" | "about" | "contact";

export const hasBio = (studio: SiteStudio) => studio.bio.trim().length > 0;

/** Sections that have content, in page order (used for nav links). */
export function getSiteSections({
	studio,
	albums,
	packages,
}: SiteData): SiteSection[] {
	return [
		...(albums.length > 0 ? (["portfolio"] as const) : []),
		...(packages.length > 0 ? (["services"] as const) : []),
		...(hasBio(studio) ? (["about"] as const) : []),
		"contact",
	];
}

export const formatLocation = ({ city, country }: SiteStudio) =>
	[city, country].filter(Boolean).join(", ");

export function getHeroCover({ studio, albums }: SiteData): SiteMedia | null {
	return studio.cover ?? albums[0]?.cover ?? null;
}

/** Up to `count` distinct photos (excluding the hero) for collages. */
export function getFeaturedImages(site: SiteData, count: number): SiteMedia[] {
	const hero = getHeroCover(site)?.id;
	const picks: SiteMedia[] = [];
	// Take one photo per album first so collages show variety.
	for (const round of [0, 1, 2]) {
		for (const album of site.albums) {
			const media = album.items[round];
			if (media && media.type === "IMAGE" && media.id !== hero)
				picks.push(media);
			if (picks.length === count) return picks;
		}
	}
	return picks;
}

export function getAboutImage(site: SiteData): SiteMedia | null {
	return (
		site.studio.portrait ?? getFeaturedImages(site, 1)[0] ?? site.studio.cover
	);
}

/** First sentence of a text (for pull quotes), and the rest. */
export function splitLead(text: string): [string, string] {
	const match = text.match(/^([\s\S]+?[.!?])(\s+|$)/);
	if (!match) return [text, ""];
	return [match[1], text.slice(match[0].length).trim()];
}
