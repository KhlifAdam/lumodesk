import { type Locale, toLocale } from "@/i18n/config";
import en from "../../../messages/en.json";
import fr from "../../../messages/fr.json";

const SMS_MESSAGES = { en: en.Sms, fr: fr.Sms } as const;

type SmsKey = keyof typeof en.Sms;

/** A text message in the recipient's language, with `{name}` placeholders filled. */
export function smsText(
	locale: Locale | string | null | undefined,
	key: SmsKey,
	vars: Record<string, string> = {},
) {
	const template = SMS_MESSAGES[toLocale(locale ?? undefined)][key];
	return template.replace(
		/\{(\w+)\}/g,
		(match, name: string) => vars[name] ?? match,
	);
}
