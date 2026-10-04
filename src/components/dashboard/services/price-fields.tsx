"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { TextField } from "@/components/dashboard/shared/form-fields";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CURRENCIES, type PackageValues } from "@/services/packages/schemas";

/** Price input + currency select, bound to the package form. */
export function PriceFields() {
	const t = useTranslations("Services.form");
	const { control } = useFormContext<PackageValues>();

	return (
		<div className="grid grid-cols-[1fr_auto] gap-2">
			<TextField<PackageValues> name="price" type="number" label={t("price")} />
			<FormField
				control={control}
				name="currency"
				render={({ field }) => (
					<FormItem className="space-y-1">
						<FormLabel className="text-xs">{t("currency")}</FormLabel>
						<Select value={field.value} onValueChange={field.onChange}>
							<FormControl>
								<SelectTrigger className="h-8 w-24 text-sm">
									<SelectValue />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{CURRENCIES.map((currency) => (
									<SelectItem key={currency} value={currency}>
										{currency}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormItem>
				)}
			/>
		</div>
	);
}
