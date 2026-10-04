"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/action-result";
import { useErrorMessage } from "./use-error-message";

/**
 * Local copy of a server-ordered list: reorders apply instantly, persist via
 * `save(ids)`, and roll back with a toast if the action fails.
 */
export function useOptimisticOrder<T extends { id: string }>(
	serverItems: T[],
	save: (ids: string[]) => Promise<ActionResult>,
) {
	const [items, setItems] = useState(serverItems);
	const [isSaving, startTransition] = useTransition();
	const errorMessage = useErrorMessage();
	const router = useRouter();

	// Re-sync when the server sends fresh data (after refresh/revalidate).
	useEffect(() => setItems(serverItems), [serverItems]);

	const reorder = (next: T[]) => {
		const previous = items;
		setItems(next);
		startTransition(async () => {
			const result = await save(next.map((item) => item.id));
			if (!result.ok) {
				setItems(previous);
				toast.error(errorMessage(result.error));
				// A stale view (e.g. changed in another tab) re-syncs from the server.
				router.refresh();
			}
		});
	};

	return { items, setItems, reorder, isSaving };
}
