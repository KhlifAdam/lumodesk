"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import useSWR from "swr";
import type { MessageRole } from "@/services/messages/viewer";
import { fetchJson, usePolling } from "./polling";
import { unreadKey } from "./unread-badge";

const POLL_MS = 8000;

/**
 * Keeps the conversation list current, like Messenger: when the unread count
 * changes (a message arrived, or one was read elsewhere), the list is redrawn
 * so the right conversations turn bold. Renders nothing.
 */
export function LiveRefresh({ side }: { side: MessageRole }) {
	const router = useRouter();
	const { signedOut, options } = usePolling(POLL_MS);
	const { data } = useSWR(
		signedOut ? null : unreadKey(side),
		fetchJson<{ count: number }>,
		options,
	);
	const previous = useRef<number | undefined>(undefined);

	useEffect(() => {
		if (data === undefined) return;
		if (previous.current !== undefined && previous.current !== data.count)
			router.refresh();
		previous.current = data.count;
	}, [data, router]);

	return null;
}
