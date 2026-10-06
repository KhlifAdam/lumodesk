import { DEFAULT_LOCALE, type Locale, toLocale } from "@/i18n/config";
import en from "../../../messages/en.json";
import fr from "../../../messages/fr.json";

const MAIL_MESSAGES = { en: en.Mail, fr: fr.Mail } as const;

/** Mail copy in one language. */
export function mailCopy(locale: Locale) {
	return MAIL_MESSAGES[locale];
}

/**
 * Language of an email: the recipient's saved language, else the first
 * fallback (e.g. the sender's, for someone with no account yet), else English.
 */
export function resolveMailLocale(
	...candidates: (string | null | undefined)[]
): Locale {
	const found = candidates.find((value) => value === "en" || value === "fr");
	return found ? toLocale(found) : DEFAULT_LOCALE;
}
