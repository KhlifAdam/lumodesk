"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { useSiteTheme } from "./site-shell";

interface SiteControlsProps {
	locale: Locale;
	locales: Locale[];
	className?: string;
}

/** Language switcher (when several) + light/dark toggle (when allowed). */
export function SiteControls({
	locale,
	locales,
	className,
}: SiteControlsProps) {
	const t = useTranslations("PublicSite.controls");
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { canToggle, isDark, toggle } = useSiteTheme();

	const hrefFor = (target: Locale) => {
		const query = new URLSearchParams(searchParams);
		query.set("lang", target);
		return `${pathname}?${query}`;
	};

	if (locales.length < 2 && !canToggle) return null;

	return (
		<div className={cn("flex items-center gap-3", className)}>
			{locales.length > 1 && (
				<nav
					aria-label={t("language")}
					className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider"
				>
					{locales.map((item, index) => (
						<span key={item} className="flex items-center gap-1">
							{index > 0 && <span className="opacity-30">/</span>}
							<Link
								href={hrefFor(item)}
								scroll={false}
								hrefLang={item}
								aria-current={item === locale ? "true" : undefined}
								className={cn(
									"transition-opacity",
									item === locale
										? "opacity-100"
										: "opacity-50 hover:opacity-100",
								)}
							>
								{item}
							</Link>
						</span>
					))}
				</nav>
			)}
			{canToggle && (
				<button
					type="button"
					onClick={toggle}
					aria-label={isDark ? t("toLight") : t("toDark")}
					className="flex h-8 w-8 items-center justify-center rounded-full border border-current/20 transition-colors hover:border-current/50"
				>
					{isDark ? (
						<Sun className="h-3.5 w-3.5" />
					) : (
						<Moon className="h-3.5 w-3.5" />
					)}
				</button>
			)}
		</div>
	);
}
