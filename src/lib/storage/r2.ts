import "server-only";

import {
	DeleteObjectsCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Env } from "@/lib/env";

const UPLOAD_URL_TTL_SECONDS = 60 * 10;

let client: S3Client | undefined;

function getClient() {
	const env = getR2Env();
	client ??= new S3Client({
		region: "auto",
		endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: env.R2_ACCESS_KEY_ID,
			secretAccessKey: env.R2_SECRET_ACCESS_KEY,
		},
	});
	return client;
}

/** Presigned PUT URL; the browser uploads straight to R2 with it. */
export function getUploadUrl(key: string, contentType: string, size: number) {
	const command = new PutObjectCommand({
		Bucket: getR2Env().R2_BUCKET,
		Key: key,
		ContentType: contentType,
		ContentLength: size,
	});
	return getSignedUrl(getClient(), command, {
		expiresIn: UPLOAD_URL_TTL_SECONDS,
	});
}

/** Returns the stored object's size and type, or null if it doesn't exist. */
export async function headObject(key: string) {
	try {
		const res = await getClient().send(
			new HeadObjectCommand({ Bucket: getR2Env().R2_BUCKET, Key: key }),
		);
		return { size: res.ContentLength ?? 0, contentType: res.ContentType };
	} catch {
		return null;
	}
}

export async function deleteObjects(keys: string[]) {
	if (keys.length === 0) return;
	await getClient().send(
		new DeleteObjectsCommand({
			Bucket: getR2Env().R2_BUCKET,
			Delete: { Objects: keys.map((Key) => ({ Key })) },
		}),
	);
}

export function publicUrl(key: string) {
	return `${getR2Env().R2_PUBLIC_URL}/${key}`;
}
