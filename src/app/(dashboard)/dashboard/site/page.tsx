import { Eye } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";
import { StudioProfileForm } from "@/components/dashboard/website/profile/studio-profile-form";
import { PublicUrlBar } from "@/components/dashboard/website/public-url-bar";
import { StudioSetupCard } from "@/components/dashboard/website/studio-setup-card";
import { Button } from "@/components/ui/button";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { getStudio } from "@/services/studio/queries";

export default async function SiteProfilePage() {
	const t = await getTranslations("Site.profile");
	const { session, photographerId } = await requirePhotographer();
	const studio = await getStudio(photographerId);

	return (
		<PageShell>
			<PageHeader
				title={t("title")}
				description={t("description")}
				actions={
					studio && (
						<>
							<Button
								asChild
								variant="outline"
								size="sm"
								className="h-8 gap-1.5"
							>
								<Link href="/preview" target="_blank">
									<Eye className="h-3.5 w-3.5" />
									{t("preview")}
								</Link>
							</Button>
							<PublicUrlBar
								url={studio.publicUrl}
								published={studio.published}
							/>
						</>
					)
				}
			/>
			{studio ? (
				<StudioProfileForm studio={studio} />
			) : (
				<StudioSetupCard defaultName={session.user.name} />
			)}
		</PageShell>
	);
}
