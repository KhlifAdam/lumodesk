"use client";

import useSWR from "swr";
import { cn } from "@/lib/utils";
import type { MessageRole } from "@/services/messages/viewer";
import { fetchJson, usePolling } from "./polling";

const POLL_MS = 15000;

export const unreadKey = (role: MessageRole) =>
	`/api/messages/unread?as=${role}`;

/** Live count of unread messages; hidden when there are none. */
export function UnreadBadge({
	side,
	initial,
	className,
}: {
	side: MessageRole;
	initial: number;
	className?: string;
}) {
	const { signedOut, options } = usePolling(POLL_MS);
	const { data } = useSWR(
		signedOut ? null : unreadKey(side),
		fetchJson<{ count: number }>,
		{ ...options, fallbackData: { count: initial } },
	);
	const count = signedOut ? 0 : (data?.count ?? 0);
	if (count <= 0) return null;

	return (
		<span
			className={cn(
				"flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground",
				className,
			)}
		>
			{count > 99 ? "99+" : count}
		</span>
	);
}
