import { Camera, UserRound } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AUTH_PATHS } from "@/lib/auth/client-intent";
import { cn } from "@/lib/utils";
import { SIDE_TONES } from "./audience-card";

const BUTTON =
	"flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5";

/** Closing band: the two ways in, once more, for visitors who scrolled down. */
export function HomeFinalCta() {
	const t = useTranslations("Home.final");

	return (
		<section className="mx-auto w-full max-w-6xl px-5 pb-20">
			<div className="relative overflow-hidden rounded-3xl border border-border bg-card/70 px-6 py-14 text-center shadow-2xl backdrop-blur-xl md:px-12">
				<div className="pointer-events-none absolute inset-0 mesh-glow opacity-70" />
				<div className="relative">
					<h2 className="text-balance font-display text-3xl font-semibold md:text-4xl">
						{t("title")}
					</h2>
					<p className="mx-auto mt-3 max-w-xl text-muted-foreground">
						{t("subtitle")}
					</p>
					<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
						<Link
							href={AUTH_PATHS.photographer.welcome}
							className={cn(BUTTON, SIDE_TONES.studio.button)}
						>
							<Camera className="h-4 w-4" />
							{t("studio")}
						</Link>
						<Link
							href={AUTH_PATHS.client.welcome}
							className={cn(BUTTON, SIDE_TONES.client.button)}
						>
							<UserRound className="h-4 w-4" />
							{t("client")}
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
