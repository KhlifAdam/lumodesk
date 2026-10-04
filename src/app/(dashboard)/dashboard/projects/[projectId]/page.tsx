import { ArrowLeft, CalendarDays, Images, MapPin, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { GalleryCard } from "@/components/client-work/gallery-card";
import { NewGalleryDialog } from "@/components/dashboard/projects/new-gallery-dialog";
import { ProjectClientCard } from "@/components/dashboard/projects/project-client-card";
import { ProjectDeleteButton } from "@/components/dashboard/projects/project-delete-button";
import { ProjectFormDialog } from "@/components/dashboard/projects/project-form-dialog";
import { ProjectStageControl } from "@/components/dashboard/projects/project-stage-control";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";
import { Button } from "@/components/ui/button";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { getProject } from "@/services/projects/queries";

export default async function ProjectPage({
	params,
}: {
	params: Promise<{ projectId: string }>;
}) {
	const t = await getTranslations("Projects.detail");
	const format = await getFormatter();
	const { projectId } = await params;
	const { photographerId } = await requirePhotographer();
	const project = await getProject(photographerId, projectId);
	if (!project) notFound();

	const formValues = {
		id: project.id,
		title: project.title,
		description: project.description,
		location: project.location,
		eventDate: project.eventDate?.slice(0, 10) ?? "",
	};

	return (
		<PageShell>
			<Link
				href="/dashboard/projects"
				className="flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft className="h-3.5 w-3.5" />
				{t("back")}
			</Link>
			<PageHeader
				title={project.title}
				actions={
					<>
						<ProjectDeleteButton projectId={project.id} />
						<ProjectFormDialog
							project={formValues}
							trigger={
								<Button
									size="sm"
									variant="outline"
									className="h-7 gap-1.5 text-xs"
								>
									<Pencil className="h-3.5 w-3.5" />
									{t("edit")}
								</Button>
							}
						/>
					</>
				}
			/>
			<ProjectClientCard projectId={project.id} client={project.client} />
			<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
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
			<ProjectStageControl projectId={project.id} stage={project.stage} />
			<section className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<h2 className="text-sm font-semibold">{t("galleries")}</h2>
					<NewGalleryDialog projectId={project.id} />
				</div>
				{project.galleries.length === 0 ? (
					<EmptyState
						icon={Images}
						title={t("noGalleries")}
						description={t("noGalleriesHint")}
					/>
				) : (
					<div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
						{project.galleries.map((gallery) => (
							<GalleryCard
								key={gallery.id}
								gallery={gallery}
								href={`/dashboard/projects/${project.id}/galleries/${gallery.id}`}
								showShareState
							/>
						))}
					</div>
				)}
			</section>
		</PageShell>
	);
}
