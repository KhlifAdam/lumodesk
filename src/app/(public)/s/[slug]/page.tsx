import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SiteRenderer } from "@/components/public-site/site-renderer";
import { LOCALE_COOKIE } from "@/i18n/config";
import { getPublicSite } from "@/services/public-site/queries";

type Props = {
	params: Promise<{ slug: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Visitor's language preferences, most explicit first. */
async function localeCandidates(searchParams: Props["searchParams"]) {
	const { lang } = await searchParams;
	const cookie = (await cookies()).get(LOCALE_COOKIE)?.value;
	const browser = ((await headers()).get("accept-language") ?? "")
		.split(",")
		.map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
	return [typeof lang === "string" ? lang : undefined, cookie, ...browser];
}

export async function generateMetadata({
	params,
	searchParams,
}: Props): Promise<Metadata> {
	const result = await getPublicSite(
		(await params).slug,
		await localeCandidates(searchParams),
	);
	if (result.status !== "live") return { robots: { index: false } };

	const { name, tagline } = result.site.studio;
	return {
		title: tagline ? `${name} — ${tagline}` : name,
		description: tagline || undefined,
	};
}

/** A photographer's public site, exactly as rendered in the dashboard preview. */
export default async function PublicSitePage({ params, searchParams }: Props) {
	const result = await getPublicSite(
		(await params).slug,
		await localeCandidates(searchParams),
	);
	if (result.status === "missing") notFound();

	if (result.status === "draft") {
		const t = await getTranslations("PublicSite.comingSoon");
		return (
			<main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
				<h1 className="font-display text-3xl font-bold">
					{t("title", { name: result.name })}
				</h1>
				<p className="max-w-md text-sm text-muted-foreground">
					{t("description")}
				</p>
			</main>
		);
	}

	return <SiteRenderer site={result.site} />;
}
