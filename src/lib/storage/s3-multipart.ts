import "server-only";

import {
	AbortMultipartUploadCommand,
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	ListPartsCommand,
	UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getClient } from "./s3-core";

/** A part URL is used right away; an hour covers slow connections. */
const PART_URL_TTL_SECONDS = 60 * 60;

export async function createMultipart(
	bucket: string,
	key: string,
	contentType: string,
) {
	const res = await getClient().send(
		new CreateMultipartUploadCommand({
			Bucket: bucket,
			Key: key,
			ContentType: contentType,
		}),
	);
	if (!res.UploadId) throw new Error("No upload id returned");
	return res.UploadId;
}

/** Presigned PUT for one part; the browser sends that slice of the file to it. */
export function presignPart(
	bucket: string,
	key: string,
	uploadId: string,
	partNumber: number,
) {
	return getSignedUrl(
		getClient(),
		new UploadPartCommand({
			Bucket: bucket,
			Key: key,
			UploadId: uploadId,
			PartNumber: partNumber,
		}),
		{ expiresIn: PART_URL_TTL_SECONDS },
	);
}

export interface StoredPart {
	partNumber: number;
	etag: string;
	size: number;
}

/**
 * The parts already stored. Reading them on the server means the browser never
 * has to read ETag headers (which the bucket's CORS would have to expose).
 */
export async function listParts(
	bucket: string,
	key: string,
	uploadId: string,
): Promise<StoredPart[]> {
	const parts: StoredPart[] = [];
	let marker: string | undefined;
	do {
		const res = await getClient().send(
			new ListPartsCommand({
				Bucket: bucket,
				Key: key,
				UploadId: uploadId,
				PartNumberMarker: marker,
			}),
		);
		for (const part of res.Parts ?? []) {
			if (part.PartNumber && part.ETag)
				parts.push({
					partNumber: part.PartNumber,
					etag: part.ETag,
					size: part.Size ?? 0,
				});
		}
		marker = res.IsTruncated ? res.NextPartNumberMarker : undefined;
	} while (marker);
	return parts.sort((a, b) => a.partNumber - b.partNumber);
}

export async function completeMultipart(
	bucket: string,
	key: string,
	uploadId: string,
	parts: StoredPart[],
) {
	await getClient().send(
		new CompleteMultipartUploadCommand({
			Bucket: bucket,
			Key: key,
			UploadId: uploadId,
			MultipartUpload: {
				Parts: parts.map((part) => ({
					PartNumber: part.partNumber,
					ETag: part.etag,
				})),
			},
		}),
	);
}

/** Frees the stored parts of an upload that will not be finished. */
export async function abortMultipart(
	bucket: string,
	key: string,
	uploadId: string,
) {
	await getClient().send(
		new AbortMultipartUploadCommand({
			Bucket: bucket,
			Key: key,
			UploadId: uploadId,
		}),
	);
}
