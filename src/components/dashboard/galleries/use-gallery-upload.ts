"use client";

import { useCallback } from "react";
import { useUploadQueue } from "@/hooks/use-upload-queue";
import { makeImagePreview } from "@/lib/media/make-preview";
import { putWithProgress } from "@/lib/media/read-media-metadata";
import {
	GALLERY_MAX_FILE_SIZE,
	isGalleryMime,
	PREVIEW_MAX_EDGE,
} from "@/services/galleries/constants";
import {
	confirmGalleryUpload,
	requestGalleryUpload,
} from "@/services/galleries/item-actions";

function precheck(file: File): string | undefined {
	if (!isGalleryMime(file.type)) return "unsupportedType";
	if (file.size > GALLERY_MAX_FILE_SIZE) return "tooLarge";
}

/** Preview made in the browser → two presigned PUTs to the private bucket → confirm. */
export function useGalleryUpload(galleryId: string, onUploaded: () => void) {
	const upload = useCallback(
		async (file: File, onProgress: (percent: number) => void) => {
			const preview = await makeImagePreview(file, PREVIEW_MAX_EDGE);
			const fileInfo = {
				galleryId,
				filename: file.name,
				mimeType: file.type,
				size: file.size,
				previewSize: preview.blob.size,
			};
			const presigned = await requestGalleryUpload(fileInfo);
			if (!presigned.ok) throw new Error(presigned.error);

			const { key, previewKey, uploadUrl, previewUploadUrl } = presigned.data;
			await putWithProgress(previewUploadUrl, preview.blob, () => {});
			await putWithProgress(uploadUrl, file, onProgress);

			const confirmed = await confirmGalleryUpload({
				...fileInfo,
				key,
				previewKey,
				width: preview.width,
				height: preview.height,
			});
			if (!confirmed.ok) throw new Error(confirmed.error);
		},
		[galleryId],
	);

	return useUploadQueue({ precheck, upload, onUploaded });
}
