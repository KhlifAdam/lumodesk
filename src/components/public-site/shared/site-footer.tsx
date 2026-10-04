import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import type { SiteData } from "@/services/public-site/types";
import { SocialLinks } from "./contact-parts";
import { SiteBrand } from "./site-brand";
import type { NavLink } from "./site-nav";

interface SiteFooterProps {
	site: SiteData;
	links: NavLink[];
	/** Per-template finishing (e.g. uppercase brand). */
	brandClassName?: string;
	className?: string;
}

export async function SiteFooter({
	site,
	links,
	brandClassName,
	className,
}: SiteFooterProps) {
	const { studio, i18n } = site;
	const t = await getTranslations({
		locale: i18n.locale,
		namespace: "PublicSite.footer",
	});

	return (
		<footer
			className={cn("site-border border-t px-6 pb-8 pt-14 md:px-12", className)}
		>
			<div className="mx-auto flex max-w-6xl flex-col gap-10">
				<div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
					<div className="flex max-w-xs flex-col gap-3">
						<SiteBrand studio={studio} className={brandClassName} />
						{studio.tagline && (
							<p className="site-muted text-sm leading-relaxed">
								{studio.tagline}
							</p>
						)}
					</div>
					<nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
						{links.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="site-muted transition-colors hover:text-[var(--s-fg)]"
							>
								{link.label}
							</a>
						))}
					</nav>
					<SocialLinks
						studio={studio}
						locale={i18n.locale}
						iconOnly
						className="flex gap-2"
						linkClassName="site-border site-muted flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-[var(--s-accent)] hover:text-[var(--s-accent)]"
					/>
				</div>
				<div className="site-border site-muted flex flex-col justify-between gap-2 border-t pt-6 text-xs md:flex-row">
					<span>
						{t("rights", { year: new Date().getFullYear(), name: studio.name })}
					</span>
					<span>{t("madeWith")}</span>
				</div>
			</div>
		</footer>
	);
}
