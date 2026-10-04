import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE } from "./config";

// The dashboard's locale comes from a cookie (no locale segment in URLs).
// Public sites pass an explicit `locale` (getTranslations({ locale })), which
// must win so a site renders in its own language.
export default getRequestConfig(async ({ locale: requested }) => {
	const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
	const locale = isLocale(requested)
		? requested
		: isLocale(cookieLocale)
			? cookieLocale
			: DEFAULT_LOCALE;

	return {
		locale,
		messages: (await import(`../../messages/${locale}.json`)).default,
	};
});
