import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { AUTH_PATHS } from "@/lib/auth/client-intent";
import { cn } from "@/lib/utils";

/** Entry point to the client portal; `_top` escapes the preview frame. */
export function ClientAreaLink({ className }: { className?: string }) {
	const t = useTranslations("PublicSite.controls");

	return (
		<a
			href={AUTH_PATHS.client.login}
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
