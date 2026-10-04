import { Camera, MessageCircle, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";
import { BrandMark } from "./brand-mark";

const LINKS = [
	{ key: "features", href: "#features" },
	{ key: "pricing", href: "#pricing" },
	{ key: "faq", href: "#faq" },
	{ key: "privacy", href: "/privacy" },
	{ key: "terms", href: "/terms" },
] as const;

const SOCIALS = [
	{ key: "instagram", icon: Camera },
	{ key: "twitter", icon: MessageCircle },
	{ key: "videos", icon: Play },
] as const;

export function Footer() {
	const t = useTranslations("Landing.footer");

	return (
		<footer className="mx-auto max-w-7xl px-5 py-10">
			<div className="flex flex-col items-center justify-between gap-6 border-b border-border pb-8 md:flex-row">
				<a
					href="#top"
					className="flex items-center gap-2 font-display text-sm font-bold"
				>
					<BrandMark /> {BRAND_NAME}
				</a>
				<div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
					{LINKS.map(({ key, href }) => (
						<a key={key} href={href}>
							{t(key)}
						</a>
					))}
				</div>
				<div className="flex gap-2">
					{SOCIALS.map(({ key, icon: Icon }) => (
						<Button key={key} variant="ghost" size="icon" aria-label={t(key)}>
							<Icon />
						</Button>
					))}
				</div>
			</div>
			<p className="pt-6 text-center text-[11px] text-muted-foreground md:text-left">
				{t("copyright", { year: new Date().getFullYear() })}
			</p>
		</footer>
	);
}
