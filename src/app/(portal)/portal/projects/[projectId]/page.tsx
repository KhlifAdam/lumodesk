import {
	ArrowLeft,
	CalendarDays,
	Images,
	MapPin,
	MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { GalleryCard } from "@/components/client-work/gallery-card";
import { StageTimeline } from "@/components/client-work/stage-timeline";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { StudioHeading } from "@/components/portal/studio-heading";
import { Button } from "@/components/ui/button";
import { requireClient } from "@/lib/auth/require-client";
import { getPortalProject } from "@/services/portal/queries";

export default async function PortalProjectPage({
	params,
}: {
	params: Promise<{ projectId: string }>;
}) {
	const t = await getTranslations("Portal.project");
	const format = await getFormatter();
	const { projectId } = await params;
	const { clientId } = await requireClient();
	const project = await getPortalProject(clientId, projectId);
	if (!project) notFound();

	return (
		<>
			<Link
				href="/portal"
				className="flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft className="h-3.5 w-3.5" />
				{t("back")}
			</Link>
			<div className="flex flex-col gap-3">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<StudioHeading
						studio={project.studio}
						fallbackName={project.photographerName}
					/>
					<Button
						asChild
						variant="outline"
						size="sm"
						className="h-8 gap-1.5 text-xs"
					>
						<Link href={`/portal/messages?studio=${project.photographerId}`}>
							<MessageSquare className="h-3.5 w-3.5" />
							{t("messageStudio")}
						</Link>
					</Button>
				</div>
				<h1 className="font-display text-2xl font-bold tracking-tight">
					{project.title}
				</h1>
				<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
					{project.eventDate && (
						<span className="flex items-center gap-1">
							<CalendarDays className="h-3 w-3" />
							{format.dateTime(new Date(project.eventDate), {
								dateStyle: "long",
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
				</div>
				{project.description && (
					<p className="max-w-3xl whitespace-pre-wrap text-sm text-muted-foreground">
						{project.description}
					</p>
				)}
			</div>
			<section className="rounded-xl border border-border bg-card p-3">
				<h2 className="mb-2 text-xs font-medium text-muted-foreground">
					{t("progress")}
				</h2>
				<StageTimeline stage={project.stage} />
			</section>
			<section className="flex flex-col gap-3">
				<h2 className="text-sm font-semibold">{t("galleries")}</h2>
				{project.galleries.length === 0 ? (
					<EmptyState
						icon={Images}
						title={t("noGalleries")}
						description={t("noGalleriesHint")}
					/>
				) : (
					<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
						{project.galleries.map((gallery) => (
							<GalleryCard
								key={gallery.id}
								gallery={gallery}
								href={`/portal/galleries/${gallery.id}`}
							/>
						))}
					</div>
				)}
			</section>
		</>
	);
}
