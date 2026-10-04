import { getTranslations } from "next-intl/server";
import { LatestUploads } from "@/components/dashboard/overview/latest-uploads";
import { OverviewHeader } from "@/components/dashboard/overview/overview-header";
import { SetupChecklist } from "@/components/dashboard/overview/setup-checklist";
import { StatCard } from "@/components/dashboard/overview/stat-card";
import { PageShell } from "@/components/dashboard/shared/page-shell";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { getOverview } from "@/services/overview/queries";

export default async function OverviewPage() {
	const t = await getTranslations("Dashboard.Overview.stats");
	const { session, photographerId } = await requirePhotographer();
	const overview = await getOverview(photographerId);
	const { studio, counts } = overview;

	const siteStatus = !studio ? "notSetUp" : studio.published ? "live" : "draft";

	return (
		<PageShell>
			<OverviewHeader
				userName={session.user.name}
				hasStudio={studio !== null}
			/>

			<div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
				<StatCard label={t("media")} value={String(counts.media)} />
				<StatCard
					label={t("albums")}
					value={String(counts.albums)}
					detail={t("albumsDetail", { published: counts.publishedAlbums })}
				/>
				<StatCard
					label={t("packages")}
					value={String(counts.packages)}
					detail={t("packagesDetail", { active: counts.activePackages })}
				/>
				<StatCard
					label={t("site")}
					value={t(siteStatus)}
					accent={siteStatus === "live"}
				/>
			</div>

			<div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
				<SetupChecklist overview={overview} />
				<div className="xl:col-span-2">
					<LatestUploads items={overview.latestMedia} />
				</div>
			</div>
		</PageShell>
	);
}
