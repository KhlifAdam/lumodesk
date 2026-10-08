import { getFormatter, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import type { ProjectDetail } from "@/services/projects/types";
import { ProjectFinanceCard } from "./project-finance-card";

function Fact({ label, children }: { label: string; children: ReactNode }) {
	if (!children) return null;
	return (
		<div className="flex flex-col gap-0.5">
			<dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
				{label}
			</dt>
			<dd className="whitespace-pre-wrap break-words text-sm">{children}</dd>
		</div>
	);
}

function Card({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3">
			<h2 className="text-xs font-medium text-muted-foreground">{title}</h2>
			<dl className="grid gap-3 sm:grid-cols-2">{children}</dl>
		</section>
	);
}

const isUrl = (value: string) => /^https?:\/\//i.test(value);

/** Read-only sheet of everything entered in the project form. */
export async function ProjectFacts({ project }: { project: ProjectDetail }) {
	const t = await getTranslations("Projects.facts");
	const tService = await getTranslations("Projects.serviceTypes");
	const tMedia = await getTranslations("Projects.mediaTypes");
	const tLocation = await getTranslations("Projects.locationTypes");
	const format = await getFormatter();

	const date = (iso: string | null) =>
		iso
			? format.dateTime(new Date(iso), { dateStyle: "long", timeZone: "UTC" })
			: null;
	const when = [
		date(project.eventDate),
		project.startTime &&
			(project.endTime
				? `${project.startTime} – ${project.endTime}`
				: project.startTime),
	]
		.filter(Boolean)
		.join(" · ");

	return (
		<div className="grid gap-3 lg:grid-cols-2">
			<Card title={t("service")}>
				<Fact label={t("type")}>{tService(project.serviceType)}</Fact>
				<Fact label={t("media")}>{tMedia(project.mediaType)}</Fact>
				<Fact label={t("when")}>{when}</Fact>
				<Fact label={t("deadline")}>{date(project.deliveryDeadline)}</Fact>
				<Fact label={t("where")}>
					{isUrl(project.location) ? (
						<a
							href={project.location}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary underline-offset-2 hover:underline"
						>
							{t("openMap")}
						</a>
					) : (
						project.location
					)}
				</Fact>
				<Fact label={t("placeType")}>
					{project.locationType && tLocation(project.locationType)}
				</Fact>
				<Fact label={t("equipment")}>{project.equipment}</Fact>
				<Fact label={t("team")}>{project.team}</Fact>
				<Fact label={t("description")}>{project.description}</Fact>
			</Card>
			<div className="flex flex-col gap-3">
				<ProjectFinanceCard project={project} />
				<Card title={t("client")}>
					<Fact label={t("phone")}>{project.clientPhone}</Fact>
					<Fact label={t("contact")}>
						{[project.contactName, project.contactPhone]
							.filter(Boolean)
							.join(" · ")}
					</Fact>
					<Fact label={t("requests")}>{project.clientNotes}</Fact>
					<Fact label={t("internalNotes")}>{project.internalNotes}</Fact>
				</Card>
			</div>
		</div>
	);
}
