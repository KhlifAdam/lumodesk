"use client";

import { useTranslations } from "next-intl";
import { TextField } from "@/components/dashboard/shared/form-fields";
import { FormSection } from "@/components/dashboard/shared/form-section";
import { SOCIAL_ICONS } from "@/lib/public-site/social-icons";
import {
	SOCIAL_KEYS,
	type StudioProfileValues,
} from "@/services/studio/schemas";

export function SocialsSection() {
	const t = useTranslations("Site.profile.socials");

	return (
		<FormSection title={t("title")} description={t("description")}>
			<div className="grid gap-3 sm:grid-cols-2">
				{SOCIAL_KEYS.map((key) => {
					const Icon = SOCIAL_ICONS[key];
					return (
						<TextField<StudioProfileValues>
							key={key}
							name={`socials.${key}`}
							type="url"
							label={t(key)}
							placeholder="https://"
							prefix={<Icon className="h-3.5 w-3.5" />}
						/>
					);
				})}
			</div>
		</FormSection>
	);
}
