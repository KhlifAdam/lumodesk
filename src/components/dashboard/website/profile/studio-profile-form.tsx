"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SwitchField } from "@/components/dashboard/shared/form-fields";
import { FormSaveBar } from "@/components/dashboard/shared/form-save-bar";
import { FormSection } from "@/components/dashboard/shared/form-section";
import { Form } from "@/components/ui/form";
import { useErrorMessage } from "@/hooks/use-error-message";
import { updateStudioProfile } from "@/services/studio/actions";
import {
	type StudioProfileValues,
	studioProfileSchema,
} from "@/services/studio/schemas";
import type { StudioData } from "@/services/studio/types";
import { BrandingSection } from "./branding-section";
import { ContactSection } from "./contact-section";
import { IdentitySection } from "./identity-section";
import { SocialsSection } from "./socials-section";

function toFormValues(studio: StudioData): StudioProfileValues {
	const {
		id,
		logo,
		cover,
		publicUrl,
		template,
		accentColor,
		fontPair,
		...values
	} = studio;
	return values;
}

export function StudioProfileForm({ studio }: { studio: StudioData }) {
	const t = useTranslations("Site.profile");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const form = useForm<StudioProfileValues>({
		resolver: zodResolver(studioProfileSchema),
		defaultValues: toFormValues(studio),
	});
	const { isDirty, isSubmitting } = form.formState;

	async function onSubmit(values: StudioProfileValues) {
		const result = await updateStudioProfile(values);
		if (!result.ok) {
			if (result.error === "slugTaken")
				form.setError("slug", { message: "slugTaken" });
			return toast.error(errorMessage(result.error));
		}
		form.reset(values);
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
						<IdentitySection savedSlug={studio.slug} />
						<SocialsSection />
					</div>
					<div className="flex flex-col gap-4">
						<FormSection title={t("visibility.title")}>
							<SwitchField<StudioProfileValues>
								name="published"
								label={t("visibility.published")}
								description={t("visibility.publishedHint")}
							/>
							<SwitchField<StudioProfileValues>
								name="bookingEnabled"
								label={t("visibility.booking")}
								description={t("visibility.bookingHint")}
							/>
						</FormSection>
						<BrandingSection logo={studio.logo} cover={studio.cover} />
						<ContactSection />
					</div>
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
