import Link from "next/link";
import { useTranslations } from "next-intl";
import { AUTH_PATHS, type AuthAudience } from "@/lib/auth/client-intent";

/** Small pointer to the other side's page, for someone who landed on the wrong one. */
export function AudienceSwitch({
	audience,
	screen,
}: {
	audience: AuthAudience;
	screen: "login" | "register";
}) {
	const t = useTranslations("Auth.audience.switch");
	const other: AuthAudience = audience === "client" ? "photographer" : "client";

	return (
		<p className="border-t border-border pt-5 text-center text-sm text-muted-foreground">
			{t(`${other}.prompt`)}{" "}
			<Link
				href={AUTH_PATHS[other][screen]}
				className="font-medium text-primary underline-offset-4 hover:underline"
			>
				{t(`${other}.cta`)}
			</Link>
		</p>
	);
}
