import { Check } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import type { SitePackage } from "@/services/public-site/types";

/** Translations + price/duration formatting for any services layout. */
export async function getPackageFormatters(locale: Locale) {
	const t = await getTranslations({ locale, namespace: "PublicSite.services" });
	const format = await getFormatter({ locale });

	return {
		t,
		price: (pkg: SitePackage) =>
			format.number(pkg.price, {
				style: "currency",
				currency: pkg.currency,
				maximumFractionDigits: 0,
			}),
		hours: (pkg: SitePackage) =>
			pkg.durationMinutes
				? t("hours", { count: Number((pkg.durationMinutes / 60).toFixed(1)) })
				: null,
	};
}

export function PackageDeliverables({
	items,
	className,
}: {
	items: string[];
	className?: string;
}) {
	return (
		<ul className={cn("flex flex-col gap-2.5 text-sm", className)}>
			{items.map((item) => (
				<li key={item} className="flex items-start gap-2.5">
					<Check className="site-accent-text mt-0.5 h-4 w-4 shrink-0" />
					<span>{item}</span>
				</li>
			))}
		</ul>
	);
}
