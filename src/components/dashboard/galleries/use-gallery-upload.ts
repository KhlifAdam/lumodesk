"use client";

import { useCallback } from "react";
import { useUploadQueue } from "@/hooks/use-upload-queue";
import { makeImagePreview } from "@/lib/media/make-preview";
import { makeVideoPoster } from "@/lib/media/make-video-poster";
import {
	UploadCancelledError,
	uploadParts,
} from "@/lib/media/multipart-upload";
import {
	putWithProgress,
	readMediaMetadata,
} from "@/lib/media/read-media-metadata";
import {
	galleryMaxSize,
	isGalleryMime,
	isGalleryVideo,
	PART_URLS_PER_REQUEST,
	PREVIEW_MAX_EDGE,
} from "@/services/galleries/constants";
import {
	abortGalleryUpload,
	completeGalleryUpload,
	signUploadParts,
	startGalleryUpload,
} from "@/services/galleries/upload-actions";

/** Large files go one or two at a time; each already sends parts in parallel. */
const FILES_AT_ONCE = 2;

function precheck(file: File): string | undefined {
	if (!isGalleryMime(file.type)) return "unsupportedType";
	if (file.size > galleryMaxSize(file.type)) return "tooLarge";
}

interface FileInfo {
	/** Browser-made JPEG preview; null when the browser can't read the file. */
	blob: Blob | null;
	width?: number;
	height?: number;
	durationSec?: number;
}

async function describe(file: File): Promise<FileInfo> {
	if (isGalleryVideo(file.type)) {
		const poster = await makeVideoPoster(file, PREVIEW_MAX_EDGE);
		if (poster) return poster;
		const meta = await readMediaMetadata(file);
		return { blob: null, ...meta };
	}
	const preview = await makeImagePreview(file, PREVIEW_MAX_EDGE).catch(
		() => null,
	);
	return preview ?? { blob: null };
}

/**
 * Preview made in the browser → the file sent in parts (resumable) → the
 * server assembles it and adds it to the gallery. `galleryId` null disables it.
 */
export function useGalleryUpload(
	galleryId: string | null,
	onUploaded: () => void,
) {
	const upload = useCallback(
		async (
			file: File,
			onProgress: (percent: number) => void,
			signal: AbortSignal,
		) => {
			if (!galleryId) throw new Error("noGallery");
			const info = await describe(file);
			const previewSize = info.blob?.size ?? null;

			const started = await startGalleryUpload({
				galleryId,
				filename: file.name,
				mimeType: file.type,
				size: file.size,
				fingerprint: `${file.name}|${file.size}|${file.lastModified}`,
				previewSize,
			});
			if (!started.ok) throw new Error(started.error);
			const { sessionId, previewUploadUrl, ...plan } = started.data;

			try {
				if (info.blob && previewUploadUrl)
					await putWithProgress(previewUploadUrl, info.blob, () => {});
				await uploadParts({
					file,
					...plan,
					signBatch: PART_URLS_PER_REQUEST,
					sign: async (partNumbers) => {
						const signed = await signUploadParts({ sessionId, partNumbers });
						if (!signed.ok) throw new Error(signed.error);
						return signed.data;
					},
					onProgress,
					signal,
				});
			} catch (error) {
				// Cancelling frees the parts; any other failure keeps them to resume.
				if (error instanceof UploadCancelledError || signal.aborted)
					await abortGalleryUpload(sessionId);
				throw error;
			}

			const completed = await completeGalleryUpload({
				sessionId,
				previewSize,
				width: info.width,
				height: info.height,
				durationSec: info.durationSec,
			});
			if (!completed.ok) throw new Error(completed.error);
		},
		[galleryId],
	);

	return useUploadQueue({
		precheck,
		upload,
		onUploaded,
		concurrency: FILES_AT_ONCE,
	});
}
