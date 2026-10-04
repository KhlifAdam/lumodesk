"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ConfirmDeleteButton } from "@/components/dashboard/shared/confirm-delete-button";
import { useErrorMessage } from "@/hooks/use-error-message";
import { deleteProject } from "@/services/projects/actions";

export function ProjectDeleteButton({ projectId }: { projectId: string }) {
	const t = useTranslations("Projects.detail");
	const router = useRouter();
	const errorMessage = useErrorMessage();

	return (
		<ConfirmDeleteButton
			title={t("deleteTitle")}
			description={t("deleteDescription")}
			onConfirm={async () => {
				const result = await deleteProject(projectId);
				if (!result.ok) return void toast.error(errorMessage(result.error));
				toast.success(t("deleted"));
				router.push("/dashboard/projects");
			}}
		/>
	);
}
