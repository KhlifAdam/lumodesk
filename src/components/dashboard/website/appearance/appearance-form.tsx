"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormSaveBar } from "@/components/dashboard/shared/form-save-bar";
import { Form } from "@/components/ui/form";
import { useErrorMessage } from "@/hooks/use-error-message";
import { updateAppearance } from "@/services/studio/actions";
import {
	type AppearanceValues,
	appearanceSchema,
} from "@/services/studio/schemas";
import type { StudioData } from "@/services/studio/types";
import { AppearancePreviewPanel } from "./appearance-preview-panel";
import {
	AccentSection,
	FontsSection,
	TemplateSection,
} from "./design-sections";
import { LanguagesSection, ThemeModeSection } from "./site-options-sections";

export function AppearanceForm({ studio }: { studio: StudioData }) {
	const t = useTranslations("Site.appearance");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const form = useForm<AppearanceValues>({
		resolver: zodResolver(appearanceSchema),
		defaultValues: {
			template: studio.template,
			accentColor: studio.accentColor,
			fontPair: studio.fontPair,
			themeMode: studio.themeMode,
			locales: studio.locales,
			defaultLocale: studio.defaultLocale,
		},
	});
	const { isDirty, isSubmitting } = form.formState;

	async function onSubmit(next: AppearanceValues) {
		const result = await updateAppearance(next);
		if (!result.ok) return toast.error(errorMessage(result.error));
		form.reset(next);
		toast.success(t("saved"));
		router.refresh();
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
			>
				<div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
					<div className="flex flex-col gap-4">
						<TemplateSection />
						<ThemeModeSection />
						<div className="grid gap-4 lg:grid-cols-2">
							<FontsSection />
							<AccentSection />
						</div>
						<LanguagesSection />
					</div>
					<AppearancePreviewPanel studio={studio} />
				</div>
				<FormSaveBar
					visible={isDirty}
					isSubmitting={isSubmitting}
					onReset={() => form.reset()}
				/>
			</form>
		</Form>
	);
}
