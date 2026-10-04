import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { SOCIAL_ICONS } from "@/lib/public-site/social-icons";
import type { SiteStudio } from "@/services/public-site/types";
import { SOCIAL_KEYS } from "@/services/studio/schemas";
import { formatLocation } from "./site-helpers";

/** Email / phone / location lines; the template provides the layout classes. */
export function ContactDetails({
	studio,
	className,
}: {
	studio: SiteStudio;
	className: string;
}) {
	const details = [
		{ icon: Mail, value: studio.email, href: `mailto:${studio.email}` },
		{
			icon: Phone,
			value: studio.phone,
			href: `tel:${studio.phone.replace(/\s/g, "")}`,
		},
		{ icon: MapPin, value: formatLocation(studio), href: undefined },
	].filter((detail) => detail.value);

	if (details.length === 0) return null;

	return (
		<ul className={className}>
			{details.map(({ icon: Icon, value, href }) => (
				<li key={value} className="flex items-center gap-2.5">
					<Icon className="site-accent-text h-4 w-4 shrink-0" />
					{href ? (
						<a
							href={href}
							className="transition-colors hover:text-[var(--s-accent)]"
						>
							{value}
						</a>
					) : (
						<span>{value}</span>
					)}
				</li>
			))}
		</ul>
	);
}

/** Links for every filled-in social profile. */
export async function SocialLinks({
	studio,
	locale,
	className,
	linkClassName,
	iconOnly = false,
}: {
	studio: SiteStudio;
	locale: Locale;
	className: string;
	linkClassName: string;
	iconOnly?: boolean;
}) {
	const t = await getTranslations({
		locale,
		namespace: "Site.profile.socials",
	});
	const socials = SOCIAL_KEYS.filter((key) => studio.socials[key]);

	if (socials.length === 0) return null;

	return (
		<ul className={className}>
			{socials.map((key) => {
				const Icon = SOCIAL_ICONS[key];
				return (
					<li key={key}>
						<a
							href={studio.socials[key]}
							target="_blank"
							rel="noreferrer noopener"
							aria-label={iconOnly ? t(key) : undefined}
							className={linkClassName}
						>
							<Icon className="h-4 w-4" />
							{!iconOnly && t(key)}
						</a>
					</li>
				);
			})}
		</ul>
	);
}
