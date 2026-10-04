import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";
import { env } from "@/lib/env";

// `unknown`: after regeneration the cached value is an instance of an old class.
const globalForPrisma = globalThis as unknown as { prisma?: unknown };

function createPrismaClient() {
	const pool = new Pool({ connectionString: env.DATABASE_URL });
	return new PrismaClient({ adapter: new PrismaPg(pool) });
}

/**
 * The client is cached across dev hot reloads, but only while it comes from
 * the current generated code. After a migration + `prisma generate`, the
 * PrismaClient class changes, so a stale client (missing new columns) is
 * replaced instead of silently returning undefined fields.
 */
function getPrismaClient() {
	const cached = globalForPrisma.prisma;
	if (cached instanceof PrismaClient) return cached;
	void (
		cached as { $disconnect?: () => Promise<void> } | undefined
	)?.$disconnect?.();
	return createPrismaClient();
}

/** Shared Prisma client. */
export const db = getPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = db;
}
