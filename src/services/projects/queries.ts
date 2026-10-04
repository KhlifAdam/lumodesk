import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { listGallerySummaries } from "@/services/galleries/summaries";
import { pageMeta, pageSkip } from "@/services/shared/pagination";
import { type ListProjectsParams, PROJECT_PAGE_SIZE } from "./schemas";
import type { ProjectDetail, ProjectPage, ProjectSummary } from "./types";

const projectInclude = {
	client: { select: { id: true, name: true, email: true } },
	_count: { select: { galleries: true } },
} satisfies Prisma.ProjectInclude;

type ProjectRow = Prisma.ProjectGetPayload<{ include: typeof projectInclude }>;

function toSummary(row: ProjectRow): ProjectSummary {
	return {
		id: row.id,
		title: row.title,
		stage: row.stage,
		eventDate: row.eventDate?.toISOString() ?? null,
		location: row.location ?? "",
		client: {
			id: row.client?.id ?? null,
			name: row.client?.name ?? null,
			email: row.client?.email ?? row.inviteEmail,
			status: row.inviteStatus,
		},
		galleryCount: row._count.galleries,
		updatedAt: row.updatedAt.toISOString(),
	};
}

/** `clientId` narrows the list to one client's projects (client page). */
export async function listProjects(
	photographerId: string,
	{ page, q, stage }: ListProjectsParams,
	clientId?: string,
): Promise<ProjectPage> {
	const where: Prisma.ProjectWhereInput = { photographerId };
	if (stage) where.stage = stage;
	if (clientId) where.clientId = clientId;
	if (q) {
		where.OR = [
			{ title: { contains: q, mode: "insensitive" } },
			{ inviteEmail: { contains: q, mode: "insensitive" } },
			{ client: { name: { contains: q, mode: "insensitive" } } },
		];
	}

	const total = await db.project.count({ where });
	const meta = pageMeta(page, total, PROJECT_PAGE_SIZE);
	const rows = await db.project.findMany({
		where,
		include: projectInclude,
		orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
		skip: pageSkip(meta.page, PROJECT_PAGE_SIZE),
		take: PROJECT_PAGE_SIZE,
	});
	return { ...meta, items: rows.map(toSummary) };
}

export async function getProject(
	photographerId: string,
	id: string,
): Promise<ProjectDetail | null> {
	const row = await db.project.findFirst({
		where: { id, photographerId },
		include: projectInclude,
	});
	if (!row) return null;

	return {
		...toSummary(row),
		description: row.description ?? "",
		galleries: await listGallerySummaries({ projectId: id, photographerId }),
	};
}
