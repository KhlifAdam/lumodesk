"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { TextField } from "@/components/dashboard/shared/form-fields";
import { FormSection } from "@/components/dashboard/shared/form-section";
import { useSlugAvailability } from "@/components/dashboard/website/use-slug-availability";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import type { StudioProfileValues } from "@/services/studio/schemas";
import { SlugInput } from "../slug-input";

export function IdentitySection({ savedSlug }: { savedSlug: string }) {
	const t = useTranslations("Site.profile.identity");
	const { control, watch } = useFormContext<StudioProfileValues>();
	const slug = watch("slug");
	const slugStatus = useSlugAvailability(slug, slug !== savedSlug);

	return (
		<FormSection title={t("title")} description={t("description")}>
			<div className="grid gap-3 sm:grid-cols-2">
				<TextField<StudioProfileValues> name="name" label={t("name")} />
				<FormField
					control={control}
					name="slug"
					render={({ field }) => (
						<FormItem className="space-y-1">
							<FormLabel className="text-xs">{t("slug")}</FormLabel>
							<FormControl>
								<SlugInput status={slugStatus} className="text-sm" {...field} />
							</FormControl>
							<FormMessage className="text-xs" />
						</FormItem>
					)}
				/>
			</div>
			<TextField<StudioProfileValues>
				name="tagline"
				label={t("tagline")}
				placeholder={t("taglinePlaceholder")}
			/>
			<TextField<StudioProfileValues>
				name="bio"
				label={t("bio")}
				placeholder={t("bioPlaceholder")}
				rows={5}
			/>
		</FormSection>
	);
}
