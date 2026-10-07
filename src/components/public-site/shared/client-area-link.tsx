"use client";

import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { AUTH_PATHS } from "@/lib/auth/client-intent";
import { cn } from "@/lib/utils";
import { useStudioSlug } from "./site-shell";

/**
 * Entry point to the client space: the welcome page of this studio. `_top`
 * escapes the preview frame. Demo data has no slug, so it gets the generic one.
 */
export function ClientAreaLink({ className }: { className?: string }) {
	const t = useTranslations("PublicSite.controls");
	const slug = useStudioSlug();
	const { welcome } = AUTH_PATHS.client;

	return (
		<a
			href={slug ? `${welcome}?studio=${encodeURIComponent(slug)}` : welcome}
			target="_top"
			className={cn(
				"flex h-8 items-center gap-1.5 rounded-full border border-current/20 px-3 text-xs font-medium transition-colors hover:border-current/50",
				className,
			)}
		>
			<UserRound className="h-3.5 w-3.5" />
			{t("clientArea")}
		</a>
	);
}
