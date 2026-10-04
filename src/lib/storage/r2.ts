import "server-only";

import { getR2Env } from "@/lib/env";
import { deleteKeys, head, presignPut } from "./s3-core";

/** Public media bucket (portfolio, site assets), served from R2_PUBLIC_URL. */
export function getUploadUrl(key: string, contentType: string, size: number) {
	return presignPut(getR2Env().R2_BUCKET, key, contentType, size);
}

export function headObject(key: string) {
	return head(getR2Env().R2_BUCKET, key);
}

export function deleteObjects(keys: string[]) {
	return deleteKeys(getR2Env().R2_BUCKET, keys);
}

export function publicUrl(key: string) {
	return `${getR2Env().R2_PUBLIC_URL}/${key}`;
}
