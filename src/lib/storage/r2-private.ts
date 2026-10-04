import "server-only";

import { getR2PrivateEnv } from "@/lib/env";
import { deleteKeys, head, presignGet, presignPut } from "./s3-core";

const VIEW_URL_TTL_SECONDS = 60 * 60;
/** Signatures are made at the start of a window, so URLs repeat and stay cacheable. */
const SIGNING_WINDOW_MS = 15 * 60 * 1000;

const bucket = () => getR2PrivateEnv().R2_PRIVATE_BUCKET;

/**
 * Private bucket for client galleries. It has no public access: objects are
 * only reachable through short-lived signed URLs, issued after an access check.
 */
export function getPrivateUploadUrl(
	key: string,
	contentType: string,
	size: number,
) {
	return presignPut(bucket(), key, contentType, size);
}

export function getPrivateViewUrl(key: string) {
	const windowStart = Math.floor(Date.now() / SIGNING_WINDOW_MS);
	return presignGet(
		bucket(),
		key,
		VIEW_URL_TTL_SECONDS,
		new Date(windowStart * SIGNING_WINDOW_MS),
	);
}

export function headPrivateObject(key: string) {
	return head(bucket(), key);
}

export function deletePrivateObjects(keys: string[]) {
	return deleteKeys(bucket(), keys);
}
