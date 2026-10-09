/** Parts sent at once for one file. */
const PART_CONCURRENCY = 3;
/** Tries per part before the whole file is marked as failed (it can resume). */
const PART_ATTEMPTS = 4;
const RETRY_BASE_MS = 1000;

type Signer = (
	partNumbers: number[],
) => Promise<{ partNumber: number; url: string }[]>;

interface UploadPartsOptions {
	file: File;
	partSize: number;
	totalParts: number;
	/** Parts already stored (a resumed upload): they are skipped. */
	doneParts: number[];
	/** How many part URLs one call may sign. */
	signBatch: number;
	sign: Signer;
	onProgress: (percent: number) => void;
	signal?: AbortSignal;
}

export class UploadCancelledError extends Error {
	constructor() {
		super("uploadCancelled");
	}
}

/** PUTs one slice; resolves on 2xx, rejects with the status otherwise. */
function putPart(
	url: string,
	body: Blob,
	onProgress: (loaded: number) => void,
	signal?: AbortSignal,
): Promise<void> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		const abort = () => xhr.abort();
		signal?.addEventListener("abort", abort, { once: true });
		xhr.open("PUT", url);
		xhr.upload.onprogress = (event) => onProgress(event.loaded);
		xhr.onload = () => {
			signal?.removeEventListener("abort", abort);
			if (xhr.status >= 200 && xhr.status < 300) resolve();
			else reject(new Error(`status ${xhr.status}`));
		};
		xhr.onerror = () => reject(new Error("network"));
		xhr.onabort = () => reject(new UploadCancelledError());
		xhr.send(body);
	});
}

const wait = (ms: number, signal?: AbortSignal) =>
	new Promise<void>((resolve, reject) => {
		const timer = setTimeout(resolve, ms);
		signal?.addEventListener(
			"abort",
			() => {
				clearTimeout(timer);
				reject(new UploadCancelledError());
			},
			{ once: true },
		);
	});

/**
 * Sends a file to the bucket part by part, a few at a time. A failed part is
 * tried again with a growing pause; parts already stored are skipped, so a
 * stopped upload resumes where it was.
 */
export async function uploadParts({
	file,
	partSize,
	totalParts,
	doneParts,
	signBatch,
	sign,
	onProgress,
	signal,
}: UploadPartsOptions) {
	const sizeOf = (n: number) =>
		Math.min(partSize, file.size - (n - 1) * partSize);
	const done = new Set(doneParts);
	const todo = Array.from({ length: totalParts }, (_, i) => i + 1).filter(
		(n) => !done.has(n),
	);

	let stored = doneParts.reduce((sum, n) => sum + sizeOf(n), 0);
	const inFlight = new Map<number, number>();
	const report = () => {
		const sending = [...inFlight.values()].reduce((a, b) => a + b, 0);
		onProgress(
			Math.min(100, Math.round(((stored + sending) / file.size) * 100)),
		);
	};
	report();

	// URLs are signed in batches, just ahead of the parts that need them.
	const urls = new Map<number, string>();
	const urlFor = async (n: number, fresh = false) => {
		if (fresh) urls.delete(n);
		if (!urls.has(n)) {
			const start = todo.indexOf(n);
			const batch = todo
				.slice(start, start + signBatch)
				.filter((m) => m === n || !urls.has(m));
			for (const { partNumber, url } of await sign(batch))
				urls.set(partNumber, url);
		}
		return urls.get(n) as string;
	};

	const sendPart = async (n: number) => {
		const body = file.slice((n - 1) * partSize, (n - 1) * partSize + sizeOf(n));
		for (let attempt = 1; ; attempt++) {
			if (signal?.aborted) throw new UploadCancelledError();
			try {
				// After a failure the URL may have expired: sign it again.
				const url = await urlFor(n, attempt > 1);
				await putPart(
					url,
					body,
					(loaded) => {
						inFlight.set(n, loaded);
						report();
					},
					signal,
				);
				inFlight.delete(n);
				stored += sizeOf(n);
				report();
				return;
			} catch (error) {
				inFlight.delete(n);
				if (error instanceof UploadCancelledError) throw error;
				if (attempt >= PART_ATTEMPTS) throw new Error("uploadFailed");
				await wait(RETRY_BASE_MS * 3 ** (attempt - 1), signal);
			}
		}
	};

	let next = 0;
	const worker = async () => {
		while (next < todo.length) {
			const n = todo[next++];
			await sendPart(n);
		}
	};
	await Promise.all(
		Array.from({ length: Math.min(PART_CONCURRENCY, todo.length) }, worker),
	);
}
