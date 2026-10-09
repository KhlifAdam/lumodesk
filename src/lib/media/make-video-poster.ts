const POSTER_QUALITY = 0.8;
/** Some codecs (e.g. HEVC in Chrome) never load; give up rather than hang. */
const TIMEOUT_MS = 10_000;

export interface VideoPoster {
	blob: Blob;
	width: number;
	height: number;
	durationSec?: number;
}

function once(target: EventTarget, event: string) {
	return new Promise<void>((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS);
		target.addEventListener(
			event,
			() => {
				clearTimeout(timer);
				resolve();
			},
			{ once: true },
		);
		target.addEventListener(
			"error",
			() => {
				clearTimeout(timer);
				reject(new Error("unreadable"));
			},
			{ once: true },
		);
	});
}

/**
 * A JPEG still from early in the video, made in the browser, to show in the
 * gallery grid. Null when the browser can't decode the video.
 */
export async function makeVideoPoster(
	file: File,
	maxEdge: number,
): Promise<VideoPoster | null> {
	const url = URL.createObjectURL(file);
	const video = document.createElement("video");
	video.muted = true;
	video.playsInline = true;
	video.preload = "auto";
	try {
		video.src = url;
		await once(video, "loadeddata");
		const duration = Number.isFinite(video.duration) ? video.duration : 0;
		video.currentTime = Math.min(1, duration / 3);
		await once(video, "seeked");

		const { videoWidth: width, videoHeight: height } = video;
		if (!width || !height) return null;
		const scale = Math.min(1, maxEdge / Math.max(width, height));
		const canvas = document.createElement("canvas");
		canvas.width = Math.round(width * scale);
		canvas.height = Math.round(height * scale);
		canvas
			.getContext("2d")
			?.drawImage(video, 0, 0, canvas.width, canvas.height);
		const blob = await new Promise<Blob | null>((resolve) =>
			canvas.toBlob(resolve, "image/jpeg", POSTER_QUALITY),
		);
		return blob
			? { blob, width, height, durationSec: duration || undefined }
			: null;
	} catch {
		return null;
	} finally {
		video.removeAttribute("src");
		video.load();
		URL.revokeObjectURL(url);
	}
}
