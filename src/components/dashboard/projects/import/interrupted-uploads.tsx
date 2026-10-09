"use client";

import { RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatBytes } from "@/lib/format";
import { abortGalleryUpload } from "@/services/galleries/upload-actions";
import type { InterruptedUpload } from "@/services/galleries/upload-queries";

interface InterruptedUploadsProps {
	uploads: InterruptedUpload[];
	/** Switches to the upload's gallery and asks for the same file again. */
	onResume: (galleryId: string) => void;
	disabled: boolean;
}

/** Uploads that stopped half-way: resume by choosing the same file, or drop them. */
export function InterruptedUploads({
	uploads,
	onResume,
	disabled,
}: InterruptedUploadsProps) {
	const t = useTranslations("Projects.import.interrupted");
	const locale = useLocale();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	if (uploads.length === 0) return null;

	const discard = (id: string) =>
		startTransition(async () => {
			await abortGalleryUpload(id);
			toast.success(t("discarded"));
			router.refresh();
		});

	return (
		<section className="flex flex-col gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3">
			<div>
				<h2 className="text-sm font-semibold">
					{t("title", { count: uploads.length })}
				</h2>
				<p className="text-xs text-muted-foreground">{t("hint")}</p>
			</div>
			<ul className="flex flex-col gap-1.5">
				{uploads.map((upload) => (
					<li
						key={upload.id}
						className="flex items-center gap-3 rounded-lg bg-card px-2.5 py-1.5"
					>
						<div className="flex min-w-0 flex-1 flex-col gap-1">
							<div className="flex items-center justify-between gap-2 text-xs">
								<span className="truncate font-medium">{upload.filename}</span>
								<span className="shrink-0 text-muted-foreground">
									{t("progress", {
										uploaded: formatBytes(upload.uploaded, locale),
										total: formatBytes(upload.size, locale),
										gallery: upload.galleryTitle,
									})}
								</span>
							</div>
							<Progress
								value={(upload.uploaded / upload.size) * 100}
								className="h-1.5"
							/>
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="h-7 gap-1.5 text-xs"
							disabled={disabled || isPending}
							onClick={() => onResume(upload.galleryId)}
						>
							<RotateCcw className="h-3.5 w-3.5" />
							{t("resume")}
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
							aria-label={t("discard")}
							disabled={isPending}
							onClick={() => discard(upload.id)}
						>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
					</li>
				))}
			</ul>
		</section>
	);
}
