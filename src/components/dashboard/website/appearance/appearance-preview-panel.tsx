"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { previewQuery } from "@/services/preview/preview-params";
import { type AppearanceValues, designSchema } from "@/services/studio/schemas";
import type { StudioData } from "@/services/studio/types";
import { LiveSitePreview } from "./live-site-preview";

/** Live miniature of the site with the current (unsaved) choices. */
export function AppearancePreviewPanel({ studio }: { studio: StudioData }) {
	const t = useTranslations("Site.appearance.preview");
	const values = useFormContext<AppearanceValues>().watch();
	const accent = designSchema.shape.accentColor.safeParse(values.accentColor)
		.success
		? values.accentColor
		: studio.accentColor;

	const query = previewQuery({
		template: values.template,
		accent,
		font: values.fontPair,
		mode: values.themeMode,
		lang: values.defaultLocale,
	});

	return (
		<div className="flex flex-col gap-2 xl:sticky xl:top-5 xl:self-start">
			<div className="flex items-center justify-between gap-2">
				<span className="text-xs font-medium text-muted-foreground">
					{t("title")}
				</span>
				<Button
					asChild
					variant="outline"
					size="sm"
					className="h-7 gap-1.5 text-xs"
				>
					<Link href={`/preview?${query}`} target="_blank">
						<Eye className="h-3.5 w-3.5" />
						{t("open")}
					</Link>
				</Button>
			</div>
			<LiveSitePreview src={`/preview/frame?${query}`} />
			<p className="text-[11px] text-muted-foreground">{t("hint")}</p>
		</div>
	);
}
