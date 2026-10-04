"use client";

import { type Messages, useTranslations } from "next-intl";

type AuthErrorKey = keyof Messages["Auth"]["errors"];

/**
 * Translated messages for Better Auth failures. The server's own message is
 * English-only, so we map its error `code` (e.g. INVALID_OTP) instead.
 */
export function useAuthError() {
	const t = useTranslations("Auth.errors");

	return {
		message: (error: { code?: string } | null | undefined) =>
			error?.code && t.has(error.code as AuthErrorKey)
				? t(error.code as AuthErrorKey)
				: t("generic"),
		network: t("network"),
	};
}
