"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { SiteMedia } from "@/services/public-site/types";

interface LightboxProps {
	items: SiteMedia[];
	/** Index of the open item, or null when closed. */
	index: number | null;
	onIndexChange: (index: number | null) => void;
}

const arrowClass =
	"absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25";

export function Lightbox({ items, index, onIndexChange }: LightboxProps) {
	const t = useTranslations("PublicSite.lightbox");
	const isOpen = index !== null;
	const media = isOpen ? items[index] : null;

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
		<Dialog open={isOpen} onOpenChange={(open) => !open && onIndexChange(null)}>
			<DialogContent className="h-[90vh] max-w-[95vw] border-0 bg-black/95 p-0 text-white sm:max-w-6xl">
				<DialogTitle className="sr-only">
					{media?.alt || t("title")}
				</DialogTitle>
				{media && index !== null && (
					<div className="relative h-full w-full">
						{media.type === "IMAGE" ? (
							<Image
								src={media.url}
								alt={media.alt}
								fill
								sizes="95vw"
								className="object-contain p-4"
							/>
						) : (
							// biome-ignore lint/a11y/useMediaCaption: portfolio footage has no captions
							<video
								src={media.url}
								controls
								autoPlay
								className="h-full w-full object-contain"
							/>
						)}
						<div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent px-5 py-4 text-sm text-white/80">
							<span className="truncate">{media.alt}</span>
							<span className="shrink-0 tabular-nums">
								{index + 1} / {items.length}
							</span>
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
