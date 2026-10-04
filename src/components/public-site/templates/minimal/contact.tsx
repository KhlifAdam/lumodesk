import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/services/public-site/types";
import { ContactDetails, SocialLinks } from "../../shared/contact-parts";
import { Reveal } from "../../shared/reveal";

/** One clear invitation: big email link, booking button, details, socials. */
export async function MinimalContact({ site }: { site: SiteData }) {
	const { studio, i18n } = site;
	const t = await getTranslations({
		locale: i18n.locale,
		namespace: "PublicSite.contact",
	});

	return (
		<section id="contact" className="site-card px-6 py-24 md:px-8 md:py-32">
			<Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
				<span className="site-accent-text text-xs font-semibold uppercase tracking-[0.3em]">
					{t("eyebrow")}
				</span>
				<h2 className="site-heading text-4xl tracking-tight md:text-6xl">
					{t("title")}
				</h2>
				<p className="site-muted max-w-lg text-lg">{t("subtitle")}</p>
				{studio.email && (
					<a
						href={`mailto:${studio.email}`}
						className="site-heading group inline-flex items-center gap-2 text-2xl underline decoration-[var(--s-accent)] decoration-2 underline-offset-8 md:text-4xl"
					>
						{studio.email}
						<ArrowUpRight className="h-6 w-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
					</a>
				)}
				{studio.bookingEnabled && studio.email && (
					<a
						href={`mailto:${studio.email}`}
						className="site-accent-bg inline-flex h-12 items-center rounded-full px-8 text-sm font-semibold transition-transform hover:-translate-y-0.5"
					>
						{t("cta")}
					</a>
				)}
				<ContactDetails
					studio={{ ...studio, email: "" }}
					className="site-muted flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm"
				/>
				<SocialLinks
					studio={studio}
					locale={i18n.locale}
					className="flex flex-wrap justify-center gap-2"
					linkClassName="site-border flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors hover:border-[var(--s-accent)] hover:text-[var(--s-accent)]"
				/>
			</Reveal>
		</section>
	);
}
