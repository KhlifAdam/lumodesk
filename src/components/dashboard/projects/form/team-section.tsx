"use client";

import { useTranslations } from "next-intl";
import { TextField } from "@/components/dashboard/shared/form-fields";
import { FormSection } from "@/components/dashboard/shared/form-section";
import type { CreateProjectValues } from "@/services/projects/schemas";

export function TeamSection() {
	const t = useTranslations("Projects.form.team");

	return (
		<FormSection title={t("title")} description={t("hint")}>
			<TextField<CreateProjectValues>
				name="team"
				label={t("members")}
				description={t("membersHint")}
				placeholder={t("membersPlaceholder")}
			/>
			<TextField<CreateProjectValues>
				name="internalNotes"
				label={t("notes")}
				description={t("notesHint")}
				rows={3}
			/>
		</FormSection>
	);
}
