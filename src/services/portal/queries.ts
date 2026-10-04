import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { studioBrandSelect, toStudioBrand } from "@/services/clients/branding";
import { listGallerySummaries } from "@/services/galleries/summaries";
import { pageMeta, pageSkip } from "@/services/shared/pagination";
import type {
	PortalProject,
	PortalProjectDetail,
	PortalProjectPage,
} from "./types";

export const PORTAL_PAGE_SIZE = 12;

const portalInclude = {
	photographer: {
		select: { name: true, studio: { select: studioBrandSelect } },
	},
	_count: { select: { galleries: { where: { sharedAt: { not: null } } } } },
} satisfies Prisma.ProjectInclude;

type PortalRow = Prisma.ProjectGetPayload<{ include: typeof portalInclude }>;

function toPortalProject(row: PortalRow): PortalProject {
	const { studio, name } = row.photographer;
	return {
		id: row.id,
		title: row.title,
		stage: row.stage,
		eventDate: row.eventDate?.toISOString() ?? null,
		location: row.location ?? "",
		studio: studio ? toStudioBrand(studio) : null,
		photographerName: name,
		sharedGalleryCount: row._count.galleries,
	};
}

/** Every project of this client, across all photographers. */
export async function listPortalProjects(
	clientId: string,
	requestedPage: number,
): Promise<PortalProjectPage> {
	const where = { clientId };
	const total = await db.project.count({ where });
	const meta = pageMeta(requestedPage, total, PORTAL_PAGE_SIZE);
	const rows = await db.project.findMany({
		where,
		include: portalInclude,
		orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
		skip: pageSkip(meta.page, PORTAL_PAGE_SIZE),
		take: PORTAL_PAGE_SIZE,
	});
	return { ...meta, items: rows.map(toPortalProject) };
}

export async function getPortalProject(
	clientId: string,
	id: string,
): Promise<PortalProjectDetail | null> {
	const row = await db.project.findFirst({
		where: { id, clientId },
		include: portalInclude,
	});
	if (!row) return null;

	return {
		...toPortalProject(row),
		description: row.description ?? "",
		galleries: await listGallerySummaries({
			projectId: id,
			sharedAt: { not: null },
		}),
	};
}

const INVITATIONS_LIMIT = 20;

/** Invitations waiting for this address. Only call with a verified email. */
export async function listPendingInvitations(
	email: string,
): Promise<PortalProject[]> {
	const rows = await db.project.findMany({
		where: { inviteEmail: email.toLowerCase(), inviteStatus: "PENDING" },
		include: portalInclude,
		orderBy: { invitedAt: "desc" },
		take: INVITATIONS_LIMIT,
	});
	return rows.map(toPortalProject);
}

/** Shown to unverified accounts, which must verify before seeing details. */
export function countPendingInvitations(email: string) {
	return db.project.count({
		where: { inviteEmail: email.toLowerCase(), inviteStatus: "PENDING" },
	});
}
