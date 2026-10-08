"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { ClientPicker } from "@/components/dashboard/projects/form/client-picker";
import {
	SelectField,
	TextField,
} from "@/components/dashboard/shared/form-fields";
import { FormSection } from "@/components/dashboard/shared/form-section";
import { BOOKING_SOURCES } from "@/services/bookings/options";
import type { BookingValues } from "@/services/bookings/schemas";

export function BookingClientSection() {
	const t = useTranslations("Bookings.form.client");
	const tSource = useTranslations("Bookings.source");
	const { setValue } = useFormContext<BookingValues>();

	return (
		<FormSection title={t("title")} description={t("hint")}>
			<div className="flex items-end gap-2">
				<TextField<BookingValues>
					name="clientName"
					label={t("name")}
					className="flex-1"
				/>
				<ClientPicker
					onPick={(client) => {
						const options = { shouldDirty: true };
						setValue("clientId", client.id, options);
						setValue("clientName", client.name, options);
						setValue("clientEmail", client.email, options);
						setValue("clientPhone", client.phone, options);
					}}
				/>
			</div>
			<div className="grid gap-3 sm:grid-cols-2">
				<TextField<BookingValues>
					name="clientEmail"
					label={t("email")}
					type="email"
				/>
				<TextField<BookingValues>
					name="clientPhone"
					label={t("phone")}
					type="tel"
				/>
			</div>
			<SelectField<BookingValues>
				name="source"
				label={t("source")}
				description={t("sourceHint")}
				className="sm:max-w-xs"
				options={BOOKING_SOURCES.map((value) => ({
					value,
					label: tSource(value),
				}))}
			/>
		</FormSection>
	);
}
