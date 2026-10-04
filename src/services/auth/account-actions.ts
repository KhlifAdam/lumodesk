"use server";

import { type ActionResult, fail, ok } from "@/lib/action-result";
import { requireUser } from "@/lib/auth/require-user";
import { ROLES } from "@/lib/auth/roles";
import { db } from "@/lib/db";

/** Lets a client account open a studio with the same login. */
export async function upgradeToPhotographer(): Promise<ActionResult> {
	const session = await requireUser();
	const { id, role } = session.user;
	if (role === ROLES.photographer) return ok();
	if (role !== ROLES.client) return fail("invalidInput");

	await db.user.update({ where: { id }, data: { role: ROLES.photographer } });
	return ok();
}
