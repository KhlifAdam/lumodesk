import { CalendarDays, Images, MapPin } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { StageBadge } from "@/components/client-work/stage-badge";
import type { PortalProject } from "@/services/portal/types";
import { PROJECT_STAGES, stageIndex } from "@/services/projects/stages";

export async function PortalProjectCard({
	project,
}: {
	project: PortalProject;
}) {
	const t = await getTranslations("Portal.projects");
	const format = await getFormatter();
	const progress =
		((stageIndex(project.stage) + 1) / PROJECT_STAGES.length) * 100;

	return (
		<Link
			href={`/portal/projects/${project.id}`}
			className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-luminous-lg"
		>
			<div className="flex items-start justify-between gap-3">
				<p className="font-medium leading-snug group-hover:text-primary">
					{project.title}
				</p>
				<StageBadge stage={project.stage} />
			</div>
			<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
				{project.eventDate && (
					<span className="flex items-center gap-1">
						<CalendarDays className="h-3 w-3" />
						{format.dateTime(new Date(project.eventDate), {
							dateStyle: "medium",
							timeZone: "UTC",
						})}
					</span>
				)}
				{project.location && (
					<span className="flex items-center gap-1">
						<MapPin className="h-3 w-3" />
						{project.location}
					</span>
				)}
				<span className="flex items-center gap-1">
					<Images className="h-3 w-3" />
					{t("galleries", { count: project.sharedGalleryCount })}
				</span>
			</div>
			<div className="h-1 overflow-hidden rounded-full bg-muted">
				<div
					className="h-full rounded-full bg-primary transition-all duration-500"
					style={{ width: `${progress}%` }}
				/>
			</div>
		</Link>
	);
}
