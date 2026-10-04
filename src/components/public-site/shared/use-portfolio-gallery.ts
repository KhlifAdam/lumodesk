"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { SiteAlbum, SiteMedia } from "@/services/public-site/types";

const ALL = "all";
const MAX_ITEMS_IN_ALL = 60;

function uniqueMedia(albums: SiteAlbum[]): SiteMedia[] {
	const seen = new Set<string>();
	return albums
		.flatMap((album) => album.items)
		.filter((item) => !seen.has(item.id) && seen.add(item.id));
}

/**
 * Behavior shared by every template's portfolio: album filter tabs and the
 * lightbox index. Templates only decide how the tiles are laid out.
 */
export function usePortfolioGallery(albums: SiteAlbum[]) {
	const t = useTranslations("PublicSite.portfolio");
	const [active, setActive] = useState(ALL);
	const [lightbox, setLightbox] = useState<number | null>(null);

	const items = useMemo(
		() =>
			active === ALL
				? uniqueMedia(albums).slice(0, MAX_ITEMS_IN_ALL)
				: (albums.find((album) => album.id === active)?.items ?? []),
		[active, albums],
	);

	const tabs = useMemo(
		() => [
			{ id: ALL, label: t("all") },
			...albums.map((album) => ({ id: album.id, label: album.title })),
		],
		[albums, t],
	);

	const selectTab = (id: string) => {
		setActive(id);
		setLightbox(null);
	};

	return { tabs, active, selectTab, items, lightbox, setLightbox };
}
