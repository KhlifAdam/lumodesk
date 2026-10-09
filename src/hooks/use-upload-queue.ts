"use client";

import { useCallback, useRef, useState } from "react";

const DEFAULT_CONCURRENCY = 3;

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
	/**
	 * Uploads one file, reporting progress 0–100; throws an `Errors` key on
	 * failure. `signal` aborts when the person cancels that file.
	 */
	upload: (
		file: File,
		onProgress: (percent: number) => void,
		signal: AbortSignal,
	) => Promise<T>;
	onUploaded?: (result: T) => void;
	/** Files sent at once. */
	concurrency?: number;
}

/** Concurrent upload queue with per-file progress, errors, retry and cancel. */
export function useUploadQueue<T>({
	precheck,
	upload,
	onUploaded,
	concurrency = DEFAULT_CONCURRENCY,
}: UploadQueueOptions<T>) {
	const [tasks, setTasks] = useState<UploadTask[]>([]);
	const running = useRef(0);
	const queue = useRef<UploadTask[]>([]);
	const controllers = useRef(new Map<string, AbortController>());

	const patch = useCallback((id: string, update: Partial<UploadTask>) => {
		setTasks((prev) =>
			prev.map((task) => (task.id === id ? { ...task, ...update } : task)),
		);
	}, []);

	const runTask = useCallback(
		async ({ id, file }: UploadTask) => {
			const controller = new AbortController();
			controllers.current.set(id, controller);
			patch(id, { status: "uploading", progress: 0, error: undefined });
			try {
				const result = await upload(
					file,
					(progress) => patch(id, { progress }),
					controller.signal,
				);
				patch(id, { status: "done", progress: 100 });
				onUploaded?.(result);
			} catch (error) {
				const message = error instanceof Error ? error.message : "";
				patch(id, {
					status: "error",
					error: controller.signal.aborted
						? "uploadCancelled"
						: /^[a-zA-Z]+$/.test(message)
							? message
							: "uploadFailed",
				});
			} finally {
				controllers.current.delete(id);
			}
		},
		[patch, upload, onUploaded],
	);

	const pump = useCallback(() => {
		while (running.current < concurrency && queue.current.length) {
			const next = queue.current.shift();
			if (!next) break;
			running.current++;
			runTask(next).finally(() => {
				running.current--;
				pump();
			});
		}
	}, [runTask, concurrency]);

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

	/** Stops a file: a running one is aborted, a waiting one leaves the queue. */
	const cancel = useCallback(
		(id: string) => {
			const controller = controllers.current.get(id);
			if (controller) return controller.abort();
			queue.current = queue.current.filter((task) => task.id !== id);
			patch(id, { status: "error", error: "uploadCancelled" });
		},
		[patch],
	);

	const clearFinished = useCallback(() => {
		setTasks((prev) => prev.filter((t) => t.status !== "done"));
	}, []);

	const isUploading = tasks.some(
		(t) => t.status === "queued" || t.status === "uploading",
	);

	return { tasks, addFiles, retry, cancel, clearFinished, isUploading };
}
