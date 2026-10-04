"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { SiteControls } from "./site-controls";
import type { NavLink } from "./site-nav";

interface MobileNavProps {
	links: NavLink[];
	locale: Locale;
	locales: Locale[];
	className?: string;
}

/**
 * Full-screen menu for small screens. Rendered inside the site (not a portal)
 * so it inherits the site's colors and fonts.
 */
export function MobileNav({
	links,
	locale,
	locales,
	className,
}: MobileNavProps) {
	const t = useTranslations("PublicSite.controls");
	const [open, setOpen] = useState(false);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<div className={cn("md:hidden", className)}>
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label={t("menu")}
				aria-expanded={open}
				className="flex h-9 w-9 items-center justify-center"
			>
				<Menu className="h-5 w-5" />
			</button>
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="site-bg site-fg fixed inset-0 z-50 flex flex-col px-6 py-6"
					>
						<div className="flex justify-end">
							<button
								type="button"
								onClick={() => setOpen(false)}
								aria-label={t("close")}
								className="flex h-9 w-9 items-center justify-center"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						<nav className="flex flex-1 flex-col justify-center gap-6">
							{links.map((link, index) => (
								<motion.a
									key={link.href}
									href={link.href}
									onClick={() => setOpen(false)}
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.05 * index + 0.1 }}
									className="site-heading text-4xl"
								>
									{link.label}
								</motion.a>
							))}
						</nav>
						<SiteControls locale={locale} locales={locales} />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
