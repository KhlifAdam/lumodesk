import { FolderOpen } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MediaThumb } from "@/components/dashboard/media/media-thumb";
import { Badge } from "@/components/ui/badge";
import type { AlbumSummary } from "@/services/portfolio/types";

export function AlbumCard({ album }: { album: AlbumSummary }) {
	const t = useTranslations("Portfolio");

	return (
		<Link
			href={`/dashboard/portfolio/${album.id}`}
			draggable={false}
			className="group block overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-luminous"
		>
			{album.cover ? (
				<MediaThumb
					media={album.cover}
					sizes="(min-width: 1280px) 16vw, (min-width: 768px) 25vw, 50vw"
					className="aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.03]"
				/>
			) : (
				<div className="flex aspect-[4/3] items-center justify-center bg-muted">
					<FolderOpen className="h-6 w-6 text-muted-foreground" />
				</div>
			)}
			<div className="flex items-center justify-between gap-2 px-2.5 py-2">
				<div className="flex min-w-0 flex-col">
					<span className="truncate text-sm font-medium">{album.title}</span>
					<span className="text-[11px] text-muted-foreground">
						{t("itemCount", { count: album.itemCount })}
					</span>
				</div>
				<Badge
					variant={album.published ? "default" : "secondary"}
					className="h-5 shrink-0 px-1.5 text-[10px]"
				>
					{album.published ? t("published") : t("draft")}
				</Badge>
			</div>
		</Link>
	);
}
