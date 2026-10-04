"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import {
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { setLocale } from "@/i18n/actions";
import { LOCALES } from "@/i18n/config";

export function LanguageSubmenu() {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleChange = (value: string) => {
		startTransition(async () => {
			await setLocale(value);
			router.refresh();
		});
	};

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger className="cursor-pointer" disabled={isPending}>
				<Languages className="mr-2 h-4 w-4" />
				<span>{t("Dashboard.UserMenu.language")}</span>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent>
				<DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
					{LOCALES.map((value) => (
						<DropdownMenuRadioItem key={value} value={value}>
							{t(`Common.languages.${value}`)}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
