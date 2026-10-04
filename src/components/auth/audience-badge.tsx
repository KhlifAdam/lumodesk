import { Camera, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AuthAudience } from "@/lib/auth/client-intent";

/** Repeats the chosen side above the form, so it is clear even on mobile. */
export function AudienceBadge({ audience }: { audience: AuthAudience }) {
	const t = useTranslations("Auth.badge");
	const Icon = audience === "client" ? UserRound : Camera;

	return (
		<span className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
			<Icon className="h-3.5 w-3.5" />
			{t(audience)}
		</span>
	);
}
