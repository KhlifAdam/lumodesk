const PREVIEW_QUALITY = 0.82;

export interface ImagePreview {
	blob: Blob;
	/** Dimensions of the original image. */
	width: number;
	height: number;
}

/** Downscales an image in the browser to a JPEG no larger than `maxEdge`. */
export async function makeImagePreview(
	file: File,
	maxEdge: number,
): Promise<ImagePreview> {
	const bitmap = await createImageBitmap(file);
	const { width, height } = bitmap;
	const scale = Math.min(1, maxEdge / Math.max(width, height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.round(width * scale);
	canvas.height = Math.round(height * scale);

	const context = canvas.getContext("2d");
	if (!context) throw new Error("uploadFailed");
	context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();

	const blob = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob(resolve, "image/jpeg", PREVIEW_QUALITY),
	);
	if (!blob) throw new Error("uploadFailed");
	return { blob, width, height };
}
