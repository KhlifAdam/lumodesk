"use client";

import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import { FormSection } from "@/components/dashboard/shared/form-section";
import { FONT_PAIR_STACKS, SITE_TEMPLATE_IDS } from "@/lib/public-site/design";
import { type AppearanceValues, FONT_PAIRS } from "@/services/studio/schemas";
import { AccentPicker } from "./accent-picker";
import { OptionCard } from "./option-card";
import { TemplateThumbnail } from "./template-thumbnail";

export function TemplateSection() {
	const t = useTranslations("Site.appearance");
	const { control, watch } = useFormContext<AppearanceValues>();
	const accent = watch("accentColor");

	return (
		<FormSection
			title={t("template.title")}
			description={t("template.description")}
		>
			<Controller
				control={control}
				name="template"
				render={({ field }) => (
					<div className="grid grid-cols-2 gap-2 md:grid-cols-3">
						{SITE_TEMPLATE_IDS.map((id) => (
							<OptionCard
								key={id}
								selected={field.value === id}
								onSelect={() => field.onChange(id)}
								title={t(`template.options.${id}.name`)}
								description={t(`template.options.${id}.description`)}
							>
								<TemplateThumbnail template={id} accent={accent} />
							</OptionCard>
						))}
					</div>
				)}
			/>
		</FormSection>
	);
}

export function FontsSection() {
	const t = useTranslations("Site.appearance.fonts");
	const { control } = useFormContext<AppearanceValues>();

	return (
		<FormSection title={t("title")} description={t("description")}>
			<Controller
				control={control}
				name="fontPair"
				render={({ field }) => (
					<div className="grid grid-cols-3 gap-2">
						{FONT_PAIRS.map((id) => (
							<OptionCard
								key={id}
								selected={field.value === id}
								onSelect={() => field.onChange(id)}
								title={t(`options.${id}`)}
							>
								<div className="flex h-12 items-baseline gap-1.5 rounded-md bg-muted/60 px-2 py-1.5">
									<span
										className="text-2xl"
										style={{ fontFamily: FONT_PAIR_STACKS[id].heading }}
									>
										Aa
									</span>
									<span
										className="text-xs text-muted-foreground"
										style={{ fontFamily: FONT_PAIR_STACKS[id].body }}
									>
										Aa
									</span>
								</div>
							</OptionCard>
						))}
					</div>
				)}
			/>
		</FormSection>
	);
}

export function AccentSection() {
	const t = useTranslations("Site.appearance.accent");
	const tv = useTranslations("Validation");
	const {
		control,
		formState: { errors },
	} = useFormContext<AppearanceValues>();

	return (
		<FormSection title={t("title")} description={t("description")}>
			<Controller
				control={control}
				name="accentColor"
				render={({ field }) => (
					<AccentPicker value={field.value} onChange={field.onChange} />
				)}
			/>
			{errors.accentColor && (
				<p className="text-xs font-medium text-destructive">
					{tv("invalidColor")}
				</p>
			)}
		</FormSection>
	);
}
