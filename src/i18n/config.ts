export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined): value is Locale {
	return LOCALES.includes(value as Locale);
}

/** Coerces a stored value to a supported locale. */
export function toLocale(value: string | undefined): Locale {
	return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Keeps only supported locales (never empty). */
export function toLocales(values: string[]): Locale[] {
	const valid = values.filter(isLocale);
	return valid.length > 0 ? valid : [DEFAULT_LOCALE];
}

/** First candidate the site supports, else the site's default. */
export function pickLocale(
	candidates: (string | undefined)[],
	supported: readonly Locale[],
	fallback: Locale,
): Locale {
	const match = candidates.find(
		(candidate): candidate is Locale =>
			isLocale(candidate) && supported.includes(candidate),
	);
	return match ?? fallback;
}
