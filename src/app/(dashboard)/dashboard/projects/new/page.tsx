import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ProjectForm } from "@/components/dashboard/projects/form/project-form";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { emptyProjectValues } from "@/services/projects/form-values";

interface NewProjectPageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function NewProjectPage({
	searchParams,
}: NewProjectPageProps) {
	const t = await getTranslations("Projects.form");
	await requirePhotographer();
	const { email, phone } = await searchParams;

	return (
		<PageShell>
			<Link
				href="/dashboard/projects"
				className="flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft className="h-3.5 w-3.5" />
				{t("back")}
			</Link>
			<PageHeader title={t("createTitle")} description={t("description")} />
			<ProjectForm
				initial={emptyProjectValues(
					typeof email === "string" ? email : "",
					typeof phone === "string" ? phone : "",
				)}
			/>
		</PageShell>
	);
}
