"use client";

import { useTranslations } from "next-intl";
import { TextField } from "@/components/dashboard/shared/form-fields";
import { FormSection } from "@/components/dashboard/shared/form-section";
import type { BookingValues } from "@/services/bookings/schemas";
import { CURRENCY } from "@/services/projects/options";

export function BookingQuoteSection() {
	const t = useTranslations("Bookings.form.quote");

	return (
		<FormSection
			title={t("title")}
			description={t("hint", { currency: CURRENCY })}
		>
			<div className="grid gap-3 sm:grid-cols-3">
				<TextField<BookingValues>
					name="clientBudget"
					label={t("budget")}
					type="number"
					step="0.001"
				/>
				<TextField<BookingValues>
					name="proposedPrice"
					label={t("price")}
					type="number"
					step="0.001"
				/>
				<TextField<BookingValues>
					name="plannedAdvance"
					label={t("advance")}
					type="number"
					step="0.001"
				/>
			</div>
			<TextField<BookingValues>
				name="responseDeadline"
				label={t("deadline")}
				type="date"
				className="sm:max-w-xs"
			/>
			<TextField<BookingValues>
				name="internalNotes"
				label={t("notes")}
				description={t("notesHint")}
				rows={3}
			/>
		</FormSection>
	);
}
