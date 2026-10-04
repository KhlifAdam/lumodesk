import { Store } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";
import { AppearanceForm } from "@/components/dashboard/website/appearance/appearance-form";
import { Button } from "@/components/ui/button";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { siteFontVariables } from "@/lib/public-site/fonts";
import { getStudio } from "@/services/studio/queries";

export default async function AppearancePage() {
	const t = await getTranslations("Site.appearance");
	const { photographerId } = await requirePhotographer();
	const studio = await getStudio(photographerId);

	return (
		<PageShell className={siteFontVariables}>
			<PageHeader title={t("title")} description={t("description")} />
			{studio ? (
				<AppearanceForm studio={studio} />
			) : (
				<EmptyState
					icon={Store}
					title={t("noStudio.title")}
					description={t("noStudio.description")}
					action={
						<Button asChild size="sm">
							<Link href="/dashboard/site">{t("noStudio.action")}</Link>
						</Button>
					}
				/>
			)}
		</PageShell>
	);
}
