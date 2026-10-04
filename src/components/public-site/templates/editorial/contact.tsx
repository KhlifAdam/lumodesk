import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/services/public-site/types";
import { ContactDetails, SocialLinks } from "../../shared/contact-parts";
import { Reveal } from "../../shared/reveal";

/** Two columns: the invitation on the left, details and socials on the right. */
export async function EditorialContact({ site }: { site: SiteData }) {
	const { studio, i18n } = site;
	const t = await getTranslations({
		locale: i18n.locale,
		namespace: "PublicSite.contact",
	});

	return (
		<section id="contact" className="site-card px-6 py-24 md:px-12 md:py-32">
			<div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-12 md:items-center">
				<Reveal className="flex flex-col items-start gap-6 md:col-span-7">
					<span className="site-accent-text text-xs font-semibold uppercase tracking-[0.3em]">
						{t("eyebrow")}
					</span>
					<h2 className="site-heading text-5xl leading-[0.95] tracking-tight md:text-7xl">
						{t("title")}
					</h2>
					<p className="site-muted max-w-md text-lg">{t("subtitle")}</p>
					{studio.bookingEnabled && studio.email && (
						<a
							href={`mailto:${studio.email}`}
							className="site-accent-bg mt-2 inline-flex h-12 items-center rounded-full px-8 text-sm font-semibold transition-opacity hover:opacity-90"
						>
							{t("cta")}
						</a>
					)}
				</Reveal>
				<Reveal
					delay={0.15}
					className="site-border flex flex-col gap-8 border-t pt-10 md:col-span-5 md:border-l md:border-t-0 md:pl-12 md:pt-0"
				>
					<ContactDetails
						studio={studio}
						className="flex flex-col gap-4 text-lg"
					/>
					<SocialLinks
						studio={studio}
						locale={i18n.locale}
						className="grid grid-cols-2 gap-x-6 gap-y-3"
						linkClassName="site-muted flex items-center gap-2 text-sm underline-offset-4 transition-colors hover:text-[var(--s-accent)] hover:underline"
					/>
				</Reveal>
			</div>
		</section>
	);
}
