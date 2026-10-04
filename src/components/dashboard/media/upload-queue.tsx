"use client";

import { CheckCircle2, FileImage, FileVideo, RotateCcw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { UploadTask } from "@/components/dashboard/media/use-media-upload";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useErrorMessage } from "@/hooks/use-error-message";
import { formatBytes } from "@/lib/format";

interface UploadQueueProps {
	tasks: UploadTask[];
	onRetry: (id: string) => void;
	onClear: () => void;
}

export function UploadQueue({ tasks, onRetry, onClear }: UploadQueueProps) {
	const t = useTranslations();
	const locale = useLocale();
	const errorMessage = useErrorMessage();

	if (tasks.length === 0) return null;
	const doneCount = tasks.filter((task) => task.status === "done").length;

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3">
			<div className="flex items-center justify-between">
				<p className="text-xs font-medium">
					{t("Media.queue.summary", { done: doneCount, total: tasks.length })}
				</p>
				{doneCount > 0 && (
					<Button variant="ghost" size="sm" onClick={onClear}>
						{t("Media.queue.clear")}
					</Button>
				)}
			</div>
			<ul className="flex max-h-48 flex-col gap-1.5 overflow-y-auto">
				{tasks.map((task) => {
					const Icon = task.file.type.startsWith("video/")
						? FileVideo
						: FileImage;
					return (
						<li
							key={task.id}
							className="flex items-center gap-3 rounded-lg bg-muted/50 px-2.5 py-1.5"
						>
							<Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
							<div className="flex min-w-0 flex-1 flex-col gap-1.5">
								<div className="flex items-center justify-between gap-2 text-xs">
									<span className="truncate font-medium">{task.file.name}</span>
									<span className="shrink-0 text-muted-foreground">
										{formatBytes(task.file.size, locale)}
									</span>
								</div>
								{task.status === "error" ? (
									<p className="text-xs text-destructive">
										{errorMessage(task.error)}
									</p>
								) : (
									<Progress value={task.progress} className="h-1.5" />
								)}
							</div>
							{task.status === "done" && (
								<CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
							)}
							{task.status === "error" &&
								task.error !== "unsupportedType" &&
								task.error !== "tooLarge" && (
									<Button
										variant="ghost"
										size="icon"
										className="h-7 w-7"
										onClick={() => onRetry(task.id)}
										aria-label={t("Media.queue.retry")}
									>
										<RotateCcw className="h-3.5 w-3.5" />
									</Button>
								)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
