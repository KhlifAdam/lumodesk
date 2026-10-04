"use client";

import { Heart, ImagePlus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { CommentsSheet } from "@/components/client-work/comments-sheet";
import { PhotoLightbox } from "@/components/client-work/photo-lightbox";
import { PhotoTile } from "@/components/client-work/photo-tile";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { SortableGrid } from "@/components/dashboard/shared/sortable-grid";
import { UrlPagination } from "@/components/dashboard/shared/url-pagination";
import { Button } from "@/components/ui/button";
import { useErrorMessage } from "@/hooks/use-error-message";
import { useOptimisticOrder } from "@/hooks/use-optimistic-order";
import {
	deleteGalleryItems,
	reorderGalleryItems,
} from "@/services/galleries/item-actions";
import type { GalleryPhoto, GalleryView } from "@/services/galleries/types";

const GRID =
	"grid grid-cols-3 gap-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8";

/** Photographer's grid: drag to reorder (unfiltered view), delete, comments. */
export function GalleryPhotoGrid({ gallery }: { gallery: GalleryView }) {
	const t = useTranslations("Galleries.manager");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [commentsFor, setCommentsFor] = useState<GalleryPhoto | null>(null);
	const { id: galleryId, page } = gallery;
	const save = useCallback(
		(ids: string[]) => reorderGalleryItems({ galleryId, page, ids }),
		[galleryId, page],
	);
	const { items, setItems, reorder } = useOptimisticOrder(gallery.items, save);

	const remove = async (photo: GalleryPhoto) => {
		setItems((prev) => prev.filter((item) => item.id !== photo.id));
		const result = await deleteGalleryItems({ galleryId, ids: [photo.id] });
		if (!result.ok) toast.error(errorMessage(result.error));
		else toast.success(t("removed"));
		router.refresh();
	};

	if (gallery.total === 0) {
		return (
			<EmptyState
				icon={gallery.filter === "selected" ? Heart : ImagePlus}
				title={gallery.filter === "selected" ? t("noPicks") : t("empty.title")}
				description={
					gallery.filter === "selected" ? undefined : t("empty.description")
				}
			/>
		);
	}

	const renderTile = (photo: GalleryPhoto) => (
		<PhotoTile
			photo={photo}
			openLabel={t("open", { name: photo.filename })}
			onOpen={() => setOpenIndex(items.findIndex((i) => i.id === photo.id))}
			onComments={() => setCommentsFor(photo)}
			commentsLabel={t("comments")}
			badge={
				photo.selected && (
					<span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
						<Heart className="h-3 w-3 fill-current" />
					</span>
				)
			}
			actions={
				<Button
					type="button"
					size="icon"
					variant="secondary"
					className="h-6 w-6 bg-background/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 hover:text-destructive"
					aria-label={t("remove")}
					onPointerDown={(event) => event.stopPropagation()}
					onClick={() => remove(photo)}
				>
					<Trash2 className="h-3 w-3" />
				</Button>
			}
		/>
	);

	return (
		<div className="flex flex-col gap-4">
			{gallery.filter === "all" ? (
				<SortableGrid
					items={items}
					onReorder={reorder}
					className={GRID}
					renderItem={renderTile}
				/>
			) : (
				<div className={GRID}>
					{items.map((photo) => (
						<div key={photo.id}>{renderTile(photo)}</div>
					))}
				</div>
			)}
			<UrlPagination page={gallery.page} pageCount={gallery.pageCount} />
			<PhotoLightbox
				items={items}
				index={openIndex}
				onIndexChange={setOpenIndex}
			/>
			<CommentsSheet photo={commentsFor} onClose={() => setCommentsFor(null)} />
		</div>
	);
}
