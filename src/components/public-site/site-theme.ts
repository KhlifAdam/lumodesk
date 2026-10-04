import type { CSSProperties } from "react";
import type { ThemeMode } from "@/generated/prisma/client";
import { FONT_PAIR_STACKS } from "@/lib/public-site/design";
import type { SiteDesign } from "@/services/studio/schemas";
import type { SiteColors, SitePalette } from "./templates/types";

function luminance(hex: string) {
	const [r, g, b] = [1, 3, 5].map((i) => {
		const channel = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
		return channel <= 0.03928
			? channel / 12.92
			: ((channel + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Text color that stays readable on top of the accent color. */
export function readableOn(hex: string) {
	return luminance(hex) > 0.4 ? "#111111" : "#ffffff";
}

const schemeVars = (scheme: "light" | "dark", colors: SiteColors) =>
	Object.fromEntries(
		Object.entries(colors).map(([name, value]) => [
			`--s-${scheme}-${name}`,
			value,
		]),
	);

/** CSS variables consumed by `[data-site-theme]` and the `site-*` utilities. */
export function siteStyle(
	{ accentColor, fontPair }: SiteDesign,
	palette: SitePalette,
): CSSProperties {
	const fonts = FONT_PAIR_STACKS[fontPair];
	return {
		...schemeVars("light", palette.light),
		...schemeVars("dark", palette.dark),
		"--s-accent": accentColor,
		"--s-accent-fg": readableOn(accentColor),
		"--s-heading": fonts.heading,
		"--s-body": fonts.body,
	} as CSSProperties;
}

/** Initial `data-site-theme` for a mode; BOTH follows the visitor's OS. */
export function initialSiteTheme(mode: ThemeMode) {
	if (mode === "LIGHT") return "light";
	if (mode === "DARK") return "dark";
	return "system";
}
