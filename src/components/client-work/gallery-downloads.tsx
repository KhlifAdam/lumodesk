import { Download, Heart } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

/**
 * "Download everything" and "Download my picks" as ZIP files. Plain links: the
 * browser handles the (possibly very large) download itself.
 */
export async function GalleryDownloads({
	galleryId,
	selectedCount,
}: {
	galleryId: string;
	selectedCount: number;
}) {
	const t = await getTranslations("Galleries.download");
	const base = `/api/galleries/${galleryId}/download`;

	return (
		<div className="flex flex-wrap items-center gap-2">
			<Button asChild size="sm" className="h-8 gap-1.5 text-xs">
				<a href={base} download>
					<Download className="h-3.5 w-3.5" />
					{t("all")}
				</a>
			</Button>
			{selectedCount > 0 && (
				<Button
					asChild
					size="sm"
					variant="outline"
					className="h-8 gap-1.5 text-xs"
				>
					<a href={`${base}?selected=1`} download>
						<Heart className="h-3.5 w-3.5" />
						{t("selected", { count: selectedCount })}
					</a>
				</Button>
			)}
		</div>
	);
}
