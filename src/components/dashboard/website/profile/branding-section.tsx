"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { MediaField } from "@/components/dashboard/media/media-field";
import { FormSection } from "@/components/dashboard/shared/form-section";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import type { MediaItem } from "@/services/media/types";
import type { StudioProfileValues } from "@/services/studio/schemas";

interface BrandingSectionProps {
	logo: MediaItem | null;
	cover: MediaItem | null;
}

export function BrandingSection({ logo, cover }: BrandingSectionProps) {
	const t = useTranslations("Site.profile.branding");
	const { control } = useFormContext<StudioProfileValues>();

	const fields = [
		{ name: "logoMediaId", label: t("logo"), initial: logo },
		{ name: "coverMediaId", label: t("cover"), initial: cover },
	] as const;

	return (
		<FormSection title={t("title")} description={t("description")}>
			<div className="grid gap-3 sm:grid-cols-2">
				{fields.map(({ name, label, initial }) => (
					<FormField
						key={name}
						control={control}
						name={name}
						render={({ field }) => (
							<FormItem className="space-y-1.5">
								<FormLabel className="text-xs">{label}</FormLabel>
								<FormControl>
									<MediaField
										value={field.value}
										onChange={field.onChange}
										initialMedia={initial}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				))}
			</div>
		</FormSection>
	);
}
