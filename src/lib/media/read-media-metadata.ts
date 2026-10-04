export interface MediaMetadata {
	width?: number;
	height?: number;
	durationSec?: number;
}

/** Reads dimensions (and video duration) in the browser before upload. */
export function readMediaMetadata(file: File): Promise<MediaMetadata> {
	const url = URL.createObjectURL(file);
	const done = (meta: MediaMetadata) => {
		URL.revokeObjectURL(url);
		return meta;
	};

	return new Promise((resolve) => {
		if (file.type.startsWith("image/")) {
			const img = new Image();
			img.onload = () =>
				resolve(done({ width: img.naturalWidth, height: img.naturalHeight }));
			img.onerror = () => resolve(done({}));
			img.src = url;
			return;
		}

		const video = document.createElement("video");
		video.preload = "metadata";
		video.onloadedmetadata = () =>
			resolve(
				done({
					width: video.videoWidth || undefined,
					height: video.videoHeight || undefined,
					durationSec: Number.isFinite(video.duration)
						? video.duration
						: undefined,
				}),
			);
		video.onerror = () => resolve(done({}));
		video.src = url;
	});
}

/** PUTs a file to a presigned URL, reporting progress (0–100). */
export function putWithProgress(
	url: string,
	file: File,
	onProgress: (percent: number) => void,
): Promise<void> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("PUT", url);
		xhr.setRequestHeader("Content-Type", file.type);
		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable)
				onProgress(Math.round((event.loaded / event.total) * 100));
		};
		xhr.onload = () =>
			xhr.status >= 200 && xhr.status < 300
				? resolve()
				: reject(new Error(`Upload failed with status ${xhr.status}`));
		xhr.onerror = () => reject(new Error("Network error during upload"));
		xhr.send(file);
	});
}
