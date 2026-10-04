"use client";

import { Check, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import type { SlugStatus } from "@/components/dashboard/website/use-slug-availability";
import { Input } from "@/components/ui/input";

interface SlugInputProps extends ComponentProps<typeof Input> {
	status: SlugStatus;
}

/** `/s/` prefixed slug input with a live availability indicator. */
export function SlugInput({ status, ...props }: SlugInputProps) {
	const t = useTranslations("Site.slug");

	return (
		<div className="flex flex-col gap-1">
			<div className="flex h-8 items-center overflow-hidden rounded-md border border-input bg-transparent text-sm focus-within:ring-1 focus-within:ring-ring">
				<span className="flex h-full items-center border-r border-input bg-muted/50 px-2 text-xs text-muted-foreground">
					/s/
				</span>
				<Input
					{...props}
					className="h-full flex-1 rounded-none border-0 shadow-none focus-visible:ring-0"
				/>
				<span className="flex w-7 justify-center">
					{status === "checking" && (
						<Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
					)}
					{status === "available" && (
						<Check className="h-3.5 w-3.5 text-emerald-500" />
					)}
					{status === "taken" && <X className="h-3.5 w-3.5 text-destructive" />}
				</span>
			</div>
			{status === "taken" && (
				<p className="text-[0.8rem] font-medium text-destructive">
					{t("taken")}
				</p>
			)}
		</div>
	);
}
