"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { setLocale } from "@/i18n/actions";
import { LOCALES } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** Compact EN / FR switch for logged-out visitors. */
export function LanguageSwitcher() {
	const t = useTranslations("Landing.header");
	const locale = useLocale();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const change = (next: string) =>
		startTransition(async () => {
			await setLocale(next);
			router.refresh();
		});

	return (
		<fieldset className="flex items-center rounded-lg border border-border p-0.5 text-[11px] font-semibold">
			<legend className="sr-only">{t("language")}</legend>
			{LOCALES.map((item) => (
				<button
					key={item}
					type="button"
					aria-pressed={item === locale}
					disabled={isPending}
					onClick={() => change(item)}
					className={cn(
						"rounded-md px-2 py-1 uppercase transition-colors",
						item === locale
							? "bg-foreground text-background"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{item}
				</button>
			))}
		</fieldset>
	);
}
