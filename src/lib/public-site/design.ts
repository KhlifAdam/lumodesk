import type { FontPair, SiteTemplate } from "@/generated/prisma/client";

export const SITE_TEMPLATE_IDS: SiteTemplate[] = [
	"MINIMAL",
	"EDITORIAL",
	"BOLD",
];

export const FONT_PAIR_STACKS: Record<
	FontPair,
	{ heading: string; body: string }
> = {
	MODERN: { heading: "var(--font-manrope)", body: "var(--font-dm-sans)" },
	CLASSIC: { heading: "var(--font-playfair)", body: "var(--font-source-sans)" },
	ELEGANT: { heading: "var(--font-cormorant)", body: "var(--font-montserrat)" },
};

/** Curated accent swatches; any hex is still allowed. */
export const ACCENT_PRESETS = [
	"#c8a96e",
	"#e07a5f",
	"#d4a373",
	"#81b29a",
	"#3d8a7a",
	"#5b8def",
	"#7c6cf2",
	"#e5989b",
	"#1f1f1f",
	"#f2f2f2",
] as const;
