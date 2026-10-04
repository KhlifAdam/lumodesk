"use client";

import { Copy, ExternalLink, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PublicUrlBar({
	url,
	published,
}: {
	url: string;
	published: boolean;
}) {
	const t = useTranslations("Site.publicUrl");

	return (
		<div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
			<Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
			<span className="truncate text-xs font-medium">{url}</span>
			<Badge
				variant={published ? "default" : "secondary"}
				className="h-5 px-1.5 text-[10px]"
			>
				{published ? t("live") : t("draft")}
			</Badge>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="h-6 w-6"
				aria-label={t("copy")}
				onClick={async () => {
					await navigator.clipboard.writeText(url);
					toast.success(t("copied"));
				}}
			>
				<Copy className="h-3 w-3" />
			</Button>
			<Button
				asChild
				variant="ghost"
				size="icon"
				className="h-6 w-6"
				aria-label={t("open")}
			>
				<a href={url} target="_blank" rel="noreferrer">
					<ExternalLink className="h-3 w-3" />
				</a>
			</Button>
		</div>
	);
}
