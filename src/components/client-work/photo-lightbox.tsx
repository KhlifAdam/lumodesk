"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { GalleryPhoto } from "@/services/galleries/types";

interface PhotoLightboxProps {
	items: GalleryPhoto[];
	index: number | null;
	onIndexChange: (index: number | null) => void;
	/** Controls for the open photo (select, comments). */
	renderActions?: (photo: GalleryPhoto) => ReactNode;
}

const arrowClass =
	"absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25";

/** Full-size view of private gallery photos and videos (signed URLs, not optimized). */
export function PhotoLightbox({
	items,
	index,
	onIndexChange,
	renderActions,
}: PhotoLightboxProps) {
	const t = useTranslations("Galleries.lightbox");
	const photo = index !== null ? (items[index] ?? null) : null;

	useEffect(() => {
		if (index === null) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowRight") onIndexChange((index + 1) % items.length);
			if (event.key === "ArrowLeft")
				onIndexChange((index - 1 + items.length) % items.length);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [index, items.length, onIndexChange]);

	return (
		<Dialog
			open={photo !== null}
			onOpenChange={(open) => !open && onIndexChange(null)}
		>
			<DialogContent className="h-[90vh] max-w-[95vw] border-0 bg-black/95 p-0 text-white sm:max-w-6xl">
				<DialogTitle className="sr-only">
					{photo?.filename ?? t("title")}
				</DialogTitle>
				{photo && index !== null && (
					<div className="relative h-full w-full">
						{photo.type === "VIDEO" ? (
							// The signed URL supports range requests, so seeking works.
							<video
								key={photo.id}
								src={photo.fullUrl}
								poster={photo.previewUrl ?? undefined}
								controls
								playsInline
								preload="metadata"
								className="h-full w-full object-contain p-4 pb-16"
							>
								<track kind="captions" />
							</video>
						) : (
							<Image
								key={photo.id}
								src={photo.fullUrl}
								alt={photo.filename}
								fill
								unoptimized
								className="object-contain p-4"
							/>
						)}
						<div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent px-5 py-4 text-sm text-white/80">
							<span className="truncate">{photo.filename}</span>
							<div className="flex shrink-0 items-center gap-3">
								{renderActions?.(photo)}
								<span className="tabular-nums">
									{index + 1} / {items.length}
								</span>
							</div>
						</div>
						{items.length > 1 && (
							<>
								<button
									type="button"
									aria-label={t("previous")}
									className={`${arrowClass} left-3`}
									onClick={() =>
										onIndexChange((index - 1 + items.length) % items.length)
									}
								>
									<ChevronLeft className="h-5 w-5" />
								</button>
								<button
									type="button"
									aria-label={t("next")}
									className={`${arrowClass} right-3`}
									onClick={() => onIndexChange((index + 1) % items.length)}
								>
									<ChevronRight className="h-5 w-5" />
								</button>
							</>
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
