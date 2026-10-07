import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AUTH_PATHS } from "@/lib/auth/client-intent";

/** Client sign-in and sign-up lead back to the welcome page they came from. */
export function ClientBackLink() {
	const t = useTranslations("Auth.client");

	return (
		<Link
			href={AUTH_PATHS.client.welcome}
			className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft className="h-4 w-4" />
			{t("back")}
		</Link>
	);
}
