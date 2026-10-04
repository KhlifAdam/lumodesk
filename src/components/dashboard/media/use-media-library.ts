"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { fetchMediaPage } from "@/services/media/actions";
import type { MediaFilter } from "@/services/media/schemas";
import type { MediaItem } from "@/services/media/types";

/** Incrementally loads the photographer's library (used by pickers). */
export function useMediaLibrary(type: MediaFilter, enabled: boolean) {
	const [items, setItems] = useState<MediaItem[]>([]);
	const [page, setPage] = useState(0);
	const [pageCount, setPageCount] = useState(1);
	const [isLoading, startTransition] = useTransition();

	const load = useCallback(
		(target: number) =>
			startTransition(async () => {
				const result = await fetchMediaPage({ page: target, type });
				if (!result.ok) return;
				setItems((prev) =>
					target === 1 ? result.data.items : [...prev, ...result.data.items],
				);
				setPage(target);
				setPageCount(result.data.pageCount);
			}),
		[type],
	);

	useEffect(() => {
		if (enabled) load(1);
	}, [enabled, load]);

	const prepend = useCallback((media: MediaItem) => {
		setItems((prev) => [media, ...prev.filter((m) => m.id !== media.id)]);
	}, []);

	return {
		items,
		isLoading,
		hasMore: page < pageCount,
		loadMore: () => load(page + 1),
		prepend,
	};
}
