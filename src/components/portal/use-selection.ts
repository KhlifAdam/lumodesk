"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useErrorMessage } from "@/hooks/use-error-message";
import { toggleSelection } from "@/services/galleries/selection-actions";
import type { GalleryPhoto } from "@/services/galleries/types";

/**
 * Client picks with instant feedback: the heart flips at once and is rolled
 * back if the server refuses (limit reached, selection closed).
 */
export function useSelection(serverItems: GalleryPhoto[], serverCount: number) {
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const [items, setItems] = useState(serverItems);
	const [selectedCount, setSelectedCount] = useState(serverCount);
	const [pending, setPending] = useState<Set<string>>(new Set());

	useEffect(() => setItems(serverItems), [serverItems]);
	useEffect(() => setSelectedCount(serverCount), [serverCount]);

	const setSelected = (id: string, selected: boolean) =>
		setItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, selected } : item)),
		);

	const toggle = async (photo: GalleryPhoto) => {
		if (pending.has(photo.id)) return;
		const selected = !photo.selected;
		setPending((prev) => new Set(prev).add(photo.id));
		setSelected(photo.id, selected);
		setSelectedCount((count) => count + (selected ? 1 : -1));

		const result = await toggleSelection({ itemId: photo.id, selected });
		setPending((prev) => {
			const next = new Set(prev);
			next.delete(photo.id);
			return next;
		});
		if (result.ok) {
			setSelectedCount(result.data.selectedCount);
			return;
		}
		setSelected(photo.id, !selected);
		setSelectedCount((count) => count - (selected ? 1 : -1));
		toast.error(errorMessage(result.error));
		router.refresh();
	};

	return { items, selectedCount, toggle };
}
