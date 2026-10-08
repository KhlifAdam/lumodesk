import { MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { ListSkeleton } from "@/components/dashboard/shared/list-skeleton";
import { cn } from "@/lib/utils";
import {
	findConversationWith,
	findNewPartner,
	getThread,
	listConversations,
} from "@/services/messages/queries";
import type { MessagesParams } from "@/services/messages/schemas";
import type { Thread } from "@/services/messages/types";
import type { Viewer } from "@/services/messages/viewer";
import { ConversationList } from "./conversation-list";
import { MessageThread } from "./message-thread";

interface MessagesViewProps {
	viewer: Viewer;
	params: MessagesParams;
	basePath: string;
	timeZone: string;
	/** Fixed height of the panel, for pages without their own flex container. */
	className?: string;
}

/** `?c=` opens a conversation; a partner id opens (or starts) one with them. */
function requestedPartner(viewer: Viewer, params: MessagesParams) {
	return viewer.role === "photographer" ? params.client : params.studio;
}

/** Two panes on wide screens; one at a time on phones. */
export function MessagesView(props: MessagesViewProps) {
	const { viewer, params, basePath, timeZone, className } = props;
	const hasSelection = Boolean(params.c || requestedPartner(viewer, params));

	return (
		<div
			className={cn(
				"grid min-h-0 gap-3 md:grid-cols-[20rem_minmax(0,1fr)]",
				className,
			)}
		>
			<div
				className={cn(
					"min-h-0 overflow-y-auto",
					hasSelection && "hidden md:block",
				)}
			>
				<Suspense fallback={<ListSkeleton rows={5} />}>
					<ListPane
						viewer={viewer}
						page={params.page}
						activeId={params.c}
						basePath={basePath}
						timeZone={timeZone}
					/>
				</Suspense>
			</div>
			<section
				className={cn(
					"min-h-0 overflow-hidden rounded-xl border border-border bg-card",
					!hasSelection && "hidden md:block",
				)}
			>
				<Suspense
					key={`${params.c}-${requestedPartner(viewer, params)}`}
					fallback={<div className="h-full animate-pulse bg-muted/40" />}
				>
					<ThreadPane
						viewer={viewer}
						params={params}
						basePath={basePath}
						timeZone={timeZone}
					/>
				</Suspense>
			</section>
		</div>
	);
}

async function ListPane({
	viewer,
	page,
	activeId,
	basePath,
	timeZone,
}: {
	viewer: Viewer;
	page: number;
	activeId: string | undefined;
	basePath: string;
	timeZone: string;
}) {
	const conversations = await listConversations(viewer, page);
	return (
		<ConversationList
			conversations={conversations}
			activeId={activeId}
			basePath={basePath}
			timeZone={timeZone}
		/>
	);
}

async function ThreadPane({
	viewer,
	params,
	basePath,
	timeZone,
}: Omit<MessagesViewProps, "className">) {
	const t = await getTranslations("Messages.thread");
	const thread = await resolveThread(viewer, params, basePath);

	if (!thread) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
				<MessageSquare className="h-5 w-5 text-muted-foreground" />
				<p className="text-xs text-muted-foreground">
					{params.c || requestedPartner(viewer, params)
						? t("unavailable")
						: t("select")}
				</p>
			</div>
		);
	}

	return (
		<MessageThread
			key={thread.id ?? thread.partner.id}
			thread={thread}
			viewer={viewer}
			basePath={basePath}
			timeZone={timeZone}
		/>
	);
}

async function resolveThread(
	viewer: Viewer,
	params: MessagesParams,
	basePath: string,
): Promise<Thread | null> {
	if (params.c) return getThread(viewer, params.c);

	const partnerId = requestedPartner(viewer, params);
	if (!partnerId) return null;
	const existing = await findConversationWith(viewer, partnerId);
	if (existing) redirect(`${basePath}?c=${existing.id}`);

	const partner = await findNewPartner(viewer, partnerId);
	return partner ? { id: null, partner, messages: [], hasMore: false } : null;
}
