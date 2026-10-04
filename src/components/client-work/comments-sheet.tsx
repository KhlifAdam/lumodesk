"use client";

import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useErrorMessage } from "@/hooks/use-error-message";
import { cn } from "@/lib/utils";
import {
	addComment,
	fetchComments,
} from "@/services/galleries/comment-actions";
import { COMMENT_MAX_LENGTH } from "@/services/galleries/constants";
import type { GalleryComment, GalleryPhoto } from "@/services/galleries/types";

/** Shared thread on one photo, for the photographer and the client. */
export function CommentsSheet({
	photo,
	onClose,
}: {
	photo: GalleryPhoto | null;
	onClose: () => void;
}) {
	const t = useTranslations("Galleries.comments");
	const format = useFormatter();
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const [comments, setComments] = useState<GalleryComment[] | null>(null);
	const [body, setBody] = useState("");
	const [isSending, startSending] = useTransition();
	const photoId = photo?.id;

	useEffect(() => {
		if (!photoId) return;
		let active = true;
		setComments(null);
		fetchComments(photoId).then((result) => {
			if (!active) return;
			if (result.ok) setComments(result.data);
			else toast.error(errorMessage(result.error));
		});
		return () => {
			active = false;
		};
	}, [photoId]);

	const send = () =>
		startSending(async () => {
			if (!photoId || !body.trim()) return;
			const result = await addComment({ itemId: photoId, body });
			if (!result.ok) return void toast.error(errorMessage(result.error));
			setBody("");
			const refreshed = await fetchComments(photoId);
			if (refreshed.ok) setComments(refreshed.data);
			router.refresh();
		});

	return (
		<Sheet open={photo !== null} onOpenChange={(open) => !open && onClose()}>
			<SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
				<SheetHeader className="border-b border-border p-4">
					<SheetTitle className="text-sm">{t("title")}</SheetTitle>
					<SheetDescription className="truncate text-xs">
						{photo?.filename}
					</SheetDescription>
				</SheetHeader>
				<div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
					{comments === null ? (
						<Loader2 className="mx-auto mt-6 h-4 w-4 animate-spin text-muted-foreground" />
					) : comments.length === 0 ? (
						<p className="mt-6 text-center text-xs text-muted-foreground">
							{t("empty")}
						</p>
					) : (
						comments.map((comment) => (
							<div
								key={comment.id}
								className={cn(
									"max-w-[85%] rounded-xl px-3 py-2",
									comment.mine
										? "self-end bg-primary/10"
										: "self-start bg-muted",
								)}
							>
								<p className="text-[11px] font-medium text-muted-foreground">
									{comment.authorName}
									{comment.byPhotographer && ` · ${t("photographer")}`}
								</p>
								<p className="whitespace-pre-wrap break-words text-sm">
									{comment.body}
								</p>
								<p className="mt-0.5 text-[10px] text-muted-foreground">
									{format.dateTime(new Date(comment.createdAt), {
										dateStyle: "medium",
										timeStyle: "short",
									})}
								</p>
							</div>
						))
					)}
				</div>
				<form
					className="flex items-end gap-2 border-t border-border p-3"
					onSubmit={(event) => {
						event.preventDefault();
						send();
					}}
				>
					<Textarea
						value={body}
						onChange={(event) => setBody(event.target.value)}
						maxLength={COMMENT_MAX_LENGTH}
						placeholder={t("placeholder")}
						rows={2}
						className="min-h-0 resize-none text-sm"
					/>
					<Button
						type="submit"
						size="icon"
						className="h-8 w-8 shrink-0"
						disabled={isSending || !body.trim()}
						aria-label={t("send")}
					>
						{isSending ? (
							<Loader2 className="h-3.5 w-3.5 animate-spin" />
						) : (
							<Send className="h-3.5 w-3.5" />
						)}
					</Button>
				</form>
			</SheetContent>
		</Sheet>
	);
}
