"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import {
	SwitchField,
	TextField,
} from "@/components/dashboard/shared/form-fields";
import { FormSection } from "@/components/dashboard/shared/form-section";
import type { CreateProjectValues } from "@/services/projects/schemas";
import { ClientPicker } from "./client-picker";

/** In edit mode the client is managed from the project page, not here. */
export function ClientSection({ isEdit }: { isEdit: boolean }) {
	const t = useTranslations("Projects.form.client");
	const { setValue } = useFormContext<CreateProjectValues>();

	return (
		<FormSection
			title={t("title")}
			description={isEdit ? t("hintEdit") : t("hint")}
		>
			{!isEdit && (
				<div className="flex items-end gap-2">
					<TextField<CreateProjectValues>
						name="clientEmail"
						label={t("email")}
						description={t("emailHint")}
						placeholder="client@example.com"
						type="email"
						className="flex-1"
					/>
					<ClientPicker
						onPick={(client) => {
							const options = { shouldDirty: true };
							setValue("clientEmail", client.email, options);
							if (client.phone) setValue("clientPhone", client.phone, options);
							// No email: the invitation goes to their phone.
							setValue(
								"invitePhone",
								!client.email && Boolean(client.phone),
								options,
							);
						}}
					/>
				</div>
			)}
			<TextField<CreateProjectValues>
				name="clientPhone"
				label={t("phone")}
				description={t("phoneHint")}
				type="tel"
			/>
			{!isEdit && (
				<SwitchField<CreateProjectValues>
					name="invitePhone"
					label={t("invitePhone")}
					description={t("invitePhoneHint")}
				/>
			)}
			<div className="grid gap-3 sm:grid-cols-2">
				<TextField<CreateProjectValues>
					name="contactName"
					label={t("contactName")}
					description={t("contactHint")}
				/>
				<TextField<CreateProjectValues>
					name="contactPhone"
					label={t("contactPhone")}
					type="tel"
				/>
			</div>
			<TextField<CreateProjectValues>
				name="clientNotes"
				label={t("notes")}
				description={t("notesHint")}
				rows={3}
			/>
		</FormSection>
	);
}
