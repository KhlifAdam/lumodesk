import Link from "next/link";
import { BrandMark } from "@/components/landing/brand-mark";
import { LanguageSwitcher } from "@/components/landing/language-switcher";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { BRAND_NAME } from "@/lib/brand";

/** Slim bar of the hub: brand, language and theme only (each side has its own pages). */
export function HomeHeader() {
	return (
		<header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
			<Link
				href="/"
				className="flex items-center gap-2.5 font-display text-sm font-bold"
			>
				<BrandMark /> {BRAND_NAME}
			</Link>
			<div className="flex items-center gap-1.5">
				<LanguageSwitcher />
				<ThemeToggle />
			</div>
		</header>
	);
}
