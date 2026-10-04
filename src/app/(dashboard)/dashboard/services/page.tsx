import { getTranslations } from "next-intl/server";
import {
	NewPackageButton,
	PackageList,
} from "@/components/dashboard/services/package-list";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { listPackages } from "@/services/packages/queries";
import { pageParamsSchema } from "@/services/shared/pagination";

export default async function ServicesPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const t = await getTranslations("Services");
	const { page } = pageParamsSchema.parse(await searchParams);
	const { photographerId } = await requirePhotographer();
	const packages = await listPackages(photographerId, page);

	return (
		<PageShell>
			<PageHeader
				title={t("title")}
				description={t("description")}
				actions={<NewPackageButton />}
			/>
			<PackageList packages={packages} />
		</PageShell>
	);
}
