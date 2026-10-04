"use client";

import { Moon, Sun, SunMoon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import { FormSection } from "@/components/dashboard/shared/form-section";
import { Checkbox } from "@/components/ui/checkbox";
import { LOCALES, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { type AppearanceValues, THEME_MODES } from "@/services/studio/schemas";
import { OptionCard } from "./option-card";

const MODE_ICONS = { LIGHT: Sun, DARK: Moon, BOTH: SunMoon } as const;

/** Light only, dark only, or both (visitors follow their OS and can toggle). */
export function ThemeModeSection() {
	const t = useTranslations("Site.appearance.themeMode");
	const { control } = useFormContext<AppearanceValues>();

	return (
		<FormSection title={t("title")} description={t("description")}>
			<Controller
				control={control}
				name="themeMode"
				render={({ field }) => (
					<div className="grid grid-cols-3 gap-2">
						{THEME_MODES.map((mode) => {
							const Icon = MODE_ICONS[mode];
							return (
								<OptionCard
									key={mode}
									selected={field.value === mode}
									onSelect={() => field.onChange(mode)}
									title={t(`options.${mode}`)}
									description={t(`hints.${mode}`)}
								>
									<div className="flex h-12 overflow-hidden rounded-md border border-border">
										{mode !== "DARK" && (
											<div className="flex flex-1 items-center justify-center bg-stone-100 text-stone-800">
												<Icon className="h-4 w-4" />
											</div>
										)}
										{mode !== "LIGHT" && (
											<div className="flex flex-1 items-center justify-center bg-stone-900 text-stone-100">
												<Icon className="h-4 w-4" />
											</div>
										)}
									</div>
								</OptionCard>
							);
						})}
					</div>
				)}
			/>
		</FormSection>
	);
}

/** Which languages the site is offered in, and which one visitors land on. */
export function LanguagesSection() {
	const t = useTranslations("Site.appearance.languages");
	const tLang = useTranslations("Common.languages");
	const tv = useTranslations("Validation");
	const { control, watch, setValue, formState } =
		useFormContext<AppearanceValues>();
	const defaultLocale = watch("defaultLocale");
	const error = formState.errors.locales ?? formState.errors.defaultLocale;

	return (
		<FormSection title={t("title")} description={t("description")}>
			<Controller
				control={control}
				name="locales"
				render={({ field }) => (
					<ul className="flex flex-col gap-1.5">
						{LOCALES.map((locale: Locale) => {
							const enabled = field.value.includes(locale);
							const isDefault = defaultLocale === locale;
							const toggle = (checked: boolean) => {
								const next = checked
									? LOCALES.filter(
											(l) => l === locale || field.value.includes(l),
										)
									: field.value.filter((l) => l !== locale);
								field.onChange(next);
								// Keep the default pointing at an enabled language.
								if (!checked && isDefault && next[0])
									setValue("defaultLocale", next[0], { shouldDirty: true });
							};
							return (
								<li
									key={locale}
									className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
								>
									<label
										htmlFor={`locale-${locale}`}
										className="flex flex-1 cursor-pointer items-center gap-2.5 text-sm"
									>
										<Checkbox
											id={`locale-${locale}`}
											checked={enabled}
											onCheckedChange={(checked) => toggle(checked === true)}
										/>
										{tLang(locale)}
										<span className="text-xs uppercase text-muted-foreground">
											{locale}
										</span>
									</label>
									<button
										type="button"
										disabled={!enabled}
										onClick={() =>
											setValue("defaultLocale", locale, { shouldDirty: true })
										}
										className={cn(
											"rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors disabled:opacity-40",
											isDefault
												? "bg-primary/10 text-primary"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										{isDefault ? t("isDefault") : t("makeDefault")}
									</button>
								</li>
							);
						})}
					</ul>
				)}
			/>
			{error?.message && (
				<p className="text-xs font-medium text-destructive">
					{tv.has(error.message as "pickLanguage")
						? tv(error.message as "pickLanguage")
						: error.message}
				</p>
			)}
		</FormSection>
	);
}
