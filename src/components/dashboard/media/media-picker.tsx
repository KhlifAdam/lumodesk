"use client";

import { Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMediaLibrary } from "@/components/dashboard/media/use-media-library";
import { useMediaUpload } from "@/components/dashboard/media/use-media-upload";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ACCEPTED_MIME_TYPES, MEDIA_LIMITS } from "@/services/media/constants";
import type { MediaFilter } from "@/services/media/schemas";
import type { MediaItem } from "@/services/media/types";
import { MediaDropzone } from "./media-dropzone";
import { MediaThumb } from "./media-thumb";
import { UploadQueue } from "./upload-queue";

interface MediaPickerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: (media: MediaItem[]) => void;
	multiple?: boolean;
	type?: MediaFilter;
	title?: string;
}

/** Pick one or many items from the library, or upload new ones inline. */
export function MediaPicker({
	open,
	onOpenChange,
	onConfirm,
	multiple = false,
	type = "all",
	title,
}: MediaPickerProps) {
	const t = useTranslations("Media.picker");
	const [tab, setTab] = useState("library");
	const [selected, setSelected] = useState<MediaItem[]>([]);
	const library = useMediaLibrary(type, open);
	const accept =
		type === "image"
			? MEDIA_LIMITS.IMAGE.mimeTypes
			: type === "video"
				? MEDIA_LIMITS.VIDEO.mimeTypes
				: ACCEPTED_MIME_TYPES;

	const toggle = (media: MediaItem) =>
		setSelected((prev) => {
			if (prev.some((m) => m.id === media.id))
				return prev.filter((m) => m.id !== media.id);
			return multiple ? [...prev, media] : [media];
		});

	const upload = useMediaUpload((media) => {
		library.prepend(media);
		toggle(media);
		setTab("library");
	});

	const close = (next: boolean) => {
		if (!next) setSelected([]);
		onOpenChange(next);
	};

	return (
		<Dialog open={open} onOpenChange={close}>
			<DialogContent className="flex max-h-[85vh] flex-col sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>{title ?? t("title")}</DialogTitle>
					<DialogDescription>
						{multiple ? t("hintMultiple") : t("hintSingle")}
					</DialogDescription>
				</DialogHeader>

				<Tabs
					value={tab}
					onValueChange={setTab}
					className="flex min-h-0 flex-1 flex-col"
				>
					<TabsList className="self-start">
						<TabsTrigger value="library">{t("library")}</TabsTrigger>
						<TabsTrigger value="upload">{t("upload")}</TabsTrigger>
					</TabsList>

					<TabsContent
						value="library"
						className="min-h-0 flex-1 overflow-y-auto"
					>
						{library.items.length === 0 && !library.isLoading ? (
							<p className="py-12 text-center text-sm text-muted-foreground">
								{t("empty")}
							</p>
						) : (
							<div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
								{library.items.map((media) => {
									const isSelected = selected.some((m) => m.id === media.id);
									return (
										<button
											key={media.id}
											type="button"
											onClick={() => toggle(media)}
											className={cn(
												"relative overflow-hidden rounded-lg border-2 transition-all duration-200",
												isSelected
													? "border-primary shadow-luminous"
													: "border-transparent hover:border-border",
											)}
										>
											<MediaThumb media={media} sizes="160px" />
											{isSelected && (
												<span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
													<Check className="h-3 w-3" />
												</span>
											)}
										</button>
									);
								})}
							</div>
						)}
						{(library.hasMore || library.isLoading) && (
							<div className="flex justify-center pt-4">
								<Button
									variant="ghost"
									size="sm"
									onClick={library.loadMore}
									disabled={library.isLoading}
								>
									{library.isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{t("loadMore")}
								</Button>
							</div>
						)}
					</TabsContent>

					<TabsContent value="upload" className="flex flex-col gap-4">
						<MediaDropzone onFiles={upload.addFiles} accept={accept} />
						<UploadQueue
							tasks={upload.tasks}
							onRetry={upload.retry}
							onClear={upload.clearFinished}
						/>
					</TabsContent>
				</Tabs>

				<DialogFooter>
					<Button variant="ghost" onClick={() => close(false)}>
						{t("cancel")}
					</Button>
					<Button
						disabled={selected.length === 0 || upload.isUploading}
						onClick={() => {
							onConfirm(selected);
							close(false);
						}}
					>
						{t("confirm", { count: selected.length })}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
