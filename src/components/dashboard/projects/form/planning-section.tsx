"use client";

import { useTranslations } from "next-intl";
import {
	SelectField,
	TextField,
} from "@/components/dashboard/shared/form-fields";
import { FormSection } from "@/components/dashboard/shared/form-section";
import { LOCATION_TYPES } from "@/services/projects/options";
import type { CreateProjectValues } from "@/services/projects/schemas";

export function PlanningSection() {
	const t = useTranslations("Projects.form.planning");
	const tLocation = useTranslations("Projects.locationTypes");

	return (
		<FormSection title={t("title")} description={t("hint")}>
			<div className="grid gap-3 sm:grid-cols-3">
				<TextField<CreateProjectValues>
					name="eventDate"
					label={t("date")}
					type="date"
				/>
				<TextField<CreateProjectValues>
					name="startTime"
					label={t("startTime")}
					type="time"
				/>
				<TextField<CreateProjectValues>
					name="endTime"
					label={t("endTime")}
					type="time"
				/>
			</div>
			<div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
				<TextField<CreateProjectValues>
					name="location"
					label={t("location")}
					description={t("locationHint")}
				/>
				<SelectField<CreateProjectValues>
					name="locationType"
					label={t("locationType")}
					emptyLabel={t("notSet")}
					options={LOCATION_TYPES.map((value) => ({
						value,
						label: tLocation(value),
					}))}
				/>
			</div>
			<TextField<CreateProjectValues>
				name="deliveryDeadline"
				label={t("deadline")}
				description={t("deadlineHint")}
				type="date"
				className="sm:max-w-xs"
			/>
			<TextField<CreateProjectValues>
				name="equipment"
				label={t("equipment")}
				description={t("equipmentHint")}
				rows={2}
			/>
		</FormSection>
	);
}
