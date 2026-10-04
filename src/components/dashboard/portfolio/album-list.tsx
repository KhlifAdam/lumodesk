"use client";

import { Images, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { SortableGrid } from "@/components/dashboard/shared/sortable-grid";
import { UrlPagination } from "@/components/dashboard/shared/url-pagination";
import { Button } from "@/components/ui/button";
import { useOptimisticOrder } from "@/hooks/use-optimistic-order";
import { reorderAlbums } from "@/services/portfolio/actions";
import type { AlbumPage } from "@/services/portfolio/types";
import { AlbumCard } from "./album-card";
import { AlbumFormDialog } from "./album-form-dialog";

export function NewAlbumButton() {
	const t = useTranslations("Portfolio");
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button size="sm" className="h-8 gap-1.5" onClick={() => setOpen(true)}>
				<Plus className="h-3.5 w-3.5" />
				{t("newAlbum")}
			</Button>
			<AlbumFormDialog open={open} onOpenChange={setOpen} />
		</>
	);
}

/**
 * Drag-to-reorder grid of one page of albums. Order across the whole list is
 * the order on the public site; dragging only reorders within this page.
 */
export function AlbumList({ albums }: { albums: AlbumPage }) {
	const t = useTranslations("Portfolio");
	const { page } = albums;
	const save = useCallback(
		(ids: string[]) => reorderAlbums({ page, ids }),
		[page],
	);
	const { items, reorder } = useOptimisticOrder(albums.items, save);

	if (albums.total === 0) {
		return (
			<EmptyState
				icon={Images}
				title={t("empty.title")}
				description={t("empty.description")}
				action={<NewAlbumButton />}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<p className="text-xs text-muted-foreground">{t("reorderHint")}</p>
			<SortableGrid
				items={items}
				onReorder={reorder}
				className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
				renderItem={(album) => <AlbumCard album={album} />}
			/>
			<UrlPagination page={albums.page} pageCount={albums.pageCount} />
		</div>
	);
}
