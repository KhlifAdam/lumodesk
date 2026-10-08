"use client";

import { useTranslations } from "next-intl";
import {
	SelectField,
	TextField,
} from "@/components/dashboard/shared/form-fields";
import { FormSection } from "@/components/dashboard/shared/form-section";
import type { BookingValues } from "@/services/bookings/schemas";
import { MEDIA_TYPES, SERVICE_TYPES } from "@/services/projects/options";

export function BookingNeedSection() {
	const t = useTranslations("Bookings.form.need");
	const tService = useTranslations("Projects.serviceTypes");
	const tMedia = useTranslations("Projects.mediaTypes");

	return (
		<FormSection title={t("title")} description={t("hint")}>
			<TextField<BookingValues>
				name="title"
				label={t("name")}
				description={t("nameHint")}
				placeholder={t("namePlaceholder")}
			/>
			<div className="grid gap-3 sm:grid-cols-2">
				<SelectField<BookingValues>
					name="serviceType"
					label={t("serviceType")}
					options={SERVICE_TYPES.map((value) => ({
						value,
						label: tService(value),
					}))}
				/>
				<SelectField<BookingValues>
					name="mediaType"
					label={t("mediaType")}
					options={MEDIA_TYPES.map((value) => ({
						value,
						label: tMedia(value),
					}))}
				/>
			</div>
			<TextField<BookingValues>
				name="description"
				label={t("description")}
				description={t("descriptionHint")}
				rows={3}
			/>
			<div className="grid gap-3 sm:grid-cols-3">
				<TextField<BookingValues>
					name="desiredDate"
					label={t("date")}
					description={t("neededToConfirm")}
					type="date"
				/>
				<TextField<BookingValues>
					name="startTime"
					label={t("startTime")}
					type="time"
				/>
				<TextField<BookingValues>
					name="durationHours"
					label={t("duration")}
					type="number"
					step="0.5"
				/>
			</div>
			<TextField<BookingValues>
				name="location"
				label={t("location")}
				description={t("locationHint")}
			/>
		</FormSection>
	);
}
