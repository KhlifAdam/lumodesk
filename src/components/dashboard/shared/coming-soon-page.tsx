import type { LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./empty-state";
import { PageHeader } from "./page-header";
import { PageShell } from "./page-shell";

type Section = "bookings" | "clients" | "messages";

/** Stand-in for dashboard sections that aren't built yet. */
export async function ComingSoonPage({
	section,
	icon,
}: {
	section: Section;
	icon: LucideIcon;
}) {
	const t = await getTranslations("Dashboard");

	return (
		<PageShell>
			<PageHeader
				title={t(`Nav.${section}`)}
				description={t(`ComingSoon.${section}.description`)}
				actions={
					<Badge variant="secondary" className="text-[11px]">
						{t("ComingSoon.badge")}
					</Badge>
				}
			/>
			<EmptyState
				icon={icon}
				title={t("ComingSoon.emptyTitle")}
				description={t(`ComingSoon.${section}.empty`)}
			/>
		</PageShell>
	);
}
