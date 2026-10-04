import type { z } from "zod";

/**
 * Uniform Server Action result. `error` is an i18n key under `Errors`,
 * so the client can translate it.
 */
export type ActionResult<T = void> =
	| { ok: true; data: T }
	| { ok: false; error: string };

export function ok<T>(data: T): ActionResult<T>;
export function ok(): ActionResult<void>;
export function ok<T>(data?: T) {
	return { ok: true, data } as ActionResult<T>;
}

export function fail(error: string): ActionResult<never> {
	return { ok: false, error };
}

/** Maps a zod failure to its first issue message, falling back to `invalidInput`. */
export function failFromZod(error: z.ZodError): ActionResult<never> {
	const message = error.issues[0]?.message;
	return fail(
		message && /^[a-zA-Z]+$/.test(message) ? message : "invalidInput",
	);
}
