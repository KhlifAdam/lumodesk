import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { realEmail } from "@/lib/phone";
import { listGallerySummaries } from "@/services/galleries/summaries";
import { pageMeta, pageSkip } from "@/services/shared/pagination";
import { type ListProjectsParams, PROJECT_PAGE_SIZE } from "./schemas";
import type { ProjectDetail, ProjectPage, ProjectSummary } from "./types";

const projectInclude = {
	client: {
		select: { id: true, name: true, email: true, phoneNumber: true },
	},
	_count: { select: { galleries: true } },
	booking: { select: { id: true } },
} satisfies Prisma.ProjectInclude;

type ProjectRow = Prisma.ProjectGetPayload<{ include: typeof projectInclude }>;

function toSummary(row: ProjectRow): ProjectSummary {
	return {
		id: row.id,
		title: row.title,
		stage: row.stage,
		serviceType: row.serviceType,
		mediaType: row.mediaType,
		eventDate: row.eventDate?.toISOString() ?? null,
		location: row.location ?? "",
		client: {
			id: row.client?.id ?? null,
			name: row.client?.name ?? null,
			// A phone-only account's placeholder email is never shown.
			email: row.client ? realEmail(row.client.email) : row.inviteEmail,
			phone: row.client?.phoneNumber ?? row.invitePhone,
			status: row.inviteStatus,
		},
		price: row.price?.toNumber() ?? null,
		advance: row.advance.toNumber(),
		paymentStatus: row.paymentStatus,
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
			{ invitePhone: { contains: q } },
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
		bookingId: row.booking?.id ?? null,
		clientPhone: row.clientPhone ?? "",
		contactName: row.contactName ?? "",
		contactPhone: row.contactPhone ?? "",
		clientNotes: row.clientNotes ?? "",
		startTime: row.startTime ?? "",
		endTime: row.endTime ?? "",
		locationType: row.locationType ?? "",
		deliveryDeadline: row.deliveryDeadline?.toISOString() ?? null,
		equipment: row.equipment ?? "",
		financialNotes: row.financialNotes ?? "",
		team: row.team ?? "",
		internalNotes: row.internalNotes ?? "",
		galleries: await listGallerySummaries({ projectId: id, photographerId }),
	};
}
