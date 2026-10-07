import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { GenericWelcome } from "@/components/client-welcome/generic-welcome";
import { StudioWelcome } from "@/components/client-welcome/studio-welcome";
import { AUTH_PATHS } from "@/lib/auth/client-intent";
import { auth } from "@/lib/auth/server";
import { BRAND_NAME } from "@/lib/brand";
import { getLocaleCandidates } from "@/lib/public-site/locale-candidates";
import { getPublicSite } from "@/services/public-site/queries";

const slugSchema = z.string().regex(/^[a-z0-9-]{1,60}$/);

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("ClientWelcome");
	return {
		title: `${t("metaTitle")} | ${BRAND_NAME}`,
		robots: { index: false },
	};
}

/**
 * Where a studio's site sends its clients (`/client?studio=slug`): a welcome
 * in that studio's look before they sign in or create an account.
 */
export default async function ClientWelcomePage({
	searchParams,
}: {
	searchParams: Promise<{ studio?: string; lang?: string }>;
}) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (session) redirect(AUTH_PATHS.client.home);

	const { studio, lang } = await searchParams;
	const slug = slugSchema.safeParse(studio);
	if (!slug.success) return <GenericWelcome />;

	const result = await getPublicSite(
		slug.data,
		await getLocaleCandidates(lang),
	);
	return result.status === "live" ? (
		<StudioWelcome site={result.site} />
	) : (
		<GenericWelcome />
	);
}
