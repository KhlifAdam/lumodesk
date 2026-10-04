import "server-only";

import { toLocale, toLocales } from "@/i18n/config";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { toMediaItem } from "@/services/media/queries";
import { SOCIAL_KEYS, type SocialKey } from "./schemas";
import type { StudioData } from "./types";

export function studioPublicUrl(slug: string) {
	return `${env.BETTER_AUTH_URL.replace(/\/$/, "")}/s/${slug}`;
}

export function toSocials(value: unknown): Record<SocialKey, string> {
	const source = (value ?? {}) as Partial<Record<SocialKey, unknown>>;
	return Object.fromEntries(
		SOCIAL_KEYS.map((key) => [
			key,
			typeof source[key] === "string" ? source[key] : "",
		]),
	) as Record<SocialKey, string>;
}

export async function getStudio(
	photographerId: string,
): Promise<StudioData | null> {
	const studio = await db.studio.findUnique({
		where: { photographerId },
		include: { logo: true, cover: true },
	});
	if (!studio) return null;

	return {
		id: studio.id,
		name: studio.name,
		slug: studio.slug,
		tagline: studio.tagline ?? "",
		bio: studio.bio ?? "",
		email: studio.email ?? "",
		phone: studio.phone ?? "",
		city: studio.city ?? "",
		country: studio.country ?? "",
		socials: toSocials(studio.socials),
		logoMediaId: studio.logoMediaId,
		coverMediaId: studio.coverMediaId,
		published: studio.published,
		bookingEnabled: studio.bookingEnabled,
		template: studio.template,
		accentColor: studio.accentColor,
		fontPair: studio.fontPair,
		themeMode: studio.themeMode,
		locales: toLocales(studio.locales),
		defaultLocale: toLocale(studio.defaultLocale),
		logo: studio.logo ? toMediaItem(studio.logo) : null,
		cover: studio.cover ? toMediaItem(studio.cover) : null,
		publicUrl: studioPublicUrl(studio.slug),
	};
}

/** Lightweight lookup for the sidebar. */
export function getStudioSummary(photographerId: string) {
	return db.studio.findUnique({
		where: { photographerId },
		select: { name: true, slug: true, published: true },
	});
}

export async function isSlugAvailable(slug: string, photographerId: string) {
	const owner = await db.studio.findUnique({
		where: { slug },
		select: { photographerId: true },
	});
	return !owner || owner.photographerId === photographerId;
}
