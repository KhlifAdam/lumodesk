"use client";

import { type Messages, useTranslations } from "next-intl";

type ErrorKey = keyof Messages["Errors"];
type ValidationKey = keyof Messages["Validation"];

/**
 * Translates an ActionResult error code. Codes come from `Errors`, or from
 * `Validation` when a zod schema rejected the input (e.g. `invalidSlug`).
 * Anything else falls back to a generic message.
 */
export function useErrorMessage() {
	const tErrors = useTranslations("Errors");
	const tValidation = useTranslations("Validation");

	return (code: string | undefined) => {
		if (code && tErrors.has(code as ErrorKey)) return tErrors(code as ErrorKey);
		if (code && tValidation.has(code as ValidationKey))
			return tValidation(code as ValidationKey);
		return tErrors("generic");
	};
}
