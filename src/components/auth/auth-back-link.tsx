import { ArrowLeft, House } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AUTH_PATHS, type AuthAudience } from "@/lib/auth/client-intent";

const LINK =
	"flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground";

/**
 * Two ways out above the auth forms: back to this side's welcome page, or to
 * the app's main welcome page where visitors pick their side.
 */
export function AuthBackLink({ audience }: { audience: AuthAudience }) {
	const t = useTranslations("Auth.backLink");

	return (
		<nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
			<Link href={AUTH_PATHS[audience].welcome} className={LINK}>
				<ArrowLeft className="h-4 w-4" />
				{t(audience)}
			</Link>
			<Link href="/" className={LINK}>
				<House className="h-4 w-4" />
				{t("home")}
			</Link>
		</nav>
	);
}
