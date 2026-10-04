import { Camera, UserRound } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AUTH_PATHS, type AuthAudience } from "@/lib/auth/client-intent";
import { cn } from "@/lib/utils";

const OPTIONS = [
	{ audience: "photographer", icon: Camera },
	{ audience: "client", icon: UserRound },
] as const;

/** "Photographer | Client" toggle; each side is its own page. */
export function AudienceSwitch({
	audience,
	screen,
}: {
	audience: AuthAudience;
	screen: "login" | "register";
}) {
	const t = useTranslations("Auth.audience");

	return (
		<div className="grid grid-cols-2 rounded-xl border border-border bg-muted/40 p-1">
			{OPTIONS.map(({ audience: option, icon: Icon }) => (
				<Link
					key={option}
					href={AUTH_PATHS[option][screen]}
					aria-current={option === audience ? "page" : undefined}
					className={cn(
						"flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all duration-300",
						option === audience
							? "bg-background text-foreground shadow-sm"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					<Icon className="h-4 w-4" />
					{t(option)}
				</Link>
			))}
		</div>
	);
}
