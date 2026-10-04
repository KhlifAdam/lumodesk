"use client";

import { useTranslations } from "next-intl";
import { TextField } from "@/components/dashboard/shared/form-fields";
import { FormSection } from "@/components/dashboard/shared/form-section";
import type { StudioProfileValues } from "@/services/studio/schemas";

export function ContactSection() {
	const t = useTranslations("Site.profile.contact");

	return (
		<FormSection title={t("title")} description={t("description")}>
			<div className="grid gap-3 sm:grid-cols-2">
				<TextField<StudioProfileValues>
					name="email"
					type="email"
					label={t("email")}
				/>
				<TextField<StudioProfileValues>
					name="phone"
					type="tel"
					label={t("phone")}
				/>
				<TextField<StudioProfileValues> name="city" label={t("city")} />
				<TextField<StudioProfileValues> name="country" label={t("country")} />
			</div>
		</FormSection>
	);
}
