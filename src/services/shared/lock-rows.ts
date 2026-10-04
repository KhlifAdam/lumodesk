import "server-only";

import type { Prisma } from "@/generated/prisma/client";

/**
 * Row locks that serialize concurrent writes, so count-then-write rules
 * (limits, page positions) can't be broken by two requests at once.
 */
export async function lockPhotographer(
	tx: Prisma.TransactionClient,
	photographerId: string,
) {
	await tx.$queryRaw`SELECT id FROM users WHERE id = ${photographerId} FOR UPDATE`;
}

export async function lockAlbum(tx: Prisma.TransactionClient, albumId: string) {
	await tx.$queryRaw`SELECT id FROM albums WHERE id = ${albumId} FOR UPDATE`;
}

export async function lockGallery(
	tx: Prisma.TransactionClient,
	galleryId: string,
) {
	await tx.$queryRaw`SELECT id FROM galleries WHERE id = ${galleryId} FOR UPDATE`;
}
