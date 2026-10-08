import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { realEmail } from "@/lib/phone";
import { pageMeta, pageSkip } from "@/services/shared/pagination";
import { CLIENT_PAGE_SIZE, type ListClientsParams } from "./schemas";
import type { ClientDetail, ClientPage, ClientSummary } from "./types";

/**
 * A photographer may only see people who accepted one of their projects
 * (`clientId` is set only on acceptance). This is the whole access rule.
 */
export function sharesProjectWith(
	photographerId: string,
): Prisma.UserWhereInput {
	return { clientProjects: { some: { photographerId } } };
}

function clientSelect(photographerId: string) {
	return {
		id: true,
		name: true,
		email: true,
		phoneNumber: true,
		image: true,
		_count: {
			select: { clientProjects: { where: { photographerId } } },
		},
	} satisfies Prisma.UserSelect;
}

type ClientRow = Prisma.UserGetPayload<{
	select: ReturnType<typeof clientSelect>;
}>;

function toSummary(row: ClientRow): ClientSummary {
	return {
		id: row.id,
		name: row.name,
		email: realEmail(row.email) ?? "",
		phone: row.phoneNumber ?? "",
		image: row.image,
		projectCount: row._count.clientProjects,
	};
}

export async function listClients(
	photographerId: string,
	{ page, q }: ListClientsParams,
): Promise<ClientPage> {
	const where: Prisma.UserWhereInput = sharesProjectWith(photographerId);
	if (q) {
		where.OR = [
			{ name: { contains: q, mode: "insensitive" } },
			{ email: { contains: q, mode: "insensitive" } },
			{ phoneNumber: { contains: q.replace(/\s/g, "") } },
		];
	}
	const total = await db.user.count({ where });
	const meta = pageMeta(page, total, CLIENT_PAGE_SIZE);
	const rows = await db.user.findMany({
		where,
		select: clientSelect(photographerId),
		orderBy: [{ name: "asc" }, { id: "asc" }],
		skip: pageSkip(meta.page, CLIENT_PAGE_SIZE),
		take: CLIENT_PAGE_SIZE,
	});
	return { ...meta, items: rows.map(toSummary) };
}

export async function getClient(
	photographerId: string,
	clientId: string,
): Promise<ClientDetail | null> {
	const [row, profile] = await Promise.all([
		db.user.findFirst({
			where: { id: clientId, ...sharesProjectWith(photographerId) },
			select: clientSelect(photographerId),
		}),
		db.clientProfile.findUnique({
			where: { photographerId_clientId: { photographerId, clientId } },
			select: { notes: true },
		}),
	]);
	return row ? { ...toSummary(row), notes: profile?.notes ?? "" } : null;
}

/** A few of the photographer's clients matching `q`, for pickers. */
export async function searchClients(
	photographerId: string,
	q: string,
	take: number,
) {
	const where: Prisma.UserWhereInput = sharesProjectWith(photographerId);
	if (q)
		where.OR = [
			{ name: { contains: q, mode: "insensitive" } },
			{ email: { contains: q, mode: "insensitive" } },
			{ phoneNumber: { contains: q.replace(/\s/g, "") } },
		];
	const rows = await db.user.findMany({
		where,
		select: {
			id: true,
			name: true,
			email: true,
			phoneNumber: true,
			image: true,
		},
		orderBy: [{ name: "asc" }, { id: "asc" }],
		take,
	});
	return rows.map(({ email, phoneNumber, ...row }) => ({
		...row,
		email: realEmail(email) ?? "",
		phone: phoneNumber ?? "",
	}));
}
