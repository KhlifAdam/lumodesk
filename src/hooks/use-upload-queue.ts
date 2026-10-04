"use client";

import { useCallback, useRef, useState } from "react";

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

interface UploadQueueOptions<T> {
	/** Returns an `Errors` key when the file can be rejected without a round trip. */
	precheck: (file: File) => string | undefined;
	/** Uploads one file, reporting progress 0–100; throws an `Errors` key on failure. */
	upload: (file: File, onProgress: (percent: number) => void) => Promise<T>;
	onUploaded?: (result: T) => void;
}

/** Concurrent upload queue with per-file progress, errors and retry. */
export function useUploadQueue<T>({
	precheck,
	upload,
	onUploaded,
}: UploadQueueOptions<T>) {
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
				const result = await upload(file, (progress) =>
					patch(id, { progress }),
				);
				patch(id, { status: "done", progress: 100 });
				onUploaded?.(result);
			} catch (error) {
				const message = error instanceof Error ? error.message : "";
				patch(id, {
					status: "error",
					error: /^[a-zA-Z]+$/.test(message) ? message : "uploadFailed",
				});
			}
		},
		[patch, upload, onUploaded],
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
		[precheck, enqueue],
	);

	const retry = useCallback(
		(id: string) => {
			const task = tasks.find((t) => t.id === id);
			if (task && !precheck(task.file)) {
				patch(id, { status: "queued", error: undefined });
				enqueue(task);
			}
		},
		[tasks, precheck, patch, enqueue],
	);

	const clearFinished = useCallback(() => {
		setTasks((prev) => prev.filter((t) => t.status !== "done"));
	}, []);

	const isUploading = tasks.some(
		(t) => t.status === "queued" || t.status === "uploading",
	);

	return { tasks, addFiles, retry, clearFinished, isUploading };
}
