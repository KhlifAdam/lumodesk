import { z } from "zod";

const coreSchema = z.object({
	DATABASE_URL: z.url(),
	BETTER_AUTH_SECRET: z.string().min(1),
	BETTER_AUTH_URL: z.url(),
	GITHUB_CLIENT_ID: z.string().optional(),
	GITHUB_CLIENT_SECRET: z.string().optional(),
	GOOGLE_CLIENT_ID: z.string().optional(),
	GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const r2Schema = z.object({
	R2_ACCOUNT_ID: z.string().min(1),
	R2_ACCESS_KEY_ID: z.string().min(1),
	R2_SECRET_ACCESS_KEY: z.string().min(1),
	R2_BUCKET: z.string().min(1),
	// Public CDN base for stored media keys; trailing slash is normalized away.
	R2_PUBLIC_URL: z.url().transform((url) => url.replace(/\/+$/, "")),
});

/** Core server env, validated once at startup. */
export const env = coreSchema.parse(process.env);

let r2Env: z.infer<typeof r2Schema> | undefined;

/** R2 env, validated lazily so the app boots without storage configured. */
export function getR2Env() {
	r2Env ??= r2Schema.parse(process.env);
	return r2Env;
}
