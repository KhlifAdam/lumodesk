import { ArrowLeft, FolderKanban, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ClientNotesForm } from "@/components/dashboard/clients/client-notes-form";
import { ProjectFormDialog } from "@/components/dashboard/projects/project-form-dialog";
import { ProjectTable } from "@/components/dashboard/projects/project-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";
import { UrlPagination } from "@/components/dashboard/shared/url-pagination";
import { Button } from "@/components/ui/button";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { getClient } from "@/services/clients/queries";
import { listProjects } from "@/services/projects/queries";
import { pageParamsSchema } from "@/services/shared/pagination";

interface ClientPageProps {
	params: Promise<{ userId: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ClientPage({
	params,
	searchParams,
}: ClientPageProps) {
	const t = await getTranslations("Clients.detail");
	const { userId } = await params;
	const { page } = pageParamsSchema.parse(await searchParams);
	const { photographerId } = await requirePhotographer();
	const client = await getClient(photographerId, userId);
	if (!client) notFound();

	const projects = await listProjects(
		photographerId,
		{ page, q: "", stage: undefined },
		client.id,
	);

	return (
		<PageShell>
			<Link
				href="/dashboard/clients"
				className="flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft className="h-3.5 w-3.5" />
				{t("back")}
			</Link>
			<PageHeader
				title={client.name}
				description={client.email}
				actions={
					<ProjectFormDialog
						defaultEmail={client.email}
						trigger={
							<Button size="sm" className="h-8 gap-1.5 text-xs">
								<Plus className="h-3.5 w-3.5" />
								{t("newProject")}
							</Button>
						}
					/>
				}
			/>
			<div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
				<section className="flex flex-col gap-3">
					<h2 className="text-sm font-semibold">
						{t("projects", { count: projects.total })}
					</h2>
					{projects.items.length === 0 ? (
						<EmptyState icon={FolderKanban} title={t("noProjects")} />
					) : (
						<>
							<ProjectTable projects={projects.items} hideClient />
							<UrlPagination
								page={projects.page}
								pageCount={projects.pageCount}
							/>
						</>
					)}
				</section>
				<ClientNotesForm clientId={client.id} notes={client.notes} />
			</div>
		</PageShell>
	);
}
