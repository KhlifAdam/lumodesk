"use client";

import { useCallback, useRef, useState } from "react";
import {
	putWithProgress,
	readMediaMetadata,
} from "@/lib/media/read-media-metadata";
import { confirmUpload, requestUpload } from "@/services/media/actions";
import { MEDIA_LIMITS, mediaKindOf } from "@/services/media/constants";
import type { MediaItem } from "@/services/media/types";

const MAX_CONCURRENT_UPLOADS = 3;

export type UploadStatus = "queued" | "uploading" | "done" | "error";

export interface UploadTask {
	id: string;
	file: File;
	progress: number;
	status: UploadStatus;
	/** i18n key under `Errors`. */
	error?: string;
}

/** Client-side precheck so obviously invalid files fail without a round trip. */
function precheck(file: File): string | undefined {
	const kind = mediaKindOf(file.type);
	if (!kind) return "unsupportedType";
	if (file.size > MEDIA_LIMITS[kind].maxSize) return "tooLarge";
}

/**
 * Upload queue: presign → direct PUT to R2 → confirm.
 * Runs up to MAX_CONCURRENT_UPLOADS at once and calls `onUploaded` per file.
 */
export function useMediaUpload(onUploaded?: (media: MediaItem) => void) {
	const [tasks, setTasks] = useState<UploadTask[]>([]);
	const running = useRef(0);
	const queue = useRef<UploadTask[]>([]);

	const patch = useCallback((id: string, update: Partial<UploadTask>) => {
		setTasks((prev) =>
			prev.map((task) => (task.id === id ? { ...task, ...update } : task)),
		);
	}, []);

	const runTask = useCallback(
		async ({ id, file }: UploadTask) => {
			patch(id, { status: "uploading", progress: 0, error: undefined });
			try {
				const fileInfo = {
					filename: file.name,
					mimeType: file.type,
					size: file.size,
				};
				const [meta, presigned] = await Promise.all([
					readMediaMetadata(file),
					requestUpload(fileInfo),
				]);
				if (!presigned.ok) throw new Error(presigned.error);

				await putWithProgress(presigned.data.uploadUrl, file, (progress) =>
					patch(id, { progress }),
				);

				const confirmed = await confirmUpload({
					...fileInfo,
					...meta,
					key: presigned.data.key,
				});
				if (!confirmed.ok) throw new Error(confirmed.error);

				patch(id, { status: "done", progress: 100 });
				onUploaded?.(confirmed.data);
			} catch (error) {
				const message = error instanceof Error ? error.message : "";
				patch(id, {
					status: "error",
					error: /^[a-zA-Z]+$/.test(message) ? message : "uploadFailed",
				});
			}
		},
		[patch, onUploaded],
	);

	const pump = useCallback(() => {
		while (running.current < MAX_CONCURRENT_UPLOADS && queue.current.length) {
			const next = queue.current.shift();
			if (!next) break;
			running.current++;
			runTask(next).finally(() => {
				running.current--;
				pump();
			});
		}
	}, [runTask]);

	const enqueue = useCallback(
		(task: UploadTask) => {
			queue.current.push(task);
			pump();
		},
		[pump],
	);

	const addFiles = useCallback(
		(files: FileList | File[]) => {
			const created = Array.from(files).map<UploadTask>((file) => {
				const error = precheck(file);
				return {
					id: crypto.randomUUID(),
					file,
					progress: 0,
					status: error ? "error" : "queued",
					error,
				};
			});
			setTasks((prev) => [...created, ...prev]);
			for (const task of created) if (!task.error) enqueue(task);
		},
		[enqueue],
	);

	const retry = useCallback(
		(id: string) => {
			const task = tasks.find((t) => t.id === id);
			if (task && !precheck(task.file)) {
				patch(id, { status: "queued", error: undefined });
				enqueue(task);
			}
		},
		[tasks, patch, enqueue],
	);

	const clearFinished = useCallback(() => {
		setTasks((prev) => prev.filter((t) => t.status !== "done"));
	}, []);

	const isUploading = tasks.some(
		(t) => t.status === "queued" || t.status === "uploading",
	);

	return { tasks, addFiles, retry, clearFinished, isUploading };
}
