import { Prisma } from "@/generated/prisma/client";

/** Unique constraint violation (e.g. a slug claimed concurrently). */
export function isUniqueViolation(error: unknown) {
	return (
		error instanceof Prisma.PrismaClientKnownRequestError &&
		error.code === "P2002"
	);
}
